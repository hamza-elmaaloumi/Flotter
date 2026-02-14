import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

function sanitizeCard(card: any) {
  if (!card) return card
  return {
    ...card,
    currentIntervalMs: card.currentIntervalMs !== undefined ? Number(card.currentIntervalMs) : 0,
  }
}

export async function PATCH(req: Request) {
  try {
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]

    if (!id) return NextResponse.json({ error: 'id_required' }, { status: 400 })

    const body = await req.json()
    const { userId, word, sentences, imageUrl } = body || {}

    if (!userId || typeof userId !== 'string') return NextResponse.json({ error: 'userId required' }, { status: 400 })

    if (word !== undefined && typeof word !== 'string') return NextResponse.json({ error: 'word must be string' }, { status: 400 })

    if (sentences !== undefined) {
      if (!Array.isArray(sentences) || sentences.some((s: unknown) => typeof s !== 'string')) {
        return NextResponse.json({ error: 'sentences must be an array of strings' }, { status: 400 })
      }
    }

    if (imageUrl !== undefined && typeof imageUrl !== 'string') return NextResponse.json({ error: 'imageUrl must be string' }, { status: 400 })

    if (word === undefined && sentences === undefined && imageUrl === undefined) {
      return NextResponse.json({ error: 'nothing_to_update' }, { status: 400 })
    }

    const card = await prisma.card.findUnique({ where: { id } })
    if (!card) return NextResponse.json({ error: 'card_not_found' }, { status: 404 })
    if (card.userId !== userId) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

    const data: any = {}
    if (word !== undefined) data.word = word
    if (sentences !== undefined) data.sentences = sentences
    if (imageUrl !== undefined) data.imageUrl = imageUrl

    const updated = await prisma.card.update({
      where: { id },
      data,
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

    return NextResponse.json({ card: sanitizeCard(updated) })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Update card error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
