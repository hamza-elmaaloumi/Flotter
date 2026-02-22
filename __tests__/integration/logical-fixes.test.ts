import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Integration tests that verify all logical issue fixes are properly applied
 * by checking the actual source code for correct patterns.
 */

const ROOT = resolve(__dirname, '../..')

function readSource(relativePath: string): string {
  return readFileSync(resolve(ROOT, relativePath), 'utf-8')
}

describe('ISSUE-001: XP farming via TTS pre-fetching', () => {
  it('TTS route should NOT import or call awardXp', () => {
    const src = readSource('app/api/tts/route.ts')
    expect(src).not.toContain("import { awardXp }")
    expect(src).not.toContain('awardXp(')
  })

  it('TTS route should have a comment explaining XP removal', () => {
    const src = readSource('app/api/tts/route.ts')
    expect(src).toContain('XP is no longer awarded here')
  })
})

describe('ISSUE-002: Unintended card rotation on GET', () => {
  it('GET handler should not contain rotation logic', () => {
    const src = readSource('app/api/cards/route.ts')
    expect(src).not.toContain('doRotate')
    expect(src).not.toContain("rotate === 'true'")
  })

  it('Deck page should not request rotate=true', () => {
    const src = readSource('app/cards/deck/page.tsx')
    expect(src).not.toContain('rotate: true')
  })

  it('PATCH handler should still support rotate action', () => {
    const src = readSource('app/api/cards/route.ts')
    expect(src).toContain("action === 'rotate'")
  })
})

describe('ISSUE-003: Infinite streak freeze for Pro users', () => {
  it('should limit Pro streak protection to 2-day gap maximum', () => {
    const src = readSource('lib/xp.ts')
    // Must check for diffDays === 2 specifically for Pro users
    expect(src).toContain('diffDays === 2')
    expect(src).toContain('isPro')
  })

  it('should not have unconditional Pro streak preservation', () => {
    const src = readSource('lib/xp.ts')
    // The old pattern was: else if (user.isPro) { newStreak = user.streakCount + 1 }
    // without any day limit check
    expect(src).not.toMatch(/isPro\)\s*\{\s*\n\s*\/\/\s*Streak Protection/)
  })
})

describe('ISSUE-004: Race condition in monthly XP', () => {
  it('should use Prisma interactive transaction', () => {
    const src = readSource('lib/xp.ts')
    expect(src).toContain('prisma.$transaction')
    expect(src).toContain('async (tx)')
  })

  it('should use atomic increment for monthlyXp when not resetting', () => {
    const src = readSource('lib/xp.ts')
    expect(src).toContain("monthlyXp: { increment: amount }")
  })

  it('should read user inside the transaction', () => {
    const src = readSource('lib/xp.ts')
    expect(src).toContain('tx.user.findUnique')
    expect(src).toContain('tx.user.update')
  })
})

describe('ISSUE-006: Rate limit IP spoofing', () => {
  it('should prefer x-real-ip over x-forwarded-for', () => {
    const src = readSource('lib/rate-limit.ts')
    // x-real-ip should be checked first
    const realIpIndex = src.indexOf("x-real-ip")
    const forwardedIndex = src.indexOf("x-forwarded-for")
    // In getClientIp, x-real-ip check comes before x-forwarded-for
    expect(realIpIndex).toBeLessThan(forwardedIndex)
  })
})

describe('ISSUE-007: Race condition in AI generation daily limit', () => {
  it('should use atomic updateMany for claiming generation slot', () => {
    const src = readSource('app/api/ai/generate-sentences/route.ts')
    expect(src).toContain('prisma.user.updateMany')
    expect(src).toContain('lt: FREE_DAILY_LIMIT')
  })

  it('should claim the slot before calling the AI API', () => {
    const src = readSource('app/api/ai/generate-sentences/route.ts')
    const claimIndex = src.indexOf('updateMany')
    const groqIndex = src.indexOf('groq.chat.completions.create')
    expect(claimIndex).toBeLessThan(groqIndex)
  })
})

describe('ISSUE-008: Unauthenticated webhook endpoint', () => {
  it('should always require POLAR_WEBHOOK_SECRET', () => {
    const src = readSource('app/api/webhook/route.ts')
    expect(src).toContain('POLAR_WEBHOOK_SECRET')
    expect(src).toContain("{ error: 'Webhook secret not configured' }")
  })

  it('should not have development bypass for verification', () => {
    const src = readSource('app/api/webhook/route.ts')
    expect(src).not.toContain('verification skipped')
    expect(src).not.toContain('dev mode')
    // Should not parse body without verification
    expect(src).not.toContain('JSON.parse(body)')
  })
})

describe('ISSUE-009: IDOR in card update (cards/route.ts)', () => {
  it('should include userId in where clause for rotate action', () => {
    const src = readSource('app/api/cards/route.ts')
    // The rotate update should include userId
    expect(src).toContain('where: { id: cardId, userId }')
  })

  it('should include userId in where clause for review actions', () => {
    const src = readSource('app/api/cards/route.ts')
    // Count occurrences of the defense-in-depth pattern
    const matches = src.match(/where:\s*\{\s*id:\s*cardId,\s*userId\s*\}/g)
    // Should appear in rotate, review-success, and review-fail updates
    expect(matches).not.toBeNull()
    expect(matches!.length).toBeGreaterThanOrEqual(3)
  })
})

describe('ISSUE-010: Broken checkout environment', () => {
  it('should use dynamic server based on NODE_ENV', () => {
    const src = readSource('app/api/checkout/route.ts')
    expect(src).toContain("process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'")
  })

  it('should not have hardcoded-only sandbox server', () => {
    const src = readSource('app/api/checkout/route.ts')
    // Should not have server: 'sandbox' as a standalone assignment (without conditional)
    // The dynamic expression 'production' ? 'production' : 'sandbox' is fine
    expect(src).not.toMatch(/server:\s*['"]sandbox['"]\s*[,}]/)
    expect(src).toContain("process.env.NODE_ENV === 'production'")
  })
})

describe('ISSUE-011: Unbounded pagination in ranking', () => {
  it('should cap offset at 1000', () => {
    const src = readSource('app/api/ranking/route.ts')
    expect(src).toContain('1000')
    expect(src).toContain('Math.min')
  })
})

describe('ISSUE-012: IDOR in card [id] deletion and update', () => {
  it('should include userId in PATCH where clause', () => {
    const src = readSource('app/api/cards/[id]/route.ts')
    expect(src).toContain('where: { id, userId }')
  })

  it('should include userId in DELETE where clause', () => {
    const src = readSource('app/api/cards/[id]/route.ts')
    // Both update and delete should use { id, userId }
    const matches = src.match(/where:\s*\{\s*id,\s*userId\s*\}/g)
    expect(matches).not.toBeNull()
    expect(matches!.length).toBeGreaterThanOrEqual(2)
  })
})

describe('ISSUE-013: Missing password complexity validation', () => {
  it('should enforce minimum password length', () => {
    const src = readSource('app/api/auth/register/route.ts')
    expect(src).toContain('password.length < 8')
  })

  it('should require uppercase letter', () => {
    const src = readSource('app/api/auth/register/route.ts')
    expect(src).toContain('[A-Z]')
  })

  it('should require lowercase letter', () => {
    const src = readSource('app/api/auth/register/route.ts')
    expect(src).toContain('[a-z]')
  })

  it('should require number', () => {
    const src = readSource('app/api/auth/register/route.ts')
    expect(src).toContain('[0-9]')
  })
})

describe('ISSUE-015: let → const in AI route', () => {
  it('should use const for currentGenerations', () => {
    const src = readSource('app/api/ai/generate-sentences/route.ts')
    expect(src).not.toMatch(/let\s+currentGenerations/)
  })
})

describe('ISSUE-018: IP-based login rate limiting', () => {
  it('should rate limit login by IP in addition to email', () => {
    const src = readSource('app/api/auth/[...nextauth]/route.ts')
    expect(src).toContain('login-ip:')
    expect(src).toContain('getClientIp')
  })

  it('should import getClientIp', () => {
    const src = readSource('app/api/auth/[...nextauth]/route.ts')
    expect(src).toContain('getClientIp')
  })
})

describe('ISSUE-019: Spaced repetition ease factor', () => {
  it('should adjust ease factor on success', () => {
    const src = readSource('app/api/cards/route.ts')
    expect(src).toContain('newEaseFactor')
    expect(src).toContain('easeFactor: newEaseFactor')
  })

  it('should have a minimum ease factor of 1.3', () => {
    const src = readSource('app/api/cards/route.ts')
    expect(src).toContain('1.3')
  })

  it('should have a maximum ease factor of 3.0', () => {
    const src = readSource('app/api/cards/route.ts')
    expect(src).toContain('3.0')
  })
})

describe('ISSUE-020: Missing input validation for card creation', () => {
  it('should validate word type and length', () => {
    const src = readSource('app/api/cards/route.ts')
    expect(src).toContain("typeof word !== 'string'")
    expect(src).toContain('word.length > 100')
  })

  it('should validate sentences is an array of strings', () => {
    const src = readSource('app/api/cards/route.ts')
    expect(src).toContain('Array.isArray(sentences)')
    expect(src).toContain('sentences.every')
  })

  it('should validate imageUrl type and length', () => {
    const src = readSource('app/api/cards/route.ts')
    expect(src).toContain("typeof imageUrl !== 'string'")
    expect(src).toContain('imageUrl.length > 2048')
  })
})
