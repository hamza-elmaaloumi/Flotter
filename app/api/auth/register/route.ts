import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body || {}

    if (!email || !password) {
      return NextResponse.json({ error: 'email and password required' }, { status: 400 })
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    // Hash password (Your existing logic)
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex')

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