"use client"

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
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
    <main className="min-h-screen bg-[#000000] text-[#FFFFFF] py-[32px] px-[20px] overflow-hidden font-['San_Francisco',_Roboto,_Arial,_sans-serif]">
      {/* Decorative Brand Element */}
      <div className="fixed top-0 left-1/4 w-[400px] h-[400px] bg-[#22C55E]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-lg mx-auto relative h-[75vh]">
        <header className="mb-[32px] text-center">
          <h1 className="text-[28px] font-[700] tracking-tight text-[#FFFFFF] uppercase">Daily Deck</h1>
          <div className="mt-2 inline-block bg-[#1C1C1E] px-[16px] py-[4px] rounded-[20px]">
             <p className="text-[#22C55E] text-[14px] uppercase font-[600] tracking-widest">
              {cards.length} Items Pending
            </p>
          </div>
        </header>

        <div className="relative w-full h-[600px] mx-auto" style={{ perspective: '1200px' }}>
          {/* RENDER ONLY THE TOP 2 CARDS
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
              // These props would ideally utilize the design system's interactive_card styling:
              // background: #1C1C1E, border_radius: 24px, padding: 20px
            />
          ))}
          
          {cards.length === 0 && !loading && (
            <div className="text-center py-20 bg-[#121212] border border-[#3A3A3C] rounded-[24px]">
              <p className="text-[#98989E] font-[400] text-[17px] italic">All caught up!</p>
              <div className="mt-4 text-[#ffffff] text-[14px] font-[600] uppercase tracking-widest">
                Return later for new cards or add some manually.
              </div>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/')}
                  className="mt-4 inline-flex items-center gap-2 bg-[#22C55E] hover:bg-[#16a34a] text-black px-4 py-2 rounded-full font-[700] uppercase tracking-widest"
                  aria-label="Go back home"
                >
                  Back Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Persistent Navigation Placeholder styling (Bottom Tab Bar logic) */}
      <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-[#000000] border-t-[0.5px] border-[#1C1C1E] flex items-center justify-around px-6 lg:hidden">
        <div className="w-6 h-6 rounded-full bg-[#3B82F6]" />
        <div className="w-6 h-6 rounded-full bg-[#FFFFFF]" />
        <div className="w-6 h-6 rounded-full bg-[#FFFFFF]" />
      </div>
    </main>
  )
}