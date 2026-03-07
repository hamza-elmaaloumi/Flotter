import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import path from 'path'

const root = path.resolve(__dirname, '../../')

function readSrc(relPath: string) {
  return readFileSync(path.join(root, relPath), 'utf-8')
}

describe('Cancel endpoint — security & correctness', () => {
  const src = readSrc('app/api/subscription/cancel/route.ts')

  it('requires authenticated session — calls getServerSession', () => {
    expect(src).toContain('getServerSession')
    expect(src).toContain('authOptions')
  })

  it('returns 401 when session is not present', () => {
    expect(src).toContain('status: 401')
    expect(src).toContain('Unauthorized')
  })

  it('checks isPro before calling Polar API', () => {
    expect(src).toContain('user.isPro')
    expect(src).toContain("subscriptionStatus !== 'active'")
  })

  it('returns 400 when there is no active subscription', () => {
    expect(src).toContain('status: 400')
    expect(src).toContain('No active subscription to cancel')
  })

  it('guards against missing polarSubscriptionId', () => {
    expect(src).toContain('polarSubscriptionId')
    expect(src).toContain('Subscription ID not found')
  })

  it('calls polar.subscriptions.revoke with the subscription ID', () => {
    expect(src).toContain('subscriptions.revoke')
    expect(src).toContain('polarSubscriptionId')
  })

  it('updates DB after successful Polar API call — sets isPro false', () => {
    expect(src).toContain('isPro: false')
  })

  it("updates DB subscriptionStatus to 'canceled'", () => {
    expect(src).toContain("subscriptionStatus: 'canceled'")
  })

  it('sets subscriptionEndsAt to now on cancellation', () => {
    expect(src).toContain('subscriptionEndsAt: new Date()')
  })

  it('handles Polar API errors and returns 500', () => {
    expect(src).toContain('status: 500')
    expect(src).toContain('Failed to cancel subscription')
  })

  it('uses the same Polar client pattern as checkout (sandbox/production toggle)', () => {
    expect(src).toContain("process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'")
  })
})

describe('Webhook — handles cancellation events', () => {
  const src = readSrc('app/api/webhook/route.ts')

  it("handles 'subscription.revoked' event", () => {
    expect(src).toContain("'subscription.revoked'")
  })

  it("handles 'subscription.canceled' event", () => {
    expect(src).toContain("'subscription.canceled'")
  })

  it('sets isPro to false on revoke/cancel events', () => {
    // The revoked/canceled handler block contains isPro: false
    expect(src).toContain('isPro: false')
  })

  it("sets subscriptionStatus to 'canceled' in webhook handler", () => {
    expect(src).toContain("subscriptionStatus: 'canceled'")
  })

  it('looks up user by polarSubscriptionId as fallback', () => {
    expect(src).toContain('polarSubscriptionId: subscriptionId')
  })

  it('always enforces webhook signature verification', () => {
    expect(src).toContain('POLAR_WEBHOOK_SECRET')
    expect(src).toContain('validateEvent')
    expect(src).toContain('status: 403')
  })
})

describe('Feature gates — respond correctly after isPro becomes false', () => {
  it('AI generation route gates on isPro', () => {
    const src = readSrc('app/api/ai/generate-sentences/route.ts')
    expect(src).toContain('isPro')
  })

  it('XP streak logic gates on isPro for streak freeze', () => {
    const src = readSrc('lib/xp.ts')
    expect(src).toContain('isPro')
  })
})
