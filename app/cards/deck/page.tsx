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
  const audioCacheRef = useRef<Record<string, string>>({})
  const abortControllerRef = useRef<AbortController | null>(null)

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

  // 2. Helper: Fetch Audio URL
  const fetchAudioUrl = async (text: string, signal?: AbortSignal): Promise<string> => {
    const fetchBlob = async (url: string) => {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error("Audio fetch failed");
      return await res.blob();
    };

    try {
      const blob = await fetchBlob(`/api/tts?text=${encodeURIComponent(text)}&provider=unreal`);
      return URL.createObjectURL(blob);
    } catch (error: any) {
      if (error.name === 'AbortError') throw error;
      console.warn("Unreal Speech failed, trying Google fallback...");
      try {
        const blob = await fetchBlob(`/api/tts?text=${encodeURIComponent(text)}&provider=google`);
        return URL.createObjectURL(blob);
      } catch (finalError) {
        console.error("All TTS options failed");
        throw finalError;
      }
    }
  };

  // 3. Pre-fetch Effect
  useEffect(() => {
    if (cards.length === 0) return;

    // Create a new controller for this set of cards
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const preloadAudio = async () => {
      // Pre-fetch the first 5 cards in parallel rather than strictly sequential
      // to avoid one slow request blocking the entire queue.
      const cardsToPreload = cards.slice(0, 5);

      for (const card of cardsToPreload) {
        if (audioCacheRef.current[card.id]) continue;
        if (signal.aborted) break;

        const text = card.sentences[card.currentSentenceIndex];
        fetchAudioUrl(text, signal)
          .then(url => {
            audioCacheRef.current[card.id] = url;
          })
          .catch(e => {
            if (e.name !== 'AbortError') console.warn("Pre-fetch failed for card", card.id);
          });
      }
    };

    preloadAudio();

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      Object.values(audioCacheRef.current).forEach(url => URL.revokeObjectURL(url));
      audioCacheRef.current = {};
    };
  }, [cards]);

  // 4. Play Audio Logic
  const speakSentence = async (text: string, cardId: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const onEnded = () => {
      setAudioCompleted(prev => ({ ...prev, [cardId]: true }))
    }

    let audioUrl = audioCacheRef.current[cardId];

    try {
      if (!audioUrl) {
        // Fetch immediately if not in cache (don't pass the abort signal here as we want this to finish)
        audioUrl = await fetchAudioUrl(text);
        audioCacheRef.current[cardId] = audioUrl;
      }

      audioRef.current = new Audio(audioUrl);
      if (!audioUrl.includes("unreal")) {
        audioRef.current.playbackRate = 1.2;
      }
      audioRef.current.addEventListener('ended', onEnded);
      await audioRef.current.play();
    } catch (error) {
      console.error("Playback failed", error);
    }
  };

  const showXpToast = (amount: number) => {
    setSessionXp(prev => prev + amount)
    setXpToast(amount)
    setTimeout(() => setXpToast(null), 1200)
  }

  const handleSwipeXp = async (cardId: string, earnedReviewXp: boolean) => {
    let totalXpThisSwipe = 0
    if (earnedReviewXp) {
      totalXpThisSwipe += 10
      axios.post('/api/xp/add', { amount: 10, reason: 'card_review' }).catch(() => { })
    }
    if (audioCompleted[cardId]) {
      totalXpThisSwipe += 5
      axios.post('/api/xp/add', { amount: 5, reason: 'audio_listen' }).catch(() => { })
    }
    if (totalXpThisSwipe > 0) showXpToast(totalXpThisSwipe)
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

      if (result === 'success') {
        if (audioCacheRef.current[cardId]) {
          URL.revokeObjectURL(audioCacheRef.current[cardId]);
          delete audioCacheRef.current[cardId];
        }
        return newCards
      }
      return [...newCards, { ...card, currentSentenceIndex: (card.currentSentenceIndex + 1) % card.sentences.length }]
    })
    setFlipped(s => { const n = { ...s }; delete n[cardId]; return n; })
    axios.patch('/api/cards', { cardId, action: 'review', result })
  }

  return (
    <main dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#121212] text-[#FFFFFF] py-6 px-4 overflow-hidden flex flex-col justify-between antialiased">
      <div className="max-w-[400px] mx-auto w-full flex-1 flex flex-col">

        <header className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-[#3B82F6]" />
            <h1 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">
              {t('deck.label')}
            </h1>
          </div>
          <h2 className="text-[19px] font-bold tracking-tight uppercase">{t('deck.title')}</h2>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-[1px] w-6 bg-[#262626]" />
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
              onPlayAudio={() => speakSentence(card.sentences[card.currentSentenceIndex], card.id)}
            />
          ))}

          {cards.length === 0 && !loading && (
            <div className="w-full max-w-[320px] aspect-[2/3.3] flex flex-col items-center justify-center bg-[#121212] border border-[#2D2D2F] rounded-[14px] p-6 text-center shadow-2xl">
              <div className="w-14 h-14 bg-[#1D4ED8]/10 rounded-full flex items-center justify-center mb-4 border border-[#3B82F6]/20">
                <Sparkles className="text-[#3B82F6]" size={24} />
              </div>
              <h3 className="text-[19px] font-bold mb-2 uppercase">{t('deck.allCaughtUp')}</h3>
              <p className="text-[#9CA3AF] text-[14px] leading-relaxed mb-8">
                {t('deck.allCaughtUpDesc')}
              </p>
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
          <footer className="py-8 flex flex-col items-center gap-3 text-center">
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