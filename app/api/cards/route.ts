import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

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

    if (!Array.isArray(sentences) || sentences.length !== 3 || sentences.some((s: unknown) => typeof s !== 'string')) {
      return NextResponse.json({ error: 'three sentences required' }, { status: 400 })
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
      },
    })

    return NextResponse.json({ card }, { status: 201 })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Create card error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
