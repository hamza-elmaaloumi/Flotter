import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const q = url.searchParams.get('query') || ''
    if (!q) return NextResponse.json({ results: [] })

    const key = process.env.UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
    if (!key) return NextResponse.json({ error: 'missing_unsplash_key' }, { status: 500 })

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
    // eslint-disable-next-line no-console
    console.error('Images search error', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
