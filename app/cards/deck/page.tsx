"use client"

import React, { useEffect, useState, useCallback } from 'react'
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

  const handleReview = (cardId: string, result: 'success' | 'struggle') => {
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
    <main className="min-h-screen bg-[#000000] text-white py-6 px-4 overflow-hidden flex flex-col">
      <div className="max-w-[400px] mx-auto w-full flex-1 flex flex-col">
        
        {/* HEADER SECTION */}
        <header className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-emerald-500" />
            <h1 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">
              Daily Training
            </h1>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter">THE DECK</h2>
          
          <div className="mt-4 flex items-center gap-3">
            <div className="h-[1px] w-8 bg-zinc-800" />
            <div className="bg-zinc-900/50 border border-white/5 px-4 py-1 rounded-full">
              <span className="text-emerald-500 font-bold text-[10px] tracking-widest uppercase">
                {cards.length} {cards.length === 1 ? 'Card' : 'Cards'} Left
              </span>
            </div>
            <div className="h-[1px] w-8 bg-zinc-800" />
          </div>
        </header>

        {/* MAIN STAGE (Sized specifically for the 360x600 Flashcard) */}
        <div className="relative flex-1 w-full max-h-[600px] min-h-[500px] flex justify-center items-center" style={{ perspective: '1500px' }}>
          
          {/* LOADING STATE - Matching Card Dimensions */}
          {loading && cards.length === 0 && (
            <div className="w-[360px] h-[600px] bg-zinc-900/20 border border-white/5 rounded-[32px] flex flex-col items-center justify-center space-y-4 animate-pulse">
                <Loader2 className="animate-spin text-zinc-700" size={32} />
                <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">Preparing Deck</span>
            </div>
          )}

          {/* BACKGROUND DECORATIVE STACK (Fixes "ugly" flat UI) */}
          {!loading && cards.length > 1 && (
            <>
              {/* Bottom shadow/offset cards to create 3D depth */}
              <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[48%] w-[340px] h-[580px] bg-zinc-900 border border-white/5 rounded-[32px] -z-10 opacity-40" />
              <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[46%] w-[320px] h-[560px] bg-zinc-900/50 border border-white/5 rounded-[32px] -z-20 opacity-20" />
            </>
          )}

          {/* FLASHCARD RENDER */}
          {cards.slice(0, 2).map((card, index) => (
            <Flashcard
              key={card.id} 
              card={card}
              isTop={index === 0}
              isFlipped={!!flipped[card.id]}
              onFlip={() => {
                setFlipped(s => ({ ...s, [card.id]: true }))
                const u = new SpeechSynthesisUtterance(card.sentences[card.currentSentenceIndex])
                window.speechSynthesis.speak(u)
              }}
              onReview={handleReview}
            />
          ))}
          
          {/* EMPTY STATE - Matching Card Dimensions */}
          {cards.length === 0 && !loading && (
            <div className="w-[360px] h-[600px] flex flex-col items-center justify-center bg-zinc-900 border border-white/10 rounded-[32px] p-8 text-center shadow-2xl">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                <Sparkles className="text-emerald-500" size={32} />
              </div>
              <h3 className="text-2xl font-black mb-3 italic">ALL CAUGHT UP</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-10">
                You've mastered all the due cards in your deck for today. Great job!
              </p>
              <button 
                onClick={() => router.push('/')} 
                className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-transform"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>

        {/* BOTTOM INSTRUCTIONAL FOOTER */}
        {!loading && cards.length > 0 && (
            <footer className="py-8 text-center">
                <div className="inline-flex items-center gap-4 text-zinc-600">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black uppercase tracking-widest">Swipe Left</span>
                        <div className="w-6 h-1 bg-rose-500/30 rounded-full" />
                    </div>
                    <div className="h-4 w-[1px] bg-zinc-800" />
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black uppercase tracking-widest">Swipe Right</span>
                        <div className="w-6 h-1 bg-emerald-500/30 rounded-full" />
                    </div>
                </div>
            </footer>
        )}
      </div>
    </main>
  )
}