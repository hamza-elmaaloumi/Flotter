import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { Polar } from '@polar-sh/sdk'
import { prisma } from '@/lib/prisma'

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
})

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // @ts-ignore
    const userId = session.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isPro: true,
        subscriptionStatus: true,
        polarSubscriptionId: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.isPro || user.subscriptionStatus !== 'active') {
      return NextResponse.json({ error: 'No active subscription to cancel' }, { status: 400 })
    }

    if (!user.polarSubscriptionId) {
      return NextResponse.json({ error: 'Subscription ID not found' }, { status: 400 })
    }

    await polar.subscriptions.revoke({ id: user.polarSubscriptionId })

    await prisma.user.update({
      where: { id: userId },
      data: {
        isPro: false,
        subscriptionStatus: 'canceled',
        subscriptionEndsAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Cancel subscription error:', err)
    return NextResponse.json(
      { error: 'Failed to cancel subscription', details: err.message },
      { status: 500 }
    )
  }
}
