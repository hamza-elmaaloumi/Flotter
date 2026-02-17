'use client'

import { motion, useMotionValue, useTransform, PanInfo, animate, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { Check, X, Hand, Sparkles, ArrowLeft, ArrowRight, Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../../../providers/LanguageProvider'

interface FlashcardProps {
  card: {
    id: string | number
    word: string
    imageUrl: string
    sentences: string[]
    currentSentenceIndex: number
  }
  isTop: boolean
  isFlipped: boolean
  onFlip: () => void
  onReview: (id: string, status: 'success' | 'struggle') => void
  flipTimestamp: number | null
  onSwipeXp?: (earnedReviewXp: boolean) => void
}

export default function Flashcard({ card, isTop, isFlipped, onFlip, onReview, flipTimestamp, onSwipeXp }: FlashcardProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const x = useMotionValue(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(false)

  const sensitivityMultiplier = 1.6

  useEffect(() => {
    if (!isTop) x.set(0)
  }, [isTop, x])

  useEffect(() => {
    if (!isFlipped) setShowSwipeHint(false)
  }, [isFlipped])

  const rotateZ = useTransform(x, [-200, 200], [-10, 10])
  const opacity = useTransform(x, [-500, -300, 0, 300, 500], [0, 1, 1, 1, 0])
  const successOpacity = useTransform(x, [50, 150], [0, 1])
  const struggleOpacity = useTransform(x, [-50, -150], [0, 1])

  const handleDrag = (_: any, info: PanInfo) => {
    if (!isTop) return
    x.set(info.offset.x * sensitivityMultiplier)
  }

  const handleDragEnd = async (_: any, info: PanInfo) => {
    if (!isTop) return
    const currentX = x.get()
    const velocity = info.velocity.x
    const threshold = 120

    const waited = flipTimestamp ? (Date.now() - flipTimestamp >= 1500) : false

    if (currentX > threshold || velocity > 500) {
      await animate(x, 500, { duration: 0.3, ease: "easeOut" })
      onSwipeXp?.(waited)
      onReview(card.id as string, 'success')
      x.set(0)
    }
    else if (currentX < -threshold || velocity < -500) {
      await animate(x, -500, { duration: 0.3, ease: "easeOut" })
      onSwipeXp?.(waited)
      onReview(card.id as string, 'struggle')
      x.set(0)
    }
    else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 })
    }
    setIsDragging(false)
  }

  const handleBackClick = () => {
    if (!isDragging && isTop && isFlipped) {
      setShowSwipeHint(true)
      animate(x, -30, { duration: 0.15, ease: "easeInOut" })
        .then(() => animate(x, 30, { duration: 0.15, ease: "easeInOut" }))
        .then(() => animate(x, 0, { duration: 0.15, ease: "easeInOut" }))

      setTimeout(() => setShowSwipeHint(false), 1500)
    }
  }

  const rawSentence = card.sentences[card.currentSentenceIndex] || ''
  const maskedSentence = rawSentence.replace(new RegExp(`\\b(${card.word})\\b`, 'gi'), "______")

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        rotateZ: isTop ? rotateZ : 0,
        opacity: isTop ? opacity : 1,
        zIndex: isTop ? 50 : 40,
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      drag={isTop && isFlipped ? "x" : false}
      onDragStart={() => isFlipped && setIsDragging(true)}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      className={`touch-none ${isTop && isFlipped ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      {/* Reduced width from 340px to 310px for mobile */}
      <div className="w-full max-w-[310px] md:max-w-[350px] aspect-[2/3.3] relative">

        <button
          onClick={(e) => { e.stopPropagation(); router.push(`${card.id}/edit`); }}
          className="absolute top-4 right-4 z-[70] p-3 bg-zinc-800/80 backdrop-blur-md border border-white/10 rounded-full text-zinc-400 hover:text-white transition-all active:scale-90 shadow-xl"
        >
          <Pencil size={16} />
        </button>

        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* FRONT FACE */}
          <div
            onPointerUp={() => !isDragging && isTop && onFlip()}
            className="absolute inset-0 rounded-[32px] overflow-hidden shadow-2xl bg-zinc-900 border border-white/10"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <motion.div style={{ opacity: successOpacity }} className="absolute inset-0 bg-emerald-500/20 z-20 pointer-events-none flex items-start justify-start p-6">
              <div className="border-4 border-emerald-500 px-3 py-1 rounded-xl -rotate-12">
                <span className="text-emerald-500 text-xl md:text-2xl font-black uppercase tracking-wider">{t('flashcard.learned')}</span>
              </div>
            </motion.div>
            <motion.div style={{ opacity: struggleOpacity }} className="absolute inset-0 bg-rose-500/20 z-20 pointer-events-none flex items-start justify-end p-6">
              <div className="border-4 border-rose-500 px-3 py-1 rounded-xl rotate-12">
                <span className="text-rose-500 text-xl md:text-2xl font-black uppercase tracking-wider">{t('flashcard.review')}</span>
              </div>
            </motion.div>

            <div className="h-[45%] w-full">
              <img src={card.imageUrl} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="h-[55%] p-6 flex flex-col items-center text-center">
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 md:space-y-6">
                <span className="text-emerald-500 text-[8px] md:text-[9px] tracking-[0.2em] uppercase font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {t('flashcard.newWord')}
                </span>
                <h2 dir='ltr' className="text-2xl md:text-3xl font-black text-white">
                  {card.word.charAt(0)}<span className="tracking-widest opacity-50">_______</span>
                </h2>
                <p dir='ltr' className="text-zinc-400 text-xs md:text-base leading-relaxed">{maskedSentence}</p>
              </div>
              <div dir='ltr' className="pt-4 opacity-50 flex items-center gap-2 text-[9px] uppercase font-bold tracking-widest text-white">
                <Hand size={12} /> {t('flashcard.tapToReveal')}
              </div>
            </div>
          </div>

          {/* BACK FACE */}
          <div 
            onPointerUp={handleBackClick}
            className="absolute inset-0 bg-zinc-900 rounded-[32px] overflow-hidden border border-white/10"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <motion.div style={{ opacity: successOpacity }} className="absolute inset-0 bg-emerald-500/20 z-20 pointer-events-none flex items-start justify-start p-6">
              <div className="border-4 border-emerald-500 px-3 py-1 rounded-xl -rotate-12">
                <span className="text-emerald-500 text-xl md:text-2xl font-black uppercase tracking-wider">{t('flashcard.learned')}</span>
              </div>
            </motion.div>
            <motion.div style={{ opacity: struggleOpacity }} className="absolute inset-0 bg-rose-500/20 z-20 pointer-events-none flex items-start justify-end p-6">
              <div className="border-4 border-rose-500 px-3 py-1 rounded-xl rotate-12">
                <span className="text-rose-500 text-xl md:text-2xl font-black uppercase tracking-wider">{t('flashcard.review')}</span>
              </div>
            </motion.div>

            <div className="h-[45%] w-full">
              <img src={card.imageUrl} className="w-full h-full object-cover" alt="" />
            </div>
            <div  dir='ltr' className="h-[55%] p-6 flex flex-col items-center text-center relative">
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">{card.word}</h2>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-zinc-300 text-xs md:text-sm">
                  {rawSentence.split(new RegExp(`(\\b${card.word}\\b)`, 'gi')).map((part, i) =>
                    part.toLowerCase() === card.word.toLowerCase() ? <span key={i} className="text-emerald-400 font-bold">{part}</span> : part
                  )}
                </div>
              </div>

              <AnimatePresence>
                {showSwipeHint && (
                  <div className="absolute inset-x-0 bottom-6 flex justify-between px-8 pointer-events-none">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center">
                        <ArrowLeft className="text-rose-500" size={18} />
                      </div>
                      <span className="text-rose-500 text-[7px] font-black uppercase tracking-widest">{t('flashcard.review')}</span>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                        <ArrowRight className="text-emerald-500" size={18} />
                      </div>
                      <span className="text-emerald-500 text-[7px] font-black uppercase tracking-widest">{t('flashcard.learned')}</span>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}