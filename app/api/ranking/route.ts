import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getEffectiveStreak } from '@/lib/xp'

/**
 * GET /api/ranking
 * Returns top users ranked by monthly XP (descending).
 * Public endpoint — visible to everybody.
 * Paginated: defaults to top 100, supports ?limit= and ?offset= query params.
 *
 * CONSISTENCY FIX: The DB is queried with a large buffer (limit * 4 + 200) to
 * account for stale users whose raw monthlyXp is high but whose corrected
 * effective XP is 0. Without the buffer, stale users with high DB monthlyXp
 * occupied early pages — pushing legitimate users off the result set before
 * rank re-computation, causing different rank numbers depending on who viewed
 * the leaderboard. The buffer is fetched, stale-corrected in-memory, re-sorted,
 * and then the requested page is sliced out, guaranteeing consistent global ranks.
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

    // Over-fetch a buffer so stale users with high raw monthlyXp don't displace
    // real earners from the final sorted result.  Buffer = (offset + limit) * 4 + 200
    // ensures we always have enough real earners to fill the requested page.
    const bufferSize = (offset + limit) * 4 + 200

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
      take: bufferSize,
    })

    // Apply stale-month correction to every fetched user
    const corrected = users.map((u) => {
      const resetMonth = u.monthlyXpResetAt.getUTCMonth()
      const resetYear = u.monthlyXpResetAt.getUTCFullYear()
      const isStale = resetMonth !== currentMonth || resetYear !== currentYear

      return {
        id: u.id,
        name: u.name ?? 'Learner',
        image: u.image,
        totalXp: u.totalXp,
        monthlyXp: isStale ? 0 : u.monthlyXp,
        streakCount: getEffectiveStreak(u.streakCount, u.lastActiveDate, u.isPro),
        isPro: u.isPro,
      }
    })

    // Global sort over the full corrected buffer — this is the single source of truth
    corrected.sort((a, b) => b.monthlyXp - a.monthlyXp || b.totalXp - a.totalXp)

    // Assign globally consistent ranks (1-based from the very top)
    const allRanked = corrected.map((u, i) => ({ ...u, rank: i + 1 }))

    // Slice the requested page
    const page = allRanked.slice(offset, offset + limit)

    // Prevent client/CDN caching — ranking data must always be fresh
    return NextResponse.json(
      { ranking: page, limit, offset },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          Pragma: 'no-cache',
        },
      }
    )
  } catch (err) {
    console.error('Ranking error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
