import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import bcrypt from 'bcryptjs'
import { checkRateLimit, getClientIp } from '../../../../lib/rate-limit'

export async function POST(req: Request) {
  try {
    // Rate limit: 5 registration attempts per 15 minutes per IP
    const ip = getClientIp(req)
    const rateLimitResult = checkRateLimit(`register:${ip}`, { maxRequests: 5, windowMs: 15 * 60 * 1000 })
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await req.json()
    const { email, password } = body || {}

    if (!email || !password) {
      return NextResponse.json({ error: 'email and password required' }, { status: 400 })
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // ISSUE-013: Enforce password complexity
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json({ error: 'Password must contain at least one uppercase letter' }, { status: 400 })
    }
    if (!/[a-z]/.test(password)) {
      return NextResponse.json({ error: 'Password must contain at least one lowercase letter' }, { status: 400 })
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json({ error: 'Password must contain at least one number' }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    // Hash password with bcrypt (secure salted hashing)
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash: passwordHash,
      },
    })

    const safeUser = { id: user.id, email: user.email }
    return NextResponse.json({ user: safeUser }, { status: 201 })

  } catch (err) {
    console.error('Registration error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}