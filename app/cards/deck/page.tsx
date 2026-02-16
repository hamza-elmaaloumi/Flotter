"use client"

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'
import Flashcard from './components/FlashCard'
import { Sparkles, Loader2 } from 'lucide-react'

export default function DeckPage() {
  const { user } = useUser()
  const router = useRouter()
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const loadCards = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const res = await axios.get('/api/cards', { params: { dueOnly: true, rotate: true } })
      setCards(res.data.cards || [])
    } catch (err) {
      console.error('Load cards error', err)
    } finally { setLoading(false) }
  }, [user?.id])

  useEffect(() => { loadCards() }, [loadCards])

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
      currentUtteranceRef.current = null
    }
  }, [])

  const handleReview = (cardId: string, result: 'success' | 'struggle') => {
    window.speechSynthesis.cancel()
    currentUtteranceRef.current = null

    setCards((prev) => {
      const cardIndex = prev.findIndex(c => c.id === cardId)
      if (cardIndex === -1) return prev
      const card = prev[cardIndex]
      const newCards = prev.filter(c => c.id !== cardId)
      if (result === 'success') return newCards
      return [...newCards, { ...card, currentSentenceIndex: (card.currentSentenceIndex + 1) % card.sentences.length }]
    })

    setFlipped(s => { const n = { ...s }; delete n[cardId]; return n; })
    axios.patch('/api/cards', { cardId, action: 'review', result })
  }

  return (
    <main className="min-h-screen bg-[#000000] text-white py-4 md:py-6 px-4 overflow-hidden flex flex-col justify-between">
      <div className="max-w-[400px] mx-auto w-full flex-1 flex flex-col">
        
        {/* HEADER SECTION - Scaled Down */}
        <header className="mb-4 md:mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={12} className="text-emerald-500" />
            <h1 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">
              Daily Training
            </h1>
          </div>
          <h2 className="text-xl md:text-3xl font-bold tracking-tighter">THE DECK</h2>
          
          <div className="mt-2 md:mt-4 flex items-center gap-3">
            <div className="h-[1px] w-6 bg-zinc-800" />
            <div className="bg-zinc-900/50 border border-white/5 px-3 py-0.5 md:px-4 md:py-1 rounded-full">
              <span className="text-emerald-500 font-bold text-[8px] md:text-[10px] tracking-widest uppercase">
                {cards.length} {cards.length === 1 ? 'Card' : 'Cards'} Left
              </span>
            </div>
            <div className="h-[1px] w-6 bg-zinc-800" />
          </div>
        </header>

        {/* MAIN STAGE - Fluid Heights */}
        <div className="relative flex-1 w-full max-h-[550px] md:max-h-[600px] min-h-[400px] flex justify-center items-center" style={{ perspective: '1200px' }}>
          
          {loading && cards.length === 0 && (
            <div className="w-full max-w-[320px] aspect-[2/3.2] bg-zinc-900/20 border border-white/5 rounded-[24px] md:rounded-[32px] flex flex-col items-center justify-center space-y-4 animate-pulse">
                <Loader2 className="animate-spin text-zinc-700" size={24} />
                <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.2em]">Preparing</span>
            </div>
          )}

          {/* BACKGROUND DECORATIVE STACK - Adjusted for mobile scale */}
          {!loading && cards.length > 1 && (
            <>
              <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[49%] w-[90%] aspect-[2/3.3] bg-zinc-900 border border-white/5 rounded-[24px] md:rounded-[32px] -z-10 opacity-40" />
              <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[48%] w-[85%] aspect-[2/3.3] bg-zinc-900/50 border border-white/5 rounded-[24px] md:rounded-[32px] -z-20 opacity-20" />
            </>
          )}

          {cards.slice(0, 2).map((card, index) => (
            <Flashcard
              key={card.id} 
              card={card}
              isTop={index === 0}
              isFlipped={!!flipped[card.id]}
              onFlip={() => {
                window.speechSynthesis.cancel()
                setFlipped(s => ({ ...s, [card.id]: true }))
                const u = new SpeechSynthesisUtterance(card.sentences[card.currentSentenceIndex])
                currentUtteranceRef.current = u
                window.speechSynthesis.speak(u)
              }}
              onReview={handleReview}
            />
          ))}
          
          {cards.length === 0 && !loading && (
            <div className="w-full max-w-[320px] aspect-[2/3.3] flex flex-col items-center justify-center bg-zinc-900 border border-white/10 rounded-[24px] md:rounded-[32px] p-6 text-center shadow-2xl">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
                <Sparkles className="text-emerald-500" size={24} />
              </div>
              <h3 className="text-xl font-black mb-2 italic uppercase">All Caught Up</h3>
              <p className="text-zinc-500 text-xs leading-relaxed mb-8">
                You've mastered all the cards for today.
              </p>
              <button 
                onClick={() => router.push('/')} 
                className="w-full bg-white text-black py-3 rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform"
              >
                Return Home
              </button>
            </div>
          )}
        </div>

        {/* BOTTOM FOOTER - Minimalist size */}
        {!loading && cards.length > 0 && (
            <footer className="py-4 md:py-8 text-center">
                <div className="inline-flex items-center gap-4 text-zinc-600">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[8px] font-black uppercase tracking-widest">Review</span>
                        <div className="w-4 h-0.5 bg-rose-500/30 rounded-full" />
                    </div>
                    <div className="h-3 w-[1px] bg-zinc-800" />
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[8px] font-black uppercase tracking-widest">Learned</span>
                        <div className="w-4 h-0.5 bg-emerald-500/30 rounded-full" />
                    </div>
                </div>
            </footer>
        )}
      </div>
    </main>
  )
}