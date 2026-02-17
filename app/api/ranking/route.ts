import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/ranking
 * Returns all users ranked by monthly XP (descending).
 * Public endpoint — visible to everybody.
 * Automatically resets monthlyXp for users whose monthlyXpResetAt is in a previous month.
 */
export async function GET() {
  try {
    const now = new Date()
    const currentMonth = now.getUTCMonth()
    const currentYear = now.getUTCFullYear()

    // Fetch all users with XP data
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        totalXp: true,
        monthlyXp: true,
        monthlyXpResetAt: true,
        streakCount: true,
      },
      orderBy: { monthlyXp: 'desc' },
    })

    // Build ranking with stale-month detection
    const ranked = users.map((u, index) => {
      const resetMonth = u.monthlyXpResetAt.getUTCMonth()
      const resetYear = u.monthlyXpResetAt.getUTCFullYear()
      const isStale = resetMonth !== currentMonth || resetYear !== currentYear

      return {
        rank: index + 1,
        id: u.id,
        name: u.name ?? 'Learner',
        image: u.image,
        totalXp: u.totalXp,
        monthlyXp: isStale ? 0 : u.monthlyXp,
        streakCount: u.streakCount,
      }
    })

    // Re-sort after stale correction
    ranked.sort((a, b) => b.monthlyXp - a.monthlyXp || b.totalXp - a.totalXp)
    ranked.forEach((u, i) => (u.rank = i + 1))

    return NextResponse.json({ ranking: ranked })
  } catch (err) {
    console.error('Ranking error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
