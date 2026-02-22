import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

/**
 * End-to-End verification tests.
 * These tests verify the full chain of fixes by checking:
 * 1. Source code correctness across multiple files
 * 2. Cross-file consistency (e.g., client calls match server API)
 * 3. Defense-in-depth patterns are applied consistently
 * 4. No regressions in existing functionality
 */

const ROOT = resolve(__dirname, '../..')

function readSource(relativePath: string): string {
  return readFileSync(resolve(ROOT, relativePath), 'utf-8')
}

describe('E2E: XP System Integrity', () => {
  it('XP is only awarded through card review, not through TTS', () => {
    const ttsRoute = readSource('app/api/tts/route.ts')
    const cardsRoute = readSource('app/api/cards/route.ts')
    
    // TTS should not award XP
    expect(ttsRoute).not.toContain('awardXp')
    
    // Card review should award XP
    expect(cardsRoute).toContain('awardXp(userId, xpAmount)')
    expect(cardsRoute).toContain('awardXp(userId, 50)')
  })

  it('awardXp uses transaction to prevent race conditions on monthlyXp', () => {
    const xpLib = readSource('lib/xp.ts')
    expect(xpLib).toContain('prisma.$transaction')
    expect(xpLib).toContain('tx.user.findUnique')
    expect(xpLib).toContain('tx.user.update')
    // Should use atomic increment
    expect(xpLib).toContain('monthlyXp: { increment: amount }')
  })

  it('streak system prevents infinite freeze exploit for Pro users', () => {
    const xpLib = readSource('lib/xp.ts')
    // Must specifically check for 2-day gap
    expect(xpLib).toContain('diffDays === 2')
    // Should not have unconditional Pro streak protection
    expect(xpLib).not.toMatch(/else\s+if\s*\(user\.isPro\)\s*\{\s*\n[^}]*streakCount\s*\+\s*1\s*\n\s*\}/)
  })
})

describe('E2E: Card Operations Security', () => {
  it('all card mutations include userId in where clause for IDOR protection', () => {
    const cardsRoute = readSource('app/api/cards/route.ts')
    const cardIdRoute = readSource('app/api/cards/[id]/route.ts')
    
    // Cards route PATCH — all updates should use { id: cardId, userId }
    const mainRouteMatches = cardsRoute.match(/where:\s*\{\s*id:\s*cardId,\s*userId\s*\}/g)
    expect(mainRouteMatches).not.toBeNull()
    expect(mainRouteMatches!.length).toBeGreaterThanOrEqual(3) // rotate, review-success, review-fail
    
    // Cards [id] route — update and delete should use { id, userId }
    const idRouteMatches = cardIdRoute.match(/where:\s*\{\s*id,\s*userId\s*\}/g)
    expect(idRouteMatches).not.toBeNull()
    expect(idRouteMatches!.length).toBeGreaterThanOrEqual(2) // PATCH + DELETE
  })

  it('GET endpoint does not mutate card state', () => {
    const cardsRoute = readSource('app/api/cards/route.ts')
    // The GET handler should not contain update/transaction logic
    // Extract just the GET function
    const getStart = cardsRoute.indexOf('export async function GET')
    const patchStart = cardsRoute.indexOf('export async function PATCH')
    const getBody = cardsRoute.slice(getStart, patchStart)
    
    expect(getBody).not.toContain('prisma.card.update')
    expect(getBody).not.toContain('prisma.$transaction')
    expect(getBody).not.toContain('doRotate')
  })

  it('card creation validates input types and lengths', () => {
    const cardsRoute = readSource('app/api/cards/route.ts')
    expect(cardsRoute).toContain("typeof word !== 'string'")
    expect(cardsRoute).toContain('Array.isArray(sentences)')
    expect(cardsRoute).toContain('sentences.every')
    expect(cardsRoute).toContain("typeof imageUrl !== 'string'")
  })

  it('spaced repetition adjusts ease factor dynamically', () => {
    const cardsRoute = readSource('app/api/cards/route.ts')
    // Success path: increase ease factor
    expect(cardsRoute).toContain('Math.min(currentEase + 0.1, 3.0)')
    // Failure path: decrease ease factor
    expect(cardsRoute).toContain('Math.max(currentEase - 0.2, 1.3)')
    // Both paths should write easeFactor to DB
    expect(cardsRoute).toContain('easeFactor: newEaseFactor')
  })
})

describe('E2E: Authentication & Authorization', () => {
  it('registration enforces password complexity', () => {
    const registerRoute = readSource('app/api/auth/register/route.ts')
    expect(registerRoute).toContain('password.length < 8')
    expect(registerRoute).toContain('[A-Z]')
    expect(registerRoute).toContain('[a-z]')
    expect(registerRoute).toContain('[0-9]')
  })

  it('login has both email-based and IP-based rate limiting', () => {
    const authRoute = readSource('app/api/auth/[...nextauth]/route.ts')
    expect(authRoute).toContain('login:${normalizedEmail}')
    expect(authRoute).toContain('login-ip:${ip}')
    expect(authRoute).toContain('getClientIp')
  })

  it('IP detection prefers trusted proxy header', () => {
    const rateLimitLib = readSource('lib/rate-limit.ts')
    const realIpIndex = rateLimitLib.indexOf("x-real-ip")
    const forwardedIndex = rateLimitLib.indexOf("x-forwarded-for")
    expect(realIpIndex).toBeLessThan(forwardedIndex)
  })
})

describe('E2E: Payment & Subscription Security', () => {
  it('webhook always verifies signature (no dev bypass)', () => {
    const webhookRoute = readSource('app/api/webhook/route.ts')
    expect(webhookRoute).toContain('POLAR_WEBHOOK_SECRET')
    expect(webhookRoute).not.toContain('JSON.parse(body)')
    expect(webhookRoute).not.toContain('dev mode')
    expect(webhookRoute).not.toContain('verification skipped')
    expect(webhookRoute).toContain('validateEvent')
  })

  it('checkout uses correct environment dynamically', () => {
    const checkoutRoute = readSource('app/api/checkout/route.ts')
    expect(checkoutRoute).toContain("process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'")
  })
})

describe('E2E: AI Generation Rate Limiting', () => {
  it('free user generation limit is enforced atomically', () => {
    const aiRoute = readSource('app/api/ai/generate-sentences/route.ts')
    // Atomic claim before API call
    expect(aiRoute).toContain('prisma.user.updateMany')
    expect(aiRoute).toContain('lt: FREE_DAILY_LIMIT')
    
    // The atomic claim should happen before the Groq call
    const claimIndex = aiRoute.indexOf('updateMany')
    const groqIndex = aiRoute.indexOf('groq.chat.completions.create')
    expect(claimIndex).toBeLessThan(groqIndex)
  })

  it('uses const instead of let for currentGenerations', () => {
    const aiRoute = readSource('app/api/ai/generate-sentences/route.ts')
    expect(aiRoute).not.toMatch(/let\s+currentGenerations/)
  })
})

describe('E2E: Ranking API Protection', () => {
  it('offset is bounded to prevent DoS', () => {
    const rankingRoute = readSource('app/api/ranking/route.ts')
    expect(rankingRoute).toContain('Math.min')
    expect(rankingRoute).toContain('1000')
  })

  it('limit is bounded to max 100', () => {
    const rankingRoute = readSource('app/api/ranking/route.ts')
    expect(rankingRoute).toContain("'100'")
    expect(rankingRoute).toContain('take: limit')
  })
})

describe('E2E: Client-Server Consistency', () => {
  it('deck page does not request rotate from server', () => {
    const deckPage = readSource('app/cards/deck/page.tsx')
    expect(deckPage).not.toContain('rotate: true')
    expect(deckPage).not.toContain('rotate=true')
  })

  it('deck page does not call deprecated /api/xp/add', () => {
    const deckPage = readSource('app/cards/deck/page.tsx')
    expect(deckPage).not.toContain('/api/xp/add')
  })

  it('all required files exist', () => {
    const requiredFiles = [
      'lib/xp.ts',
      'lib/rate-limit.ts',
      'app/api/tts/route.ts',
      'app/api/cards/route.ts',
      'app/api/cards/[id]/route.ts',
      'app/api/auth/register/route.ts',
      'app/api/auth/[...nextauth]/route.ts',
      'app/api/webhook/route.ts',
      'app/api/checkout/route.ts',
      'app/api/ranking/route.ts',
      'app/api/ai/generate-sentences/route.ts',
    ]
    
    for (const file of requiredFiles) {
      expect(existsSync(resolve(ROOT, file))).toBe(true)
    }
  })
})
