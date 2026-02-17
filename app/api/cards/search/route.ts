import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')

  if (!q) {
    return NextResponse.json([])
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const cards = await prisma.card.findMany({
      where: {
        userId: user.id,
        word: {
          contains: q,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        word: true,
        imageUrl: true,
        // minimal fields for list
      },
      take: 20, // Limit results
    })

    return NextResponse.json(cards)
  } catch (error) {
    console.error('Search error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
