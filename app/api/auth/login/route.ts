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

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (!user) {
      return NextResponse.json({ error: 'invalid credentials' }, { status: 401 })
    }

    const computedHash = crypto.createHash('sha256').update(password).digest()
    const storedHash = Buffer.from(user.passwordHash, 'hex')

    if (storedHash.length !== computedHash.length || !crypto.timingSafeEqual(storedHash, computedHash)) {
      return NextResponse.json({ error: 'invalid credentials' }, { status: 401 })
    }

    const safeUser = { id: user.id, email: user.email }
    return NextResponse.json({ user: safeUser }, { status: 200 })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Login error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
