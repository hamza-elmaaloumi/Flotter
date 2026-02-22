import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from 'bcryptjs'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

// Store last request for IP extraction in credentials authorize
let lastRequest: Request | null = null

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        const normalizedEmail = credentials.email.toLowerCase().trim()

        // Rate limit: 10 login attempts per 15 minutes per email
        const rateLimitResult = checkRateLimit(`login:${normalizedEmail}`, { maxRequests: 10, windowMs: 15 * 60 * 1000 })
        if (!rateLimitResult.success) {
          throw new Error('Too many login attempts. Please try again later.')
        }

        // ISSUE-018: Also rate limit by IP to prevent credential stuffing across many accounts
        if (lastRequest) {
          const ip = getClientIp(lastRequest)
          const ipRateLimitResult = checkRateLimit(`login-ip:${ip}`, { maxRequests: 30, windowMs: 15 * 60 * 1000 })
          if (!ipRateLimitResult.success) {
            throw new Error('Too many login attempts from this IP. Please try again later.')
          }
        }
        
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail }
        })

        if (!user || !user.passwordHash) {
          throw new Error('Invalid credentials')
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image && user.image.startsWith('data:') ? null : user.image
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // Optimization: Ensure large profile images (Base64) don't bloat the JWT
        // NextAuth by default carries the 'image'/'picture' field.
        // If it starts with 'data:', it's a massive Base64 string that will cause 431 errors.
        if (typeof (user as any).image === 'string' && (user as any).image.startsWith('data:')) {
          token.picture = null
          // @ts-ignore
          token.image = null
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  }
}

const handler = NextAuth(authOptions)

// Wrap handler to capture the request for IP-based rate limiting (ISSUE-018)
async function wrappedHandler(req: Request, ctx: any) {
  lastRequest = req
  return handler(req, ctx)
}

export { wrappedHandler as GET, wrappedHandler as POST }