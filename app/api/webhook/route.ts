import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  validateEvent,
  WebhookVerificationError,
} from '@polar-sh/sdk/webhooks'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const headers = Object.fromEntries(req.headers.entries())

    // Verify the webhook signature — required in production
    let event: any
    if (process.env.POLAR_WEBHOOK_SECRET) {
      try {
        event = validateEvent(body, headers, process.env.POLAR_WEBHOOK_SECRET)
      } catch (err) {
        if (err instanceof WebhookVerificationError) {
          console.error('Webhook verification failed:', err.message)
          return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
        }
        throw err
      }
    } else if (process.env.NODE_ENV === 'production') {
      // In production, POLAR_WEBHOOK_SECRET must be configured
      console.error('POLAR_WEBHOOK_SECRET is not configured in production!')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    } else {
      // Development only — parse raw body without verification
      console.warn('⚠️ Webhook signature verification skipped (dev mode)')
      event = JSON.parse(body)
    }

    const eventType = event.type
    const data = event.data

    switch (eventType) {
      // Subscription created or updated
      case 'subscription.created':
      case 'subscription.updated': {
        const customerId = data.customer_id
        const subscriptionId = data.id
        const status = data.status // 'active', 'canceled', 'past_due', etc.
        const userEmail = data.customer?.email
        const userId = data.metadata?.userId

        // Find user by userId from metadata, or by email
        let user = null
        if (userId) {
          user = await prisma.user.findUnique({ where: { id: userId } })
        }
        if (!user && userEmail) {
          user = await prisma.user.findUnique({ where: { email: userEmail } })
        }
        if (!user && customerId) {
          user = await prisma.user.findFirst({ where: { polarCustomerId: customerId } })
        }

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              isPro: status === 'active',
              polarCustomerId: customerId,
              polarSubscriptionId: subscriptionId,
              subscriptionStatus: status,
              subscriptionStartedAt: data.started_at ? new Date(data.started_at) : new Date(),
              subscriptionEndsAt: data.current_period_end ? new Date(data.current_period_end) : null,
            },
          })
        }
        break
      }

      // Subscription canceled or revoked
      case 'subscription.canceled':
      case 'subscription.revoked': {
        const subscriptionId = data.id
        const userEmail = data.customer?.email
        const userId = data.metadata?.userId

        let user = null
        if (userId) {
          user = await prisma.user.findUnique({ where: { id: userId } })
        }
        if (!user && userEmail) {
          user = await prisma.user.findUnique({ where: { email: userEmail } })
        }
        if (!user && subscriptionId) {
          user = await prisma.user.findFirst({ where: { polarSubscriptionId: subscriptionId } })
        }

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              isPro: false,
              subscriptionStatus: 'canceled',
              subscriptionEndsAt: data.ended_at ? new Date(data.ended_at) : new Date(),
            },
          })
        }
        break
      }

      // Order completed (one-time or first payment)
      case 'order.created': {
        const userEmail = data.customer?.email
        const userId = data.metadata?.userId
        const customerId = data.customer_id

        let user = null
        if (userId) {
          user = await prisma.user.findUnique({ where: { id: userId } })
        }
        if (!user && userEmail) {
          user = await prisma.user.findUnique({ where: { email: userEmail } })
        }

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              isPro: true,
              polarCustomerId: customerId || undefined,
              subscriptionStatus: 'active',
              subscriptionStartedAt: new Date(),
            },
          })
        }
        break
      }

      default:
        console.log(`Unhandled webhook event: ${eventType}`)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}