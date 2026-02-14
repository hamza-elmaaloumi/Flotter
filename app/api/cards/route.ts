import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const INITIAL_REVIEW_MS = 2 * 60 * 1000 // 2 minutes

function sanitizeCard(card: any) {
  if (!card) return card
  return {
    ...card,
    currentIntervalMs: card.currentIntervalMs !== undefined ? Number(card.currentIntervalMs) : 0,
  }
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

    const card = await prisma.card.create({
      data: { userId, word, imageUrl, sentences },
      select: { id: true, word: true, imageUrl: true, sentences: true, nextReviewAt: true },
    })

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
    const doRotate = url.searchParams.get('rotate') === 'true'

    const where: any = { userId }
    if (dueOnly) where.nextReviewAt = { lte: new Date() }

    let cards = await prisma.card.findMany({
      where,
      orderBy: { nextReviewAt: 'asc' },
    })

    if (doRotate && cards.length > 0) {
      const updates = cards.map((c) => {
        const nextIndex = (c.currentSentenceIndex + 1) % c.sentences.length
        return prisma.card.update({
          where: { id: c.id },
          data: { currentSentenceIndex: nextIndex },
        })
      })
      cards = await prisma.$transaction(updates)
    }

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
    const { cardId, action, result } = body || {}

    // Verify ownership before updating
    const card = await prisma.card.findUnique({ where: { id: cardId } })
    if (!card) return NextResponse.json({ error: 'card_not_found' }, { status: 404 })
    if (card.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    if (action === 'rotate') {
      const nextIndex = (card.currentSentenceIndex + 1) % card.sentences.length
      const updated = await prisma.card.update({ where: { id: cardId }, data: { currentSentenceIndex: nextIndex } })
      return NextResponse.json({ card: sanitizeCard(updated) })
    }

    if (action === 'review') {
      const now = new Date()
      if (result === 'success') {
        const prevInterval = Number(card.currentIntervalMs || 0)
        const intervalMs = prevInterval > 0 ? Math.round(prevInterval * Number(card.easeFactor || 2.5)) : INITIAL_REVIEW_MS
        const updated = await prisma.card.update({
          where: { id: cardId },
          data: {
            consecutiveCorrect: { increment: 1 },
            currentIntervalMs: BigInt(intervalMs),
            lastReviewedAt: now,
            nextReviewAt: new Date(Date.now() + intervalMs),
          },
        })
        return NextResponse.json({ card: sanitizeCard(updated) })
      }

      const updated = await prisma.card.update({
        where: { id: cardId },
        data: {
          consecutiveCorrect: 0,
          currentIntervalMs: BigInt(0),
          lastReviewedAt: now,
          nextReviewAt: now,
        },
      })
      return NextResponse.json({ card: sanitizeCard(updated) })
    }

    return NextResponse.json({ error: 'unknown_action' }, { status: 400 })
  } catch (err) {
    console.error('Patch card error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}