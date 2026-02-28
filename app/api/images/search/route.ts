import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

// Blocklist: reject image searches that could return inappropriate/haram content
const IMAGE_SEARCH_BLOCKLIST = /\b(girl|woman|women|man|men|boy|person|people|human|face|body|model|beauty|beautiful|pretty|hot|sexy|bikini|lingerie|underwear|nude|naked|topless|erotic|sensual|romance|romantic|couple|kiss|love|dating|bride|wedding|fashion|swimsuit|beach.?body|fitness.?model|portrait|selfie|legs|curves|chest|cleavage|booty|twerk|harem|belly.?danc|porn|xxx|strip|provocative|seductive|flirty|girlfriend|boyfriend|babe|crush)\b/i;

export async function GET(req: Request) {
  try {
    // 1. Secure the route: Only allow logged-in users to search images
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const q = url.searchParams.get('query') || ''
    if (!q) return NextResponse.json({ results: [] })

    // 2. Content safety: Block inappropriate search queries
    if (IMAGE_SEARCH_BLOCKLIST.test(q)) {
      return NextResponse.json({ 
        results: [], 
        error: 'content_filtered',
        message: 'This search query is not permitted. Please search for objects, places, or nature instead.' 
      })
    }

    // 3. Fetch the API Key from environment variables
    const key = process.env.UNSPLASH_ACCESS_KEY
    if (!key) {
      console.error('Missing UNSPLASH_ACCESS_KEY in .env')
      return NextResponse.json({ error: 'server_configuration_error' }, { status: 500 })
    }

    // 4. Perform the proxy request to Unsplash with content_filter=high for maximum safety
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=32&content_filter=high`, {
      headers: { Authorization: `Client-ID ${key}` },
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'unsplash_error', details: text }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
    
  } catch (err) {
    console.error('Images search error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}