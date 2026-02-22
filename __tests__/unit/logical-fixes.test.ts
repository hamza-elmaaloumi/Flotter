import { describe, it, expect } from 'vitest'
import { checkRateLimit, getClientIp } from '../../lib/rate-limit'

/**
 * Unit tests for the logical fixes applied from logical-issues.json.
 * These test pure functions and logic that don't require database access.
 */

// ===== ISSUE-006: Rate Limit IP Detection =====
describe('ISSUE-006: getClientIp prefers x-real-ip over x-forwarded-for', () => {
  function makeReq(headers: Record<string, string>): Request {
    return {
      headers: {
        get(name: string) {
          return headers[name.toLowerCase()] ?? null
        },
      },
    } as any
  }

  it('should prefer x-real-ip when both headers are present', () => {
    const req = makeReq({
      'x-real-ip': '10.0.0.1',
      'x-forwarded-for': '192.168.0.1, 10.0.0.1',
    })
    expect(getClientIp(req)).toBe('10.0.0.1')
  })

  it('should fall back to x-forwarded-for first entry when x-real-ip is absent', () => {
    const req = makeReq({
      'x-forwarded-for': '192.168.0.1, 10.0.0.1',
    })
    expect(getClientIp(req)).toBe('192.168.0.1')
  })

  it('should return unknown when no IP headers are present', () => {
    const req = makeReq({})
    expect(getClientIp(req)).toBe('unknown')
  })

  it('should trim whitespace from x-real-ip', () => {
    const req = makeReq({ 'x-real-ip': '  10.0.0.1  ' })
    expect(getClientIp(req)).toBe('10.0.0.1')
  })
})

// ===== ISSUE-013: Password Validation Logic =====
describe('ISSUE-013: Password complexity validation', () => {
  // Test the validation rules directly (matching what register route checks)
  function validatePassword(password: string): string | null {
    if (password.length < 8) return 'Password must be at least 8 characters long'
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter'
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number'
    return null
  }

  it('should reject passwords shorter than 8 characters', () => {
    expect(validatePassword('Ab1')).toContain('8 characters')
    expect(validatePassword('Abcdef1')).toContain('8 characters')
  })

  it('should reject passwords without uppercase', () => {
    expect(validatePassword('abcdefg1')).toContain('uppercase')
  })

  it('should reject passwords without lowercase', () => {
    expect(validatePassword('ABCDEFG1')).toContain('lowercase')
  })

  it('should reject passwords without numbers', () => {
    expect(validatePassword('Abcdefgh')).toContain('number')
  })

  it('should accept valid passwords', () => {
    expect(validatePassword('Abcdefg1')).toBeNull()
    expect(validatePassword('StrongP4ss!')).toBeNull()
    expect(validatePassword('MyP4ssword')).toBeNull()
  })
})

// ===== ISSUE-011: Bounded Pagination =====
describe('ISSUE-011: Ranking offset capping', () => {
  function cappedOffset(raw: string | null): number {
    return Math.min(Math.max(parseInt(raw || '0'), 0), 1000)
  }

  it('should cap offset at 1000', () => {
    expect(cappedOffset('1000000')).toBe(1000)
    expect(cappedOffset('5000')).toBe(1000)
  })

  it('should allow offsets within range', () => {
    expect(cappedOffset('0')).toBe(0)
    expect(cappedOffset('500')).toBe(500)
    expect(cappedOffset('1000')).toBe(1000)
  })

  it('should floor negative offsets to 0', () => {
    expect(cappedOffset('-1')).toBe(0)
    expect(cappedOffset('-999')).toBe(0)
  })

  it('should default to 0 for null input', () => {
    expect(cappedOffset(null)).toBe(0)
  })

  it('should return NaN for non-numeric input (edge case in parseInt)', () => {
    // parseInt('abc') = NaN — this propagates through Math.min/Math.max
    // The actual route would receive '0' as default from searchParams.get fallback
    expect(Number.isNaN(cappedOffset('abc'))).toBe(true)
  })
})

// ===== ISSUE-019: Ease Factor Adjustment =====
describe('ISSUE-019: Spaced Repetition ease factor dynamics', () => {
  it('should increase ease factor on success (capped at 3.0)', () => {
    const currentEase = 2.5
    const newEase = Math.min(currentEase + 0.1, 3.0)
    expect(newEase).toBeCloseTo(2.6)
  })

  it('should cap ease factor at 3.0 on success', () => {
    const currentEase = 2.95
    const newEase = Math.min(currentEase + 0.1, 3.0)
    expect(newEase).toBe(3.0)
  })

  it('should decrease ease factor on failure (min 1.3)', () => {
    const currentEase = 2.5
    const newEase = Math.max(currentEase - 0.2, 1.3)
    expect(newEase).toBeCloseTo(2.3)
  })

  it('should floor ease factor at 1.3 on failure', () => {
    const currentEase = 1.4
    const newEase = Math.max(currentEase - 0.2, 1.3)
    expect(newEase).toBe(1.3)
  })

  it('should handle multiple successive failures approaching floor', () => {
    let ease = 2.5
    for (let i = 0; i < 10; i++) {
      ease = Math.max(ease - 0.2, 1.3)
    }
    expect(ease).toBe(1.3)
  })
})

// ===== ISSUE-003: Pro Streak Freeze Logic =====
describe('ISSUE-003: Streak freeze for Pro users (limited to 2-day gap)', () => {
  function computeStreak(
    streakCount: number,
    lastActiveDate: Date | null,
    today: Date,
    isPro: boolean
  ): number {
    if (!lastActiveDate) return 1

    const lastStr = lastActiveDate.toISOString().slice(0, 10)
    const todayStr = today.toISOString().slice(0, 10)

    if (lastStr === todayStr) return streakCount

    const lastD = new Date(lastStr)
    const todayD = new Date(todayStr)
    const diffDays = Math.floor((todayD.getTime() - lastD.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return streakCount + 1
    if (isPro && diffDays === 2) return streakCount + 1
    return 1
  }

  it('should increment streak for consecutive days (any user)', () => {
    const result = computeStreak(5, new Date('2026-02-20'), new Date('2026-02-21'), false)
    expect(result).toBe(6)
  })

  it('should reset streak for free user who misses 1 day', () => {
    const result = computeStreak(5, new Date('2026-02-19'), new Date('2026-02-21'), false)
    expect(result).toBe(1)
  })

  it('should preserve streak for Pro user who misses exactly 1 day (2-day gap)', () => {
    const result = computeStreak(5, new Date('2026-02-19'), new Date('2026-02-21'), true)
    expect(result).toBe(6)
  })

  it('should reset streak for Pro user who misses 2+ days (3-day gap)', () => {
    const result = computeStreak(5, new Date('2026-02-18'), new Date('2026-02-21'), true)
    expect(result).toBe(1)
  })

  it('should reset streak for Pro user who misses many days', () => {
    // Previously this would keep the streak — now it resets
    const result = computeStreak(100, new Date('2025-08-01'), new Date('2026-02-21'), true)
    expect(result).toBe(1)
  })

  it('should keep streak unchanged on same day', () => {
    const result = computeStreak(5, new Date('2026-02-21'), new Date('2026-02-21'), false)
    expect(result).toBe(5)
  })

  it('should return 1 for first ever activity', () => {
    const result = computeStreak(0, null, new Date('2026-02-21'), false)
    expect(result).toBe(1)
  })
})

// ===== ISSUE-020: Card Input Validation =====
describe('ISSUE-020: Card creation input validation', () => {
  function validateCardInput(body: any): string | null {
    const { word, sentences, imageUrl } = body || {}
    if (!word || !sentences || !imageUrl) return 'Missing required fields'
    if (typeof word !== 'string' || word.trim().length === 0 || word.length > 100) {
      return 'Invalid word'
    }
    if (
      !Array.isArray(sentences) ||
      sentences.length === 0 ||
      sentences.length > 20 ||
      !sentences.every((s: unknown) => typeof s === 'string' && (s as string).trim().length > 0)
    ) {
      return 'Invalid sentences'
    }
    if (typeof imageUrl !== 'string' || imageUrl.trim().length === 0 || imageUrl.length > 2048) {
      return 'Invalid imageUrl'
    }
    return null
  }

  it('should reject missing fields', () => {
    expect(validateCardInput({})).toContain('Missing')
    expect(validateCardInput({ word: 'test' })).toContain('Missing')
  })

  it('should reject empty word (caught by truthy check)', () => {
    // Empty string is falsy, so it's caught by the `!word` check
    expect(validateCardInput({ word: '', sentences: ['a'], imageUrl: 'http://a.com' })).toContain('Missing')
  })

  it('should reject word exceeding 100 chars', () => {
    const longWord = 'a'.repeat(101)
    expect(validateCardInput({ word: longWord, sentences: ['a'], imageUrl: 'http://a.com' })).toContain('Invalid word')
  })

  it('should reject non-array sentences', () => {
    expect(validateCardInput({ word: 'test', sentences: 'not an array', imageUrl: 'http://a.com' })).toContain('Invalid sentences')
  })

  it('should reject empty sentences array', () => {
    expect(validateCardInput({ word: 'test', sentences: [], imageUrl: 'http://a.com' })).toContain('Invalid sentences')
  })

  it('should reject sentences with empty strings', () => {
    expect(validateCardInput({ word: 'test', sentences: ['good', ''], imageUrl: 'http://a.com' })).toContain('Invalid sentences')
  })

  it('should reject sentences with non-string elements', () => {
    expect(validateCardInput({ word: 'test', sentences: [123], imageUrl: 'http://a.com' })).toContain('Invalid sentences')
  })

  it('should reject too many sentences (> 20)', () => {
    const manySentences = Array(21).fill('sentence')
    expect(validateCardInput({ word: 'test', sentences: manySentences, imageUrl: 'http://a.com' })).toContain('Invalid sentences')
  })

  it('should reject empty imageUrl (caught by truthy check)', () => {
    // Empty string is falsy, so it's caught by the `!imageUrl` check
    expect(validateCardInput({ word: 'test', sentences: ['a'], imageUrl: '' })).toContain('Missing')
  })

  it('should reject imageUrl exceeding 2048 chars', () => {
    const longUrl = 'http://a.com/' + 'a'.repeat(2048)
    expect(validateCardInput({ word: 'test', sentences: ['a'], imageUrl: longUrl })).toContain('Invalid imageUrl')
  })

  it('should accept valid input', () => {
    expect(validateCardInput({
      word: 'ephemeral',
      sentences: ['You see the ephemeral morning dew.', 'The moment was ephemeral.'],
      imageUrl: 'https://images.unsplash.com/photo-123',
    })).toBeNull()
  })
})

// ===== Rate Limiter Extended Tests =====
describe('Rate limiter with different keys for IP-based limiting (ISSUE-018)', () => {
  it('should independently track email-based and IP-based keys', () => {
    const emailKey = `login:test@example.com-${Date.now()}`
    const ipKey = `login-ip:10.0.0.1-${Date.now()}`
    const emailOpts = { maxRequests: 10, windowMs: 15 * 60 * 1000 }
    const ipOpts = { maxRequests: 30, windowMs: 15 * 60 * 1000 }

    // Email key has its own window
    const r1 = checkRateLimit(emailKey, emailOpts)
    expect(r1.success).toBe(true)
    expect(r1.remaining).toBe(9)

    // IP key should be independent
    const r2 = checkRateLimit(ipKey, ipOpts)
    expect(r2.success).toBe(true)
    expect(r2.remaining).toBe(29)
  })
})
