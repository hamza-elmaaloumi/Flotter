/**
 * Simple in-memory rate limiter.
 * For production at scale with serverless (Vercel), consider Upstash Redis rate limiting.
 * This provides basic protection against brute-force and abuse within a single instance.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup stale entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

interface RateLimitOptions {
  /** Maximum number of requests in the window */
  maxRequests: number
  /** Window duration in milliseconds */
  windowMs: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

/**
 * Check rate limit for a given key (typically IP + route).
 * Returns { success: true } if under limit, { success: false } if exceeded.
 */
export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetAt) {
    // New window
    const resetAt = now + options.windowMs
    rateLimitStore.set(key, { count: 1, resetAt })
    return { success: true, remaining: options.maxRequests - 1, resetAt }
  }

  if (entry.count >= options.maxRequests) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { success: true, remaining: options.maxRequests - entry.count, resetAt: entry.resetAt }
}

/**
 * Extract client IP from request headers.
 * ISSUE-006: Prefer x-real-ip (set by trusted proxies like Vercel/Nginx)
 * over x-forwarded-for (which can be spoofed by clients).
 */
export function getClientIp(req: Request): string {
  // x-real-ip is typically set by the trusted reverse proxy and is harder to spoof
  const realIp = req.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return 'unknown'
}
