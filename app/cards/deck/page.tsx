"use client"

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'
import Flashcard from './components/FlashCard'
import { Sparkles, Loader2, Zap, Crown, X } from 'lucide-react'
import { useLanguage } from '../../providers/LanguageProvider'
import { useTheme } from '../../providers/ThemeProvider'
import Link from 'next/link'
import StreakCelebration from './components/StreakCelebration'
import XpNotification from './components/XpNotification'

export default function DeckPage() {
  const { user } = useUser()
  const router = useRouter()
  const { t, language } = useLanguage()
  const { isDark } = useTheme()

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

  // Ref to pass XP intent from handleSwipeXp → handleReview (called sequentially per swipe)
  const pendingXpRef = useRef<{ earned: boolean; audio: boolean }>({ earned: false, audio: false })

  // Swipe counter & upsell
  const [swipeCount, setSwipeCount] = useState(0)
  const [showUpsell, setShowUpsell] = useState(false)
  const isPro = user?.isPro || false

  // Streak celebration
  const [showStreakCelebration, setShowStreakCelebration] = useState(false)
  const [dashData, setDashData] = useState<any>(null)
  const hasSwipedRef = useRef(false)

  // 1. Load Cards
  const loadCards = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const res = await axios.get('/api/cards', { params: { dueOnly: true } })
      setCards(res.data.cards || [])
    } catch (err) {
      console.error('Load cards error', err)
    } finally { setLoading(false) }
  }, [user?.id])

  useEffect(() => { loadCards() }, [loadCards])

  // Fetch dashboard data for streak info
  useEffect(() => {
    if (!user?.id) return
    axios.get('/api/cards/dash').then(res => setDashData(res.data)).catch(console.error)
  }, [user?.id])

  // Celebration dismiss handler — marks today as celebrated in localStorage
  const handleCelebrationDismiss = useCallback(() => {
    setShowStreakCelebration(false)
    const todayStr = new Date().toISOString().slice(0, 10)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`flotter-streak-celebrated-${todayStr}`, 'true')
    }
  }, [])

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
    const audio = !!audioCompleted[cardId]
    let totalXpThisSwipe = 0
    if (earnedReviewXp) {
      totalXpThisSwipe += 10
    }
    if (audio) {
      totalXpThisSwipe += 5
    }
    // Store XP intent so handleReview (called immediately after) can send it to the server
    pendingXpRef.current = { earned: earnedReviewXp, audio }
    if (totalXpThisSwipe > 0) showXpToast(totalXpThisSwipe)
    setFlipTimestamps(prev => { const n = { ...prev }; delete n[cardId]; return n })
    setAudioCompleted(prev => { const n = { ...prev }; delete n[cardId]; return n })
  }

  const handleReview = (cardId: string, result: 'success' | 'struggle') => {
    if (audioRef.current) audioRef.current.pause();

    // First-swipe streak celebration (once per day, only if user was not yet active today)
    if (!hasSwipedRef.current && dashData) {
      hasSwipedRef.current = true
      const todayStr = new Date().toISOString().slice(0, 10)
      const wasActiveBeforeSession = dashData.lastActiveDate
        ? new Date(dashData.lastActiveDate).toISOString().slice(0, 10) === todayStr
        : false
      const celebratedToday = typeof window !== 'undefined'
        ? localStorage.getItem(`flotter-streak-celebrated-${todayStr}`) === 'true'
        : true
      if (!wasActiveBeforeSession && !celebratedToday) {
        setTimeout(() => setShowStreakCelebration(true), 800)
      }
    }

    // Track swipe count for free users
    const newSwipeCount = swipeCount + 1
    setSwipeCount(newSwipeCount)
    if (!isPro && newSwipeCount > 0 && newSwipeCount % 10 === 0) {
      setShowUpsell(true)
    }

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
      // On struggle, keep the same sentence index so the user stays on
      // the sentence they failed until they get it right.
      return [...newCards, { ...card }]
    })
    setFlipped(s => { const n = { ...s }; delete n[cardId]; return n; })

    // Read XP intent set by handleSwipeXp (called synchronously just before this)
    const { earned, audio } = pendingXpRef.current
    pendingXpRef.current = { earned: false, audio: false }

    // Use fetch with keepalive so the request survives page navigation / tab close.
    // XP is persisted immediately per-swipe — not deferred to session end.
    fetch('/api/cards', {
      method: 'PATCH',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardId,
        action: 'review',
        result,
        earnedReviewXp: earned,
        audioPlayed: audio,
      }),
    }).catch(() => { /* best-effort: XP & review already queued */ })
  }

  return (
    <main dir={language === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen py-6 px-4 overflow-hidden flex flex-col justify-between antialiased ${isDark ? 'bg-[#121212] text-[#FFFFFF]' : 'bg-[#F8F9FA] text-[#111827]'}`}>
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
            <div className={`h-[1px] w-6 ${isDark ? 'bg-[#262626]' : 'bg-[#E2E4E9]'}`} />
            <div className={`px-4 py-1 rounded-[12px] border ${isDark ? 'bg-[#222222] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}>
              <span className="text-[#3B82F6] font-bold text-[11px] tracking-widest uppercase">
                {cards.length} {cards.length === 1 ? t('deck.cardLeft') : t('deck.cardsLeft')}
              </span>
            </div>
            <div className={`h-[1px] w-6 ${isDark ? 'bg-[#262626]' : 'bg-[#E2E4E9]'}`} />
          </div>
        </header>

        <div className="relative flex-1 w-full max-h-[550px] min-h-[400px] flex justify-center items-center" style={{ perspective: '1200px' }}>

          {loading && cards.length === 0 && (
            <div className={`w-full max-w-[320px] aspect-[2/3.2] border rounded-[14px] flex flex-col items-center justify-center space-y-4 animate-pulse ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}>
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
            <div className={`w-full max-w-[320px] aspect-[2/3.3] flex flex-col items-center justify-center border rounded-[14px] p-6 text-center shadow-2xl ${isDark ? 'bg-[#121212] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}>
              <div className="w-14 h-14 bg-[#1D4ED8]/10 rounded-full flex items-center justify-center mb-4 border border-[#3B82F6]/20">
                <Sparkles className="text-[#3B82F6]" size={24} />
              </div>
              <h3 className="text-[19px] font-bold mb-2 uppercase">{t('deck.allCaughtUp')}</h3>
              <p className={`text-[14px] leading-relaxed mb-8 ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
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
              <div className={`mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[12px] border ${isDark ? 'bg-[#222222] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}>
                <Zap size={12} className="text-[#FACC15]" fill="currentColor" />
                <span className="text-[#FACC15] text-[11px] font-bold tracking-widest uppercase">+{sessionXp} {t('deck.xpSession')}</span>
              </div>
            )}
          </footer>
        )}

        {/* XP toast notification */}
        <XpNotification amount={xpToast} />

        {/* 10-CARD UPSELL — INLINE PRO PROMPT */}
        {showUpsell && !isPro && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
            {/* Backdrop with blur */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowUpsell(false)} />
            
            <div className={`relative max-w-[340px] w-full rounded-[24px] overflow-hidden border ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`} style={{ animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              {/* Close button */}
              <button
                onClick={() => setShowUpsell(false)}
                className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-[#222222] text-[#6B7280] hover:text-white' : 'bg-[#F0F1F3] text-[#9CA3AF] hover:text-[#111827]'}`}
              >
                <X size={14} />
              </button>

              {/* Header section */}
              <div className="pt-8 pb-4 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20 flex items-center justify-center mb-3">
                  <Crown size={24} className="text-[#FACC15]" fill="currentColor" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FACC15] mb-1">Flotter Pro</span>
              </div>

              {/* Content */}
              <div className="px-5 pb-5">
                <div className="text-center mb-4">
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'}`}>
                    {swipeCount} {t('deck.reviewedCards2')}
                  </p>
                  <h3 className="text-[18px] font-bold mb-1">{t('deck.adTitle')}</h3>
                  <p className={`text-[12px] leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                    {t('deck.adDesc')}
                  </p>
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                  {[t('learning.tagUnlimited'), t('learning.tagNoAds'), t('learning.tagStreakFreeze')].map((tag) => (
                    <span key={tag} className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${isDark ? 'bg-[#FACC15]/10 border border-[#FACC15]/20 text-[#FACC15]' : 'bg-[#D97706]/5 border border-[#D97706]/15 text-[#D97706]'}`}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div className={`h-[1px] w-full mb-5 ${isDark ? 'bg-[#2D2D2F]' : 'bg-[#E2E4E9]'}`} />

                {/* CTA */}
                <div className="flex flex-col gap-2">
                  <Link
                    href="/subscribe"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-[14px] font-bold text-[13px] transition-all active:scale-[0.97] bg-[#3B82F6] text-white"
                  >
                    <Zap size={14} fill="currentColor" />
                    {t('deck.adCta')}
                  </Link>
                  <button
                    onClick={() => setShowUpsell(false)}
                    className={`w-full py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${isDark ? 'text-[#6B7280] hover:text-white' : 'text-[#9CA3AF] hover:text-[#111827]'}`}
                  >
                    {t('deck.adDismiss')}
                  </button>
                </div>
              </div>

              <style>{`
                @keyframes slideUp {
                  from { opacity: 0; transform: translateY(30px) scale(0.96); }
                  to { opacity: 1; transform: translateY(0) scale(1); }
                }
              `}</style>
            </div>
          </div>
        )}

        {/* STREAK CELEBRATION MODAL */}
        <StreakCelebration
          visible={showStreakCelebration}
          onDismiss={handleCelebrationDismiss}
          streak={dashData?.streak || 0}
          swipeCount={swipeCount}
          sessionXp={sessionXp}
          isPro={isPro}
        />
      </div>
    </main>
  )
}