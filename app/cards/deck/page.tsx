"use client"

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'
import Flashcard from './components/FlashCard'
import { Sparkles, Loader2 } from 'lucide-react'

// CONFIGURATION
const API_KEY = process.env.NEXT_PUBLIC_ELEVEN_LABS_KEY || "sk_af2c6b36ab6dc99603b9e6d639f69a7fd4760ea92548e848";
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

export default function DeckPage() {
  const { user } = useUser()
  const router = useRouter()
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

  const speakSentence = async (text: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        }),
      });

      if (!response.ok) throw new Error("ElevenLabs limit reached or error");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      audioRef.current = new Audio(url);
      audioRef.current.play();

    } catch (error) {
      console.warn("ElevenLabs failed, switching to Google TTS fallback...");
      const googleFallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
      audioRef.current = new Audio(googleFallbackUrl);
      audioRef.current.play();
    }
  };

  const handleReview = (cardId: string, result: 'success' | 'struggle') => {
    if (audioRef.current) audioRef.current.pause();

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
    // Background: primary (#121212) | Typography: System Default
    <main className="min-h-screen bg-[#121212] text-[#FFFFFF] py-6 px-4 overflow-hidden flex flex-col justify-between antialiased">
      <div className="max-w-[400px] mx-auto w-full flex-1 flex flex-col">
        
        <header className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            {/* Primary Blue for brand icons */}
            <Sparkles size={14} className="text-[#3B82F6]" />
            {/* Typography: label (11px, Bold, Uppercase) */}
            <h1 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">
              Daily Training
            </h1>
          </div>
          {/* Typography: h1 (19px, Bold) */}
          <h2 className="text-[19px] font-bold tracking-tight uppercase">The Deck</h2>
          
          <div className="mt-4 flex items-center gap-3">
            <div className="h-[1px] w-6 bg-[#262626]" />
            {/* item_radius: 12px | secondary bg (#222222) */}
            <div className="bg-[#222222] border border-[#2D2D2F] px-4 py-1 rounded-[12px]">
              <span className="text-[#3B82F6] font-bold text-[11px] tracking-widest uppercase">
                {cards.length} {cards.length === 1 ? 'Card' : 'Cards'} Left
              </span>
            </div>
            <div className="h-[1px] w-6 bg-[#262626]" />
          </div>
        </header>

        <div className="relative flex-1 w-full max-h-[550px] min-h-[400px] flex justify-center items-center" style={{ perspective: '1200px' }}>
          
          {loading && cards.length === 0 && (
            // card_radius: 14px
            <div className="w-full max-w-[320px] aspect-[2/3.2] bg-[#1C1C1E] border border-[#2D2D2F] rounded-[14px] flex flex-col items-center justify-center space-y-4 animate-pulse">
                <Loader2 className="animate-spin text-[#6B7280]" size={24} />
                <span className="text-[#6B7280] text-[11px] font-bold uppercase tracking-widest">Preparing</span>
            </div>
          )}

          {cards.slice(0, 2).map((card, index) => (
            <Flashcard
              key={card.id} 
              card={card}
              isTop={index === 0}
              isFlipped={!!flipped[card.id]}
              onFlip={() => {
                setFlipped(s => ({ ...s, [card.id]: true }))
                speakSentence(card.sentences[card.currentSentenceIndex])
              }}
              onReview={handleReview}
            />
          ))}
          
          {cards.length === 0 && !loading && (
            // card_radius: 14px | primary bg (#121212)
            <div className="w-full max-w-[320px] aspect-[2/3.3] flex flex-col items-center justify-center bg-[#121212] border border-[#2D2D2F] rounded-[14px] p-6 text-center shadow-2xl">
              <div className="w-14 h-14 bg-[#1D4ED8]/10 rounded-full flex items-center justify-center mb-4 border border-[#3B82F6]/20">
                <Sparkles className="text-[#3B82F6]" size={24} />
              </div>
              <h3 className="text-[19px] font-bold mb-2 uppercase">All Caught Up</h3>
              {/* body_medium: 14px */}
              <p className="text-[#9CA3AF] text-[14px] leading-relaxed mb-8">
                You've mastered all the cards for today.
              </p>
              {/* button_primary: #3B82F6, radius 12px */}
              <button 
                onClick={() => router.push('/')} 
                className="w-full bg-[#3B82F6] text-[#FFFFFF] py-4 rounded-[12px] font-bold uppercase text-[11px] tracking-widest active:scale-95 transition-all"
              >
                Return Home
              </button>
            </div>
          )}
        </div>

        {!loading && cards.length > 0 && (
            <footer className="py-8 text-center">
                <div className="inline-flex items-center gap-4 text-[#6B7280]">
                    <span className="text-[11px] font-bold uppercase tracking-widest">Premium AI Audio Active</span>
                </div>
            </footer>
        )}
      </div>
    </main>
  )
}