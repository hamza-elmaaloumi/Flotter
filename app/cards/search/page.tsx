'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Loader2, ChevronRight, Image as ImageIcon } from 'lucide-react'

interface SearchResult {
  id: string
  word: string
  imageUrl?: string 
}

export default function ListPage() {
  const [query, setQuery] = useState('')
  const [allCards, setAllCards] = useState<SearchResult[]>([])
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)

  const extractDisplayWord = (card: any): string => {
    if (card.word && typeof card.word === 'string') return card.word;
    const s = card.sentences;
    if (Array.isArray(s) && s.length > 0) {
      const first = s[0];
      return typeof first === 'string' ? first : (first.text || first.word || 'Untitled');
    }
    return 'Untitled';
  }

  useEffect(() => {
    let mounted = true
    async function fetchAll() {
      try {
        const res = await fetch('/api/cards/dash')
        if (!res.ok) throw new Error('Failed to load cards')
        const data = await res.json()
        const transformed = (data.cards || []).map((c: any) => ({
          id: c.id,
          word: extractDisplayWord(c),
          imageUrl: c.imageUrl,
        }))
        if (mounted) {
          setAllCards(transformed)
          setResults(transformed)
        }
      } catch (err) {
        console.error('Search fetch error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchAll()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const normalized = query.toLowerCase().trim()
      setResults(normalized ? allCards.filter(c => c.word.toLowerCase().includes(normalized)) : allCards)
    }, 150)
    return () => clearTimeout(timer)
  }, [query, allCards])

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-blue-500/30">
      {/* Search Header - Sticky and Flush */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/[0.05]">
        <div className="max-w-3xl mx-auto px-3 py-3">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-3 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vocabulary..."
              className="w-full bg-zinc-900/50 border border-white/[0.08] rounded-full py-1.5 pl-9 pr-4 text-[13px] placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-3 py-4">
        <div className="grid grid-cols-1 gap-[1px] bg-white/[0.05] rounded-lg overflow-hidden border border-white/[0.05]">
          {loading ? (
            <div className="flex items-center justify-center py-10 bg-black">
              <Loader2 size={16} className="animate-spin text-zinc-500" />
            </div>
          ) : (
            <>
              {results.length === 0 && (
                <div className="py-8 text-center bg-black">
                  <p className="text-[12px] text-zinc-500">No results found.</p>
                </div>
              )}

              {results.map((card) => (
                <Link 
                  key={card.id} 
                  href={`/cards/${card.id}/edit`}
                  className="flex items-center justify-between px-3 py-2.5 bg-black hover:bg-zinc-900/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    {/* Tiny Thumbnail */}
                    <div className="w-7 h-7 rounded-md bg-zinc-900 overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/[0.05]">
                      {card.imageUrl ? (
                        <img src={card.imageUrl} alt="" className="w-full h-full object-cover opacity-80" />
                      ) : (
                        <ImageIcon size={12} className="text-zinc-700" />
                      )}
                    </div>
                    
                    <span className="text-[13px] font-medium text-zinc-200 group-hover:text-white transition-colors">
                      {card.word}
                    </span>
                  </div>

                  <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </>
          )}
        </div>
        
        {/* Subtle Footer Counter */}
        {!loading && (
          <div className="mt-4 px-1">
            <p className="text-[10px] uppercase tracking-widest text-zinc-600">
              {results.length} Total items
            </p>
          </div>
        )}
      </main>
    </div>
  )
}