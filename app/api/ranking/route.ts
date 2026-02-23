import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getEffectiveStreak } from '@/lib/xp'

/**
 * GET /api/ranking
 * Returns top users ranked by monthly XP (descending).
 * Public endpoint — visible to everybody.
 * Paginated: defaults to top 100, supports ?limit= and ?offset= query params.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '100'), 1), 100)
    // ISSUE-011: Cap offset at 1000 to prevent DoS via deep pagination
    const offset = Math.min(Math.max(parseInt(url.searchParams.get('offset') || '0'), 0), 1000)

    const now = new Date()
    const currentMonth = now.getUTCMonth()
    const currentYear = now.getUTCFullYear()

    // Fetch only the requested page of users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        totalXp: true,
        monthlyXp: true,
        monthlyXpResetAt: true,
        streakCount: true,
        lastActiveDate: true,
        isPro: true,
      },
      orderBy: { monthlyXp: 'desc' },
      take: limit,
      skip: offset,
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
        streakCount: getEffectiveStreak(u.streakCount, u.lastActiveDate, u.isPro),
        isPro: u.isPro,
      }
    })

    // Re-sort after stale correction
    ranked.sort((a, b) => b.monthlyXp - a.monthlyXp || b.totalXp - a.totalXp)
    ranked.forEach((u, i) => (u.rank = offset + i + 1))

    return NextResponse.json({ ranking: ranked, limit, offset })
  } catch (err) {
    console.error('Ranking error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
