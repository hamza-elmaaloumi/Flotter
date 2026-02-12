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

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return NextResponse.json({ error: 'email already registered' }, { status: 409 })
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex')

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Register error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
