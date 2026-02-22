import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { awardXp } from '@/lib/xp'

const INITIAL_REVIEW_MS = 15 * 60 * 1000 // 15 minutes

function sanitizeCard(card: any) {
  if (!card) return card
  return {
    ...card,
    currentIntervalMs: card.currentIntervalMs !== undefined ? Number(card.currentIntervalMs) : 0,
  }
}

/**
 * Award XP immediately after a card review (success or struggle).
 * Called per-swipe so XP is persisted even if the user exits mid-session.
 *   +10 base XP when the user engaged (waited ≥ 1.5 s after flip)
 *   +5  bonus  when the user listened to audio before swiping
 */
async function awardReviewXp(
  userId: string,
  earnedReviewXp: boolean | undefined,
  audioPlayed: boolean | undefined,
  updatedCard: any,
) {
  if (earnedReviewXp) {
    const xpAmount = audioPlayed ? 15 : 10
    await awardXp(userId, xpAmount)
    return NextResponse.json({ card: sanitizeCard(updatedCard), xpAwarded: xpAmount })
  }
  return NextResponse.json({ card: sanitizeCard(updatedCard) })
}

// POST: Create a new card for the logged-in user
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // @ts-ignore
    const userId = session.user.id

    const body = await req.json()
    const { word, sentences, imageUrl } = body || {}

    if (!word || !sentences || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // ISSUE-020: Validate types and contents of input fields
    if (typeof word !== 'string' || word.trim().length === 0 || word.length > 100) {
      return NextResponse.json({ error: 'Invalid word: must be a non-empty string (max 100 chars)' }, { status: 400 })
    }
    if (!Array.isArray(sentences) || sentences.length === 0 || sentences.length > 20 ||
        !sentences.every((s: unknown) => typeof s === 'string' && s.trim().length > 0)) {
      return NextResponse.json({ error: 'Invalid sentences: must be a non-empty array of non-empty strings (max 20)' }, { status: 400 })
    }
    if (typeof imageUrl !== 'string' || imageUrl.trim().length === 0 || imageUrl.length > 2048) {
      return NextResponse.json({ error: 'Invalid imageUrl: must be a non-empty string (max 2048 chars)' }, { status: 400 })
    }

    const card = await prisma.card.create({
      data: { userId, word, imageUrl, sentences },
      select: { id: true, word: true, imageUrl: true, sentences: true, nextReviewAt: true },
    })

    // Award +50 XP for creating a card
    await awardXp(userId, 50)

    return NextResponse.json({ card }, { status: 201 })
  } catch (err) {
    console.error('Create card error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}

// GET: Fetch cards for the logged-in user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // @ts-ignore
    const userId = session.user.id

    const url = new URL(req.url)
    const dueOnly = url.searchParams.get('dueOnly') === 'true'

    const where: any = { userId }
    if (dueOnly) where.nextReviewAt = { lte: new Date() }

    let cards = await prisma.card.findMany({
      where,
      orderBy: { nextReviewAt: 'asc' },
    })

    // ISSUE-002: Rotation removed from GET — card rotation should only happen
    // explicitly via a PATCH request when the user actually reviews or skips a card.

    return NextResponse.json({ cards: cards.map(sanitizeCard) })
  } catch (err) {
    console.error('Fetch cards error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}

// PATCH: Review or rotate a card
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // @ts-ignore
    const userId = session.user.id

    const body = await req.json()
    const { cardId, action, result, earnedReviewXp, audioPlayed } = body || {}

    // Verify ownership before updating
    const card = await prisma.card.findUnique({ where: { id: cardId } })
    if (!card) return NextResponse.json({ error: 'card_not_found' }, { status: 404 })
    if (card.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    if (action === 'rotate') {
      const nextIndex = (card.currentSentenceIndex + 1) % card.sentences.length
      // ISSUE-009: Include userId in where clause for defense-in-depth
      const updated = await prisma.card.update({ where: { id: cardId, userId }, data: { currentSentenceIndex: nextIndex } })
      return NextResponse.json({ card: sanitizeCard(updated) })
    }

    if (action === 'review') {
      const now = new Date()
      if (result === 'success') {
        const prevInterval = Number(card.currentIntervalMs || 0)
        const currentEase = Number(card.easeFactor || 2.5)
        const intervalMs = prevInterval > 0 ? Math.round(prevInterval * currentEase) : INITIAL_REVIEW_MS

        // ISSUE-019: Dynamically adjust ease factor on success
        // Increase slightly (capped at 3.0) to reward consistent recall
        const newEaseFactor = Math.min(currentEase + 0.1, 3.0)

        // ISSUE-009: Include userId in where clause for defense-in-depth
        const updated = await prisma.card.update({
          where: { id: cardId, userId },
          data: {
            consecutiveCorrect: { increment: 1 },
            currentIntervalMs: BigInt(intervalMs),
            easeFactor: newEaseFactor,
            lastReviewedAt: now,
            nextReviewAt: new Date(Date.now() + intervalMs),
          },
        })
        // XP awarded below (shared logic for success + struggle)
        return await awardReviewXp(userId, earnedReviewXp, audioPlayed, updated)
      }

      // ISSUE-019: Decrease ease factor on failure (min 1.3) per SM-2 algorithm
      const currentEase = Number(card.easeFactor || 2.5)
      const newEaseFactor = Math.max(currentEase - 0.2, 1.3)

      // ISSUE-009: Include userId in where clause for defense-in-depth
      const updated = await prisma.card.update({
        where: { id: cardId, userId },
        data: {
          consecutiveCorrect: 0,
          currentIntervalMs: BigInt(0),
          easeFactor: newEaseFactor,
          lastReviewedAt: now,
          nextReviewAt: now,
        },
      })
      // XP awarded below (shared logic for success + struggle)
      return await awardReviewXp(userId, earnedReviewXp, audioPlayed, updated)
    }

    return NextResponse.json({ error: 'unknown_action' }, { status: 400 })
  } catch (err) {
    console.error('Patch card error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
