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
      select: {
        id: true, name: true, email: true, image: true,
        createdAt: true, updatedAt: true,
        totalXp: true, monthlyXp: true, monthlyXpResetAt: true,
        streakCount: true, lastActiveDate: true,
      },
    })

    if (!user) return NextResponse.json({ error: 'user_not_found' }, { status: 404 })

    // Calculate user's rank by monthlyXp
    const now = new Date()
    const currentMonth = now.getUTCMonth()
    const currentYear = now.getUTCFullYear()

    const resetMonth = user.monthlyXpResetAt.getUTCMonth()
    const resetYear = user.monthlyXpResetAt.getUTCFullYear()
    const isStale = resetMonth !== currentMonth || resetYear !== currentYear
    const effectiveMonthlyXp = isStale ? 0 : user.monthlyXp

    // Count how many users have more monthly XP
    const usersAbove = await prisma.user.count({
      where: {
        monthlyXp: { gt: effectiveMonthlyXp },
        monthlyXpResetAt: {
          gte: new Date(currentYear, currentMonth, 1),
        },
      },
    })
    const rank = usersAbove + 1

    return NextResponse.json({
      user: {
        ...user,
        monthlyXp: effectiveMonthlyXp,
      },
      rank,
    })
  } catch (err) {
    console.error('Profile fetch error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // @ts-ignore
    const userId = session.user.id

    const body = await req.json()
    const { name, image } = body

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name !== undefined ? name : undefined,
        image: image !== undefined ? image : undefined,
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (err: any) {
    console.error('Profile update error', err)
    return NextResponse.json({ error: 'internal_error', details: err.message }, { status: 500 })
  }
}
