import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // @ts-ignore
    const userId = session.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true, createdAt: true, updatedAt: true },
    })

    if (!user) return NextResponse.json({ error: 'user_not_found' }, { status: 404 })

    return NextResponse.json({ user })
  } catch (err) {
    console.error('Profile fetch error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
