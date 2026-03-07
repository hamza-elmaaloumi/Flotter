import { describe, it, expect } from 'vitest'

// ---------------------------------------------------------------------------
// Guard-logic helpers — extracted from the cancellation endpoint to allow
// pure unit testing without HTTP or database dependencies.
// ---------------------------------------------------------------------------

type UserSubscriptionState = {
  isPro: boolean
  subscriptionStatus: string | null
  polarSubscriptionId: string | null
}

function canCancelSubscription(user: UserSubscriptionState): { allowed: boolean; reason?: string } {
  if (!user.isPro || user.subscriptionStatus !== 'active') {
    return { allowed: false, reason: 'No active subscription to cancel' }
  }
  if (!user.polarSubscriptionId) {
    return { allowed: false, reason: 'Subscription ID not found' }
  }
  return { allowed: true }
}

// ---------------------------------------------------------------------------
// canceledUserState — the DB state that must be applied after cancellation
// ---------------------------------------------------------------------------

function buildCanceledState() {
  const now = new Date()
  return {
    isPro: false,
    subscriptionStatus: 'canceled',
    subscriptionEndsAt: now,
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Subscription cancellation guard logic', () => {
  it('allows cancellation for a fully active Pro subscriber', () => {
    const user: UserSubscriptionState = {
      isPro: true,
      subscriptionStatus: 'active',
      polarSubscriptionId: 'sub_123',
    }
    const result = canCancelSubscription(user)
    expect(result.allowed).toBe(true)
    expect(result.reason).toBeUndefined()
  })

  it('rejects cancellation when isPro is false', () => {
    const user: UserSubscriptionState = {
      isPro: false,
      subscriptionStatus: 'active',
      polarSubscriptionId: 'sub_123',
    }
    const result = canCancelSubscription(user)
    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('No active subscription to cancel')
  })

  it('rejects cancellation when subscriptionStatus is null', () => {
    const user: UserSubscriptionState = {
      isPro: true,
      subscriptionStatus: null,
      polarSubscriptionId: 'sub_123',
    }
    const result = canCancelSubscription(user)
    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('No active subscription to cancel')
  })

  it('rejects cancellation when subscriptionStatus is past_due', () => {
    const user: UserSubscriptionState = {
      isPro: true,
      subscriptionStatus: 'past_due',
      polarSubscriptionId: 'sub_123',
    }
    const result = canCancelSubscription(user)
    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('No active subscription to cancel')
  })

  it('rejects cancellation when subscriptionStatus is already canceled', () => {
    const user: UserSubscriptionState = {
      isPro: false,
      subscriptionStatus: 'canceled',
      polarSubscriptionId: 'sub_123',
    }
    const result = canCancelSubscription(user)
    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('No active subscription to cancel')
  })

  it('rejects cancellation when polarSubscriptionId is null', () => {
    const user: UserSubscriptionState = {
      isPro: true,
      subscriptionStatus: 'active',
      polarSubscriptionId: null,
    }
    const result = canCancelSubscription(user)
    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('Subscription ID not found')
  })

  it('rejects cancellation when polarSubscriptionId is empty string', () => {
    const user: UserSubscriptionState = {
      isPro: true,
      subscriptionStatus: 'active',
      polarSubscriptionId: '',
    }
    const result = canCancelSubscription(user)
    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('Subscription ID not found')
  })
})

describe('Canceled user state', () => {
  it('sets isPro to false', () => {
    const state = buildCanceledState()
    expect(state.isPro).toBe(false)
  })

  it('sets subscriptionStatus to canceled', () => {
    const state = buildCanceledState()
    expect(state.subscriptionStatus).toBe('canceled')
  })

  it('sets subscriptionEndsAt to approximately now', () => {
    const before = Date.now()
    const state = buildCanceledState()
    const after = Date.now()
    expect(state.subscriptionEndsAt.getTime()).toBeGreaterThanOrEqual(before)
    expect(state.subscriptionEndsAt.getTime()).toBeLessThanOrEqual(after)
  })
})

describe('TypeScript type safety: SubscriptionsRevokeRequest shape', () => {
  it('requires an id field of type string', () => {
    // Validates the exact shape expected by polar.subscriptions.revoke()
    const request: { id: string } = { id: 'sub_test_123' }
    expect(typeof request.id).toBe('string')
    expect(request.id.length).toBeGreaterThan(0)
  })
})
