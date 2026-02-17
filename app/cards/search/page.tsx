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
    <div className="min-h-screen bg-[#121212] text-[#FFFFFF] antialiased selection:bg-[#3B82F6]/30">
      {/* Header - Clean Style, Left Aligned per Design System */}
      <div className="sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-md border-b border-[#262626]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your collection..."
                // Typography: body_medium (15px)
                className="w-full bg-[#222222] border border-[#2D2D2F] rounded-[12px] py-2.5 pl-10 pr-4 text-[15px] text-[#FFFFFF] placeholder-[#6B7280] outline-none focus:border-[#3B82F6] transition-all"
              />
            </div>
            <Link 
              href="/cards/new" 
              // Button Primary Style: #3B82F6 with 12px radius
              className="p-2.5 bg-[#3B82F6] text-[#FFFFFF] rounded-[12px] hover:bg-[#1D4ED8] transition-colors flex items-center justify-center"
            >
              <Plus size={20} />
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-1.5"> {/* Logic UI State: spacing_and_radius gap */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-[#3B82F6] mb-4" />
              {/* Typography: label (12px, Bold, Uppercase) */}
              <span className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Loading</span>
            </div>
          ) : (
            <>
              {results.length === 0 && (
                <div className="py-20 text-center border border-dashed border-[#2D2D2F] rounded-[16px]">
                  <p className="text-[15px] text-[#9CA3AF]">No matches for "{query}"</p>
                </div>
              )}

              {results.map((card) => (
                <Link 
                  key={card.id} 
                  href={`/cards/${card.id}/edit`}
                  // Settings Row / Standard Card Style: #1C1C1E background, 16px radius
                  className="flex items-center justify-between p-3 bg-[#1C1C1E] hover:bg-[#222222] border border-[#2D2D2F] rounded-[16px] transition-all group active:scale-[0.99] h-[56px]"
                >
                  <div className="flex items-center gap-3">
                    {/* Icon/Image Container: Rounded 8px per list_items spec */}
                    <div className="w-10 h-10 rounded-[8px] bg-[#333333] overflow-hidden flex-shrink-0 flex items-center justify-center border border-[#2D2D2F]">
                      {card.imageUrl ? (
                        <img 
                          src={card.imageUrl} 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <ImageIcon size={18} className="text-[#6B7280]" />
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                      {/* Typography: body_large (17px, SemiBold) */}
                      <span className="text-[15px] font-semibold text-[#FFFFFF]">
                        {card.word}
                      </span>
                      {/* Typography: caption (13px, Medium, Color: secondary) */}
                      <span className="text-[13px] font-medium text-[#9CA3AF]">
                        Recently added
                      </span>
                    </div>
                  </div>

                  <div className="mr-1">
                    <ChevronRight size={18} className="text-[#6B7280] group-hover:text-[#3B82F6] transition-colors" />
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
        
        {!loading && (
          <footer className="mt-8 mb-10 text-center">
            <div className="inline-block px-4 py-1.5 bg-[#222222] border border-[#2D2D2F] rounded-full">
              {/* Typography: label (12px, Bold, Uppercase) */}
              <p className="text-[12px] font-bold uppercase tracking-widest text-[#6B7280]">
                {results.length} Cards Found
              </p>
            </div>
          </footer>
        )}
      </main>
    </div>
  )
}