import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // THIS FIXES THE 'OAuthAccountNotLinked' ERROR:
      allowDangerousEmailAccountLinking: true, 
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        const normalizedEmail = credentials.email.toLowerCase().trim()
        
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail }
        })

        if (!user || !user.passwordHash) {
          throw new Error('Invalid credentials')
        }

        const computedHash = crypto.createHash('sha256').update(credentials.password).digest()
        const storedHash = Buffer.from(user.passwordHash, 'hex')

        if (storedHash.length !== computedHash.length || !crypto.timingSafeEqual(storedHash, computedHash)) {
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

export { handler as GET, handler as POST }