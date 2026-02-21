import { NextResponse } from 'next/server'

/**
 * POST /api/xp/add
 * 
 * DEPRECATED: XP is now awarded server-side directly within action routes
 * (card creation, card review, TTS audio listen) to prevent client-side manipulation.
 * This endpoint is kept to avoid 404s from old clients but rejects all requests.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint has been deprecated. XP is now awarded automatically.' },
    { status: 410 }
  )
}
