import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

const SHORT_TERM_REQUEUE_MS = 1 * 1000 // 1 second
const INITIAL_REVIEW_MS = 2 * 60 * 1000 // 2 minutes

function sanitizeCard(card: any) {
  if (!card) return card
  return {
    ...card,
    currentIntervalMs: card.currentIntervalMs !== undefined ? Number(card.currentIntervalMs) : 0,
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, word, sentences, imageUrl } = body || {}

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    if (!word || typeof word !== 'string') {
      return NextResponse.json({ error: 'word required' }, { status: 400 })
    }

    if (!Array.isArray(sentences) || sentences.length === 0 || sentences.some((s: unknown) => typeof s !== 'string')) {
      return NextResponse.json({ error: 'sentences array required' }, { status: 400 })
    }

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json({ error: 'imageUrl required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'user_not_found' }, { status: 404 })

    const card = await prisma.card.create({
      data: {
        userId,
        word,
        imageUrl,
        sentences,
      },
      select: {
        id: true,
        word: true,
        imageUrl: true,
        sentences: true,
        currentSentenceIndex: true,
        consecutiveCorrect: true,
        easeFactor: true,
        lastReviewedAt: true,
        nextReviewAt: true,
      },
    })

    return NextResponse.json({ card }, { status: 201 })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Create card error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}



//-----------------------------GET /api/cards - fetch cards for review, with optional dueOnly filter and sentence rotation-----------------------------//
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')
    const dueOnly = url.searchParams.get('dueOnly') === 'true'
    const doRotate = url.searchParams.get('rotate') === 'true'

    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const where: any = { userId }
    if (dueOnly) {
      where.nextReviewAt = { lte: new Date() }
    }

    //fetch cards ordered by next review time ascending
    let cards = await prisma.card.findMany({
      where,
      orderBy: { nextReviewAt: 'asc' },
      select: {
        id: true,
        word: true,
        imageUrl: true,
        sentences: true,
        currentSentenceIndex: true,
        consecutiveCorrect: true,
        easeFactor: true,
        lastReviewedAt: true,
        nextReviewAt: true,
        currentIntervalMs: true,
      },
    })

    //update fetched cards in the database, then return updated cards to client
    if (doRotate && cards.length > 0) {
      // rotate each card's sentence index linearly and return updated cards
      const updates = cards.map((c) => {
        const nextIndex = (c.currentSentenceIndex + 1) % c.sentences.length
        return prisma.card.update({
          where: { id: c.id },
          data: { currentSentenceIndex: nextIndex },
        })
      })
      cards = await prisma.$transaction(updates)
    }

    const out = cards.map(sanitizeCard)
    return NextResponse.json({ cards: out })
  } catch (err) {
    console.error('Fetch cards error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}




//-----------------------------PATCH /api/cards - handle review result or rotate sentence index-----------------------------//
export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { cardId, action, result } = body || {}

    if (!cardId || typeof cardId !== 'string') return NextResponse.json({ error: 'cardId required' }, { status: 400 })
    if (!action || typeof action !== 'string') return NextResponse.json({ error: 'action required' }, { status: 400 })

    //fetch cards using only cardId that user had previously fetched in GET /api/cards
    const card = await prisma.card.findUnique({ where: { id: cardId } })
    if (!card) return NextResponse.json({ error: 'card_not_found' }, { status: 404 })

    if (action === 'rotate') {
      const nextIndex = (card.currentSentenceIndex + 1) % card.sentences.length
      const updated = await prisma.card.update({ where: { id: cardId }, data: { currentSentenceIndex: nextIndex } })
      return NextResponse.json({ card: sanitizeCard(updated) })
    }

    if (action === 'review') {
      const now = new Date()
      if (result === 'success') {
        const prevInterval = Number(card.currentIntervalMs || 0) // in ms, 0 for first review
        const intervalMs = prevInterval > 0 ? Math.round(prevInterval * Number(card.easeFactor || 2.5)) : INITIAL_REVIEW_MS//update new interval based on ease factor, or use initial interval for first review
        const updated = await prisma.card.update({
          where: { id: cardId },
          data: {
            consecutiveCorrect: { increment: 1 },
            currentIntervalMs: BigInt(intervalMs) as any,
            lastReviewedAt: now,
            nextReviewAt: new Date(Date.now() + intervalMs),
          },
        })
        return NextResponse.json({ card: sanitizeCard(updated) })
      }

      // treat any non-success as failure/struggle
      const updated = await prisma.card.update({
        where: { id: cardId },
        data: {
          consecutiveCorrect: 0,
          currentIntervalMs: BigInt(0) as any,
          lastReviewedAt: now,
          nextReviewAt: new Date(Date.now() + 0),
        },
      })
      return NextResponse.json({ card: sanitizeCard(updated) })
    }

    return NextResponse.json({ error: 'unknown_action' }, { status: 400 })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Patch card error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
