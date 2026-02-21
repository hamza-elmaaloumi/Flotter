import { describe, it, expect, beforeEach } from 'vitest'
import { checkRateLimit } from '../../lib/rate-limit'

describe('Rate Limiter (Unit Tests)', () => {
  beforeEach(() => {
    // Clear rate limit store between tests by using unique keys
  })

  it('should allow requests under the limit', () => {
    const key = `test-allow-${Date.now()}`
    const result = checkRateLimit(key, { maxRequests: 5, windowMs: 60000 })
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('should block requests over the limit', () => {
    const key = `test-block-${Date.now()}`
    const opts = { maxRequests: 3, windowMs: 60000 }

    checkRateLimit(key, opts) // 1
    checkRateLimit(key, opts) // 2
    checkRateLimit(key, opts) // 3

    const result = checkRateLimit(key, opts) // 4 - should be blocked
    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('should track remaining count correctly', () => {
    const key = `test-remaining-${Date.now()}`
    const opts = { maxRequests: 5, windowMs: 60000 }

    const r1 = checkRateLimit(key, opts)
    expect(r1.remaining).toBe(4)

    const r2 = checkRateLimit(key, opts)
    expect(r2.remaining).toBe(3)

    const r3 = checkRateLimit(key, opts)
    expect(r3.remaining).toBe(2)
  })

  it('should use separate windows for different keys', () => {
    const key1 = `test-separate-a-${Date.now()}`
    const key2 = `test-separate-b-${Date.now()}`
    const opts = { maxRequests: 1, windowMs: 60000 }

    const r1 = checkRateLimit(key1, opts)
    expect(r1.success).toBe(true)

    const r2 = checkRateLimit(key2, opts)
    expect(r2.success).toBe(true)

    // key1 is now exhausted
    const r3 = checkRateLimit(key1, opts)
    expect(r3.success).toBe(false)

    // key2 is also exhausted
    const r4 = checkRateLimit(key2, opts)
    expect(r4.success).toBe(false)
  })

  it('should return resetAt timestamp', () => {
    const key = `test-reset-${Date.now()}`
    const result = checkRateLimit(key, { maxRequests: 5, windowMs: 60000 })
    expect(result.resetAt).toBeGreaterThan(Date.now() - 1000)
    expect(result.resetAt).toBeLessThanOrEqual(Date.now() + 60000)
  })
})
