import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { awardXp } from '@/lib/xp'

/**
 * POST /api/xp/add
 * Body: { amount: number, reason: 'card_review' | 'audio_listen' | 'card_create' }
 * 
 * XP Rules:
 *   card_review  → 10 XP (flip + wait 1.5s + swipe)
 *   audio_listen → 5 XP  (listened to full audio)
 *   card_create  → 50 XP (created a new card)
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // @ts-ignore
    const userId = session.user.id

    const body = await req.json()
    const { amount, reason } = body || {}

    // Validate the amount matches known rewards
    const validRewards: Record<string, number> = {
      card_review: 10,
      audio_listen: 5,
      card_create: 50,
    }

    if (!reason || !validRewards[reason]) {
      return NextResponse.json({ error: 'invalid_reason' }, { status: 400 })
    }

    if (amount !== validRewards[reason]) {
      return NextResponse.json({ error: 'invalid_amount' }, { status: 400 })
    }

    const result = await awardXp(userId, amount)
    return NextResponse.json(result)
  } catch (err) {
    console.error('XP add error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
