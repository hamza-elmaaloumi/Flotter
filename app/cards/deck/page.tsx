'use client'

import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'
import Flashcard from './componenets/FlashCard'
import { AnimatePresence } from 'framer-motion'

type Card = {
  id: string
  word: string
  imageUrl: string
  sentences: string[]
  currentSentenceIndex: number
  consecutiveCorrect?: number
}

export default function DeckPage() {
  const { user } = useUser()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(false)
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})

  const loadCards = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const res = await axios.get('/api/cards', { params: { userId: user.id, dueOnly: true, rotate: true } })
      setCards(res.data.cards || [])
    } catch (err: any) {
      console.error('Load cards error', err)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadCards()
  }, [loadCards])

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const u = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  const handleReview = async (cardId: string, result: 'success' | 'struggle') => {
    try {
      // Optimistically update UI by removing/moving card first for instant feel
      if (result === 'success') {
        setCards((prev) => prev.filter(c => c.id !== cardId))
      } else {
        setCards((prev) => {
          const card = prev.find(c => c.id === cardId)
          if (!card) return prev
          const remaining = prev.filter(c => c.id !== cardId)
          return [...remaining, card]
        })
      }

      // Sync with backend in background
      await axios.patch('/api/cards', { cardId, action: 'review', result })
      
      setFlipped(s => {
        const newState = { ...s }
        delete newState[cardId]
        return newState
      })
    } catch (err) {
      console.error('Review update error', err)
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-200 py-12 px-6 overflow-hidden">
      <div className="fixed top-0 left-1/4 w-[400px] h-[400px] bg-emerald-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-lg mx-auto relative h-[75vh]">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-white uppercase">Daily Deck</h1>
          <p className="text-emerald-500/60 text-[10px] uppercase tracking-[0.4em] font-bold mt-2">
            {cards.length} Items Pending
          </p>
        </header>

        <div className="relative w-full h-[600px] mx-auto" style={{ perspective: '1200px' }}>
          <AnimatePresence>
            {/* 
               We render the top 3 cards. 
               We REVERSE them so that the first item (index 0) is rendered LAST in the DOM, 
               which puts it on top of the stack.
            */}
            {cards.slice(0, 3).reverse().map((card, index, array) => {
              // Calculate actual index in the "visible" stack (0 is top)
              const displayIndex = array.length - 1 - index;
              return (
                <Flashcard
                  key={card.id}
                  card={card}
                  displayIndex={displayIndex}
                  isFlipped={!!flipped[card.id]}
                  onFlip={() => {
                    setFlipped(s => ({ ...s, [card.id]: true }));
                    speak(card.sentences[card.currentSentenceIndex]);
                  }}
                  onReview={handleReview}
                />
              )
            })}
          </AnimatePresence>
          
          {cards.length === 0 && !loading && (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
              <p className="text-zinc-500 font-medium italic">All caught up for today!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}