import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

function sanitizeCard(card: any) {
  if (!card) return card
  return { ...card, currentIntervalMs: Number(card.currentIntervalMs || 0) }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // @ts-ignore
    const userId = session.user.id

    const { id } = await params
    const body = await req.json()
    const { word, sentences, imageUrl } = body || {}

    const card = await prisma.card.findUnique({ where: { id } })
    if (!card) return NextResponse.json({ error: 'card_not_found' }, { status: 404 })

    // SECURITY: Ensure user owns this card
    if (card.userId !== userId) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

    // ISSUE-012: Include userId in where clause for defense-in-depth
    const updated = await prisma.card.update({
      where: { id, userId },
      data: {
        ...(word && { word }),
        ...(sentences && { sentences }),
        ...(imageUrl && { imageUrl }),
      }
    })

    return NextResponse.json({ card: sanitizeCard(updated) })

  } catch (err) {
    console.error('Update card error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // @ts-ignore
    const userId = session.user.id

    const { id } = await params

    const card = await prisma.card.findUnique({ where: { id } })
    if (!card) return NextResponse.json({ error: 'card_not_found' }, { status: 404 })

    // SECURITY: Ensure user owns this card
    if (card.userId !== userId) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

    // ISSUE-012: Include userId in where clause for defense-in-depth
    await prisma.card.delete({
      where: { id, userId }
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Delete card error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}