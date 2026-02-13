'use client'

import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'
import Flashcard from './components/FlashCard'

type Card = {
  id: string
  word: string
  imageUrl: string
  sentences: string[]
  currentSentenceIndex: number
  _reviewedAt?: number
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

  useEffect(() => { loadCards() }, [loadCards])

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const u = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  const handleReview = (cardId: string, result: 'success' | 'struggle') => {
    // 1. INSTANT STATE UPDATE (No awaiting animations)
    setCards((prev) => {
      const cardIndex = prev.findIndex(c => c.id === cardId)
      if (cardIndex === -1) return prev
      
      const card = prev[cardIndex]
      const newCards = prev.filter(c => c.id !== cardId)

      if (result === 'success') {
        return newCards
      } else {
        const updatedCard = {
          ...card,
          currentSentenceIndex: (card.currentSentenceIndex + 1) % card.sentences.length,
          _reviewedAt: Date.now()
        }
        return [...newCards, updatedCard]
      }
    })

    setFlipped(s => {
      const newState = { ...s }
      delete newState[cardId]
      return newState
    })

    // 2. BACKGROUND SYNC
    axios.patch('/api/cards', { cardId, action: 'review', result }).catch(err => {
      console.error('Sync failed', err)
    })
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
          {/* 
            RENDER ONLY THE TOP 2 CARDS
            No AnimatePresence = No lag waiting for "exit" transitions.
            Card at index 0 is always the top/draggable one.
          */}
          {cards.slice(0, 2).map((card, index) => (
            <Flashcard
              key={card.id} 
              card={card}
              isTop={index === 0}
              isFlipped={!!flipped[card.id]}
              onFlip={() => {
                setFlipped(s => ({ ...s, [card.id]: true }))
                speak(card.sentences[card.currentSentenceIndex])
              }}
              onReview={handleReview}
            />
          ))}
          
          {cards.length === 0 && !loading && (
            <div className="text-center py-20">
              <p className="text-zinc-500 font-medium italic">All caught up!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}