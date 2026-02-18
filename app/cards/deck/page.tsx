"use client"

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'
import Flashcard from './components/FlashCard'
import { Sparkles, Loader2, Zap } from 'lucide-react'
import { useLanguage } from '../../providers/LanguageProvider'

export default function DeckPage() {
  const { user } = useUser()
  const router = useRouter()
  const { t, language } = useLanguage()
  
  // State
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})
  
  // Audio Refs & Cache
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // Stores cardId -> blobUrl so we don't fetch twice
  const audioCacheRef = useRef<Record<string, string>>({}) 

  // XP tracking state
  const [flipTimestamps, setFlipTimestamps] = useState<Record<string, number>>({})
  const [audioCompleted, setAudioCompleted] = useState<Record<string, boolean>>({})
  const [sessionXp, setSessionXp] = useState(0)
  const [xpToast, setXpToast] = useState<number | null>(null)

  // 1. Load Cards
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

  // 2. Helper: Fetch Audio URL (Unreal -> Google Fallback)
  // This function returns the Blob URL string, it does NOT play audio.
  const fetchAudioUrl = async (text: string): Promise<string> => {
    const fetchBlob = async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Audio fetch failed");
      return await res.blob();
    };

    try {
      // --- TRY: Unreal Speech ---
      const blob = await fetchBlob(`/api/tts?text=${encodeURIComponent(text)}&provider=unreal`);
      return URL.createObjectURL(blob);
    } catch (error) {
      console.warn("Unreal Speech pre-fetch failed, trying Google...", error);
      try {
        // --- CATCH: Google TTS Fallback ---
        const blob = await fetchBlob(`/api/tts?text=${encodeURIComponent(text)}&provider=google`);
        return URL.createObjectURL(blob);
      } catch (finalError) {
        console.error("All TTS options failed for text:", text);
        throw finalError;
      }
    }
  };

  // 3. Pre-fetch Effect
  // As soon as cards load, we start fetching audio in the background
  useEffect(() => {
    if (cards.length === 0) return;

    const preloadAudio = async () => {
      // We loop through cards. 
      // Using a for...of loop ensures we don't spam the network with 20 requests at the exact same millisecond,
      // but rather queue them up reasonably fast.
      for (const card of cards) {
        // Check if we already have it in cache to avoid duplicate work
        if (audioCacheRef.current[card.id]) continue;

        const text = card.sentences[card.currentSentenceIndex];
        try {
          const url = await fetchAudioUrl(text);
          audioCacheRef.current[card.id] = url;
        } catch (e) {
          // If pre-fetch fails, we just ignore it. 
          // The speakSentence function will try again when the user flips.
        }
      }
    };

    preloadAudio();

    // Cleanup: Revoke object URLs when component unmounts to free memory
    return () => {
      Object.values(audioCacheRef.current).forEach(url => URL.revokeObjectURL(url));
      audioCacheRef.current = {};
    };
  }, [cards]); // Re-run if cards change (e.g. after a review updates the sentence index)

  // 4. Play Audio Logic
  const speakSentence = async (text: string, cardId: string) => {
    // Stop previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const onEnded = () => {
      setAudioCompleted(prev => ({ ...prev, [cardId]: true }))
    }

    // Check Cache First
    let audioUrl = audioCacheRef.current[cardId];

    try {
      // If NOT in cache (maybe user flipped super fast before pre-fetch finished), fetch it now
      if (!audioUrl) {
        audioUrl = await fetchAudioUrl(text);
        // Add to cache for next time
        audioCacheRef.current[cardId] = audioUrl;
      }

      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('ended', onEnded);
      
      // If the URL came from our fallback logic (likely Google), we speed it up slightly
      // We can't easily detect if it's Google or Unreal here without complex logic, 
      // but 1.1x is usually safe for both. If you only want it for Google, 
      // you'd need to store metadata. For now, we apply the slight speed boost 
      // if it sounds too slow.
      // Note: Unreal usually ignores playbackRate if it's streamed efficiently, but HTML5 audio handles it.
      // If Unreal is fast enough, you can remove this line, or keep it for the Google fallback.
      // audioRef.current.playbackRate = 1.1; 

      await audioRef.current.play();
    } catch (error) {
      console.error("Playback failed", error);
    }
  };

  // XP toast helper
  const showXpToast = (amount: number) => {
    setSessionXp(prev => prev + amount)
    setXpToast(amount)
    setTimeout(() => setXpToast(null), 1200)
  }

  const handleSwipeXp = async (cardId: string, earnedReviewXp: boolean) => {
    let totalXpThisSwipe = 0

    if (earnedReviewXp) {
      // +10 XP for reviewing (waited 1.5s)
      totalXpThisSwipe += 10
      axios.post('/api/xp/add', { amount: 10, reason: 'card_review' }).catch(() => {})
    }

    if (audioCompleted[cardId]) {
      // +5 XP for listening to full audio
      totalXpThisSwipe += 5
      axios.post('/api/xp/add', { amount: 5, reason: 'audio_listen' }).catch(() => {})
    }

    if (totalXpThisSwipe > 0) showXpToast(totalXpThisSwipe)

    // Clean up tracking for this card
    setFlipTimestamps(prev => { const n = { ...prev }; delete n[cardId]; return n })
    setAudioCompleted(prev => { const n = { ...prev }; delete n[cardId]; return n })
  }

  const handleReview = (cardId: string, result: 'success' | 'struggle') => {
    if (audioRef.current) audioRef.current.pause();

    setCards((prev) => {
      const cardIndex = prev.findIndex(c => c.id === cardId)
      if (cardIndex === -1) return prev
      const card = prev[cardIndex]
      const newCards = prev.filter(c => c.id !== cardId)
      
      // If success, card is removed. If struggle, it stays but sentence might change.
      if (result === 'success') {
        // Clean up cache for removed card to save memory
        if (audioCacheRef.current[cardId]) {
            URL.revokeObjectURL(audioCacheRef.current[cardId]);
            delete audioCacheRef.current[cardId];
        }
        return newCards
      }

      // If we keep the card, we might rotate the sentence.
      // The useEffect [cards] will detect this change and pre-fetch the NEW sentence audio automatically.
      return [...newCards, { ...card, currentSentenceIndex: (card.currentSentenceIndex + 1) % card.sentences.length }]
    })

    setFlipped(s => { const n = { ...s }; delete n[cardId]; return n; })
    axios.patch('/api/cards', { cardId, action: 'review', result })
  }

  return (
    // Background: primary (#121212) | Typography: System Default
    <main dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#121212] text-[#FFFFFF] py-6 px-4 overflow-hidden flex flex-col justify-between antialiased">
      <div className="max-w-[400px] mx-auto w-full flex-1 flex flex-col">
        
        <header className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            {/* Primary Blue for brand icons */}
            <Sparkles size={14} className="text-[#3B82F6]" />
            {/* Typography: label (11px, Bold, Uppercase) */}
            <h1 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">
              {t('deck.label')}
            </h1>
          </div>
          {/* Typography: h1 (19px, Bold) */}
          <h2 className="text-[19px] font-bold tracking-tight uppercase">{t('deck.title')}</h2>
          
          <div className="mt-4 flex items-center gap-3">
            <div className="h-[1px] w-6 bg-[#262626]" />
            {/* item_radius: 12px | secondary bg (#222222) */}
            <div className="bg-[#222222] border border-[#2D2D2F] px-4 py-1 rounded-[12px]">
              <span className="text-[#3B82F6] font-bold text-[11px] tracking-widest uppercase">
                {cards.length} {cards.length === 1 ? t('deck.cardLeft') : t('deck.cardsLeft')}
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
                <span className="text-[#6B7280] text-[11px] font-bold uppercase tracking-widest">{t('deck.preparing')}</span>
            </div>
          )}

          {cards.slice(0, 2).map((card, index) => (
            <Flashcard
              key={card.id} 
              card={card}
              isTop={index === 0}
              isFlipped={!!flipped[card.id]}
              flipTimestamp={flipTimestamps[card.id] || null}
              onFlip={() => {
                const now = Date.now()
                setFlipped(s => ({ ...s, [card.id]: true }))
                setFlipTimestamps(s => ({ ...s, [card.id]: now }))
                speakSentence(card.sentences[card.currentSentenceIndex], card.id)
              }}
              onReview={handleReview}
              onSwipeXp={(earned) => handleSwipeXp(card.id, earned)}
            />
          ))}
          
          {cards.length === 0 && !loading && (
            // card_radius: 14px | primary bg (#121212)
            <div className="w-full max-w-[320px] aspect-[2/3.3] flex flex-col items-center justify-center bg-[#121212] border border-[#2D2D2F] rounded-[14px] p-6 text-center shadow-2xl">
              <div className="w-14 h-14 bg-[#1D4ED8]/10 rounded-full flex items-center justify-center mb-4 border border-[#3B82F6]/20">
                <Sparkles className="text-[#3B82F6]" size={24} />
              </div>
              <h3 className="text-[19px] font-bold mb-2 uppercase">{t('deck.allCaughtUp')}</h3>
              {/* body_medium: 14px */}
              <p className="text-[#9CA3AF] text-[14px] leading-relaxed mb-8">
                {t('deck.allCaughtUpDesc')}
              </p>
              {/* button_primary: #3B82F6, radius 12px */}
              <button 
                onClick={() => router.push('/cards/learning')} 
                className="w-full bg-[#3B82F6] text-[#FFFFFF] py-4 rounded-[12px] font-bold uppercase text-[11px] tracking-widest active:scale-95 transition-all"
              >
                {t('deck.returnHome')}
              </button>
            </div>
          )}
        </div>

        {!loading && cards.length > 0 && (
            <footer className="py-8 text-center">
                <div className="inline-flex items-center gap-4 text-[#6B7280]">
                    <span className="text-[11px] font-bold uppercase tracking-widest">{t('deck.audioActive')}</span>
                </div>
                {sessionXp > 0 && (
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-[#222222] border border-[#2D2D2F] px-4 py-1.5 rounded-[12px]">
                    <Zap size={12} className="text-[#FACC15]" fill="currentColor" />
                    <span className="text-[#FACC15] text-[11px] font-bold tracking-widest uppercase">+{sessionXp} {t('deck.xpSession')}</span>
                  </div>
                )}
            </footer>
        )}

        {/* XP Toast */}
        {xpToast !== null && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] animate-bounce">
            <div className="bg-[#FACC15] text-[#000000] px-6 py-2.5 rounded-[12px] font-black text-[14px] flex items-center gap-2 shadow-[0_10px_30px_rgba(250,204,21,0.3)]">
              <Zap size={16} fill="currentColor" />
              +{xpToast} XP
            </div>
          </div>
        )}
      </div>
    </main>
  )
}