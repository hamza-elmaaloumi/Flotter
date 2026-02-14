import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

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

    // 2. Fetch the API Key from environment variables
    const key = process.env.UNSPLASH_ACCESS_KEY
    if (!key) {
      console.error('Missing UNSPLASH_ACCESS_KEY in .env')
      return NextResponse.json({ error: 'server_configuration_error' }, { status: 500 })
    }

    // 3. Perform the proxy request to Unsplash
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=32`, {
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