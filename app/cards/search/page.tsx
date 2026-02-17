'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Loader2, ChevronRight, Image as ImageIcon, Plus } from 'lucide-react'

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
    <div className="min-h-screen bg-[#050505] text-white antialiased selection:bg-blue-500/30">
      {/* Search Header - Using a slightly lighter zinc for separation */}
      <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your collection..."
                className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-2.5 pl-10 pr-4 text-[14px] text-zinc-100 placeholder-zinc-500 outline-none focus:bg-white/[0.05] focus:border-white/[0.2] transition-all"
              />
            </div>
            <Link 
              href="/cards/new" 
              className="p-2.5 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors"
            >
              <Plus size={18} />
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-zinc-700 mb-2" />
              <span className="text-[12px] text-zinc-500 uppercase tracking-widest">Loading</span>
            </div>
          ) : (
            <>
              {results.length === 0 && (
                <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl">
                  <p className="text-[14px] text-zinc-500">No matches for "{query}"</p>
                </div>
              )}

              {results.map((card) => (
                <Link 
                  key={card.id} 
                  href={`/cards/${card.id}/edit`}
                  className="flex items-center justify-between p-3 bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/[0.08] rounded-2xl transition-all group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    {/* Thumbnail with slight glow/border */}
                    <div className="w-11 h-11 rounded-xl bg-zinc-800 overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/[0.1] shadow-inner">
                      {card.imageUrl ? (
                        <img 
                          src={card.imageUrl} 
                          alt="" 
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                        />
                      ) : (
                        <ImageIcon size={18} className="text-zinc-600" />
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-[15px] font-semibold text-zinc-200 group-hover:text-white transition-colors">
                        {card.word}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-medium">Updated recently</span>
                    </div>
                  </div>

                  <div className="mr-2">
                    <ChevronRight size={16} className="text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
        
        {!loading && (
          <footer className="mt-10 mb-10 text-center">
            <div className="inline-block px-3 py-1 bg-zinc-900/50 border border-white/[0.05] rounded-full">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                {results.length} Cards Found
              </p>
            </div>
          </footer>
        )}
      </main>
    </div>
  )
}