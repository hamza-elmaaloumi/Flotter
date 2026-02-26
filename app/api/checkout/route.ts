import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { Polar } from '@polar-sh/sdk'

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: 'production',
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // @ts-ignore
    const userId = session.user.id
    const userEmail = session.user.email!

    const result = await polar.checkouts.create({
      products: [process.env.POLAR_PRODUCT_ID!],
      customerEmail: userEmail,
      successUrl: `${process.env.NEXTAUTH_URL || 'https://flotter.vercel.app'}/subscribe?success=true`,
      metadata: {
        userId,
      },
    })

    return NextResponse.json({ checkoutUrl: result.url })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: err.message },
      { status: 500 }
    )
  }
}




// In Code: Change server: 'sandbox' to server: 'production'.
// POLAR_ACCESS_TOKEN: Generate a new one at polar.sh/settings (the real site, not sandbox).
// POLAR_PRODUCT_ID: Create your product again on the real polar.sh dashboard and copy the new ID.
// POLAR_WEBHOOK_SECRET: Create a new Webhook Endpoint in the real polar.sh settings pointing to your live URL, then copy the new secret.

// In Vercel: Replace the old Sandbox Token with the Real Token.
// In Vercel: Replace the old Sandbox Product ID with the Real Product ID.
// In Vercel: Replace the old Sandbox Webhook Secret with the Real Webhook Secret.
// Redeploy: Click "Redeploy" in Vercel to apply these new settings.