import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Integration tests that verify security fixes are properly applied
 * by checking the actual source code for vulnerable patterns.
 */

const ROOT = resolve(__dirname, '../..')

function readSource(relativePath: string): string {
  return readFileSync(resolve(ROOT, relativePath), 'utf-8')
}

describe('VUL-001: Password Hashing (bcrypt)', () => {
  it('register route should use bcrypt, not SHA-256', () => {
    const src = readSource('app/api/auth/register/route.ts')
    expect(src).toContain('bcrypt')
    expect(src).not.toContain("createHash('sha256')")
    expect(src).not.toContain('createHash("sha256")')
  })

  it('nextauth route should use bcrypt.compare, not SHA-256', () => {
    const src = readSource('app/api/auth/[...nextauth]/route.ts')
    expect(src).toContain('bcrypt.compare')
    expect(src).not.toContain("createHash('sha256')")
    expect(src).not.toContain('createHash("sha256")')
  })
})

describe('VUL-002: TTS Authentication', () => {
  it('TTS route should require authentication', () => {
    const src = readSource('app/api/tts/route.ts')
    expect(src).toContain('getServerSession')
    expect(src).toContain('Unauthorized')
  })
})

describe('VUL-003: Webhook Signature Enforcement', () => {
  it('should enforce signature verification in production', () => {
    const src = readSource('app/api/webhook/route.ts')
    expect(src).toContain("process.env.NODE_ENV === 'production'")
    expect(src).toContain('Webhook secret not configured')
  })

  it('should not blindly skip verification', () => {
    const src = readSource('app/api/webhook/route.ts')
    // Should not have unconditional JSON parse fallback
    expect(src).not.toMatch(/else\s*\{\s*\n\s*\/\/\s*No secret configured yet/)
  })
})

describe('VUL-004: OAuth Account Linking', () => {
  it('should not have allowDangerousEmailAccountLinking', () => {
    const src = readSource('app/api/auth/[...nextauth]/route.ts')
    expect(src).not.toContain('allowDangerousEmailAccountLinking')
  })
})

describe('VUL-005: Middleware Protection', () => {
  it('should protect TTS and AI routes in middleware', () => {
    const src = readSource('middleware.ts')
    expect(src).toContain('/api/tts')
    expect(src).toContain('/api/ai')
    expect(src).toContain('/api/xp')
    expect(src).toContain('/api/profile')
  })
})

describe('VUL-006: Rate Limiting', () => {
  it('register route should have rate limiting', () => {
    const src = readSource('app/api/auth/register/route.ts')
    expect(src).toContain('checkRateLimit')
    expect(src).toContain('429')
  })

  it('nextauth route should have rate limiting on login', () => {
    const src = readSource('app/api/auth/[...nextauth]/route.ts')
    expect(src).toContain('checkRateLimit')
  })

  it('AI generation route should have rate limiting', () => {
    const src = readSource('app/api/ai/generate-sentences/route.ts')
    expect(src).toContain('checkRateLimit')
    expect(src).toContain('429')
  })
})

describe('VUL-007: Card Rotation Optimization', () => {
  it('should limit batch rotation to prevent DB timeouts', () => {
    const src = readSource('app/api/cards/route.ts')
    expect(src).toContain('slice(0, 50)')
  })
})

describe('VUL-008: Profile Image Size Limit', () => {
  it('should validate image size in profile PATCH', () => {
    const src = readSource('app/api/profile/route.ts')
    expect(src).toContain('500 * 1024')
    expect(src).toContain('413')
    expect(src).toContain('Image too large')
  })
})

describe('VUL-009: AI Prompt Sanitization', () => {
  it('should sanitize word input before passing to AI', () => {
    const src = readSource('app/api/ai/generate-sentences/route.ts')
    expect(src).toContain('sanitizedWord')
    // Check for the regex validation pattern
    expect(src).toContain('[a-zA-Z')
  })

  it('should use sanitizedWord in prompts, not raw word', () => {
    const src = readSource('app/api/ai/generate-sentences/route.ts')
    expect(src).toContain('Target Word: "${sanitizedWord}"')
    // The raw word interpolation in prompts should not exist
    expect(src).not.toContain('Target Word: "${word}"')
  })
})

describe('VUL-010: XP Action Verification', () => {
  it('standalone XP endpoint should be deprecated', () => {
    const src = readSource('app/api/xp/add/route.ts')
    expect(src).toContain('deprecated')
    expect(src).toContain('410')
  })

  it('card review should award XP server-side', () => {
    const src = readSource('app/api/cards/route.ts')
    expect(src).toContain('awardXp(userId, 10)')
  })

  it('TTS route should award XP server-side', () => {
    const src = readSource('app/api/tts/route.ts')
    expect(src).toContain('awardXp(userId, 5)')
  })

  it('frontend should not call /api/xp/add', () => {
    const src = readSource('app/cards/deck/page.tsx')
    expect(src).not.toContain("axios.post('/api/xp/add'")
  })
})

describe('VUL-011: Ranking Pagination', () => {
  it('should have pagination parameters', () => {
    const src = readSource('app/api/ranking/route.ts')
    expect(src).toContain('take: limit')
    expect(src).toContain('skip: offset')
  })

  it('should enforce maximum limit of 100', () => {
    const src = readSource('app/api/ranking/route.ts')
    expect(src).toContain("'100'")
  })
})

describe('Security Vulnerabilities File', () => {
  it('should have all vulnerabilities resolved (empty array)', () => {
    const src = readSource('security_vulnerabities.json')
    const vulns = JSON.parse(src)
    expect(vulns).toEqual([])
  })
})
