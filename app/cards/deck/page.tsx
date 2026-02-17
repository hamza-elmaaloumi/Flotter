"use client"

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'
import Flashcard from './components/FlashCard'
import { Sparkles, Loader2 } from 'lucide-react'

// CONFIGURATION
const API_KEY = process.env.NEXT_PUBLIC_ELEVEN_LABS_KEY || "sk_af2c6b36ab6dc99603b9e6d639f69a7fd4760ea92548e848";
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // "Bella" - Clear and professional

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

  // --- THE SMART SPEECH FUNCTION ---
  const speakSentence = async (text: string) => {
    // 1. Stop any current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      // 2. TRY ELEVEN LABS FIRST
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

      // If ElevenLabs fails (out of credits or bad key), throw error to trigger catch block
      if (!response.ok) throw new Error("ElevenLabs limit reached or error");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      audioRef.current = new Audio(url);
      audioRef.current.play();

    } catch (error) {
      console.warn("ElevenLabs failed, switching to Google TTS fallback...");
      
      // 3. FALLBACK: GOOGLE TRANSLATE TRICK
      // This is free, unlimited, and requires no API key.
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
    <main className="min-h-screen bg-[#000000] text-white py-4 md:py-6 px-4 overflow-hidden flex flex-col justify-between">
      <div className="max-w-[400px] mx-auto w-full flex-1 flex flex-col">
        
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

        <div className="relative flex-1 w-full max-h-[550px] md:max-h-[600px] min-h-[400px] flex justify-center items-center" style={{ perspective: '1200px' }}>
          
          {loading && cards.length === 0 && (
            <div className="w-full max-w-[320px] aspect-[2/3.2] bg-zinc-900/20 border border-white/5 rounded-[24px] md:rounded-[32px] flex flex-col items-center justify-center space-y-4 animate-pulse">
                <Loader2 className="animate-spin text-zinc-700" size={24} />
                <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.2em]">Preparing</span>
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
                // CALL OUR SMART SPEECH FUNCTION
                speakSentence(card.sentences[card.currentSentenceIndex])
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

        {!loading && cards.length > 0 && (
            <footer className="py-4 md:py-8 text-center">
                <div className="inline-flex items-center gap-4 text-zinc-600">
                    <span className="text-[8px] font-black uppercase tracking-widest">Premium AI Audio Active</span>
                </div>
            </footer>
        )}
      </div>
    </main>
  )
}