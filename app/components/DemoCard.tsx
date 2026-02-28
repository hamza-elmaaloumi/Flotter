"use client"

import React, { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate, PanInfo, AnimatePresence } from 'framer-motion'
import { Hand, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { useTheme } from '../providers/ThemeProvider'

const DEMO_CARDS = [
  {
    word: 'Ephemeral',
    sentence: 'The ephemeral rainbow vanished before she could capture a single photo, leaving only wet pavement behind.',
    imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&h=300&fit=crop',
  },
  {
    word: 'Resilient',
    sentence: 'The resilient little tree grew straight through a crack in the concrete, reaching toward sunlight despite everything.',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop',
  },
  {
    word: 'Serendipity',
    sentence: 'By pure serendipity, she found a hundred-dollar bill inside the old library book she had borrowed yesterday.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
  },
]

export default function DemoCard({ t }: { t: (key: string) => string }) {
  const { isDark } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const x = useMotionValue(0)
  const rotateZ = useTransform(x, [-200, 200], [-10, 10])
  const successOpacity = useTransform(x, [50, 150], [0, 1])
  const struggleOpacity = useTransform(x, [-50, -150], [0, 1])

  const card = DEMO_CARDS[currentIndex]
  const maskedSentence = card.sentence.replace(
    new RegExp(`\\b(${card.word})\\b`, 'gi'),
    '______'
  )

  const handleFlip = () => {
    if (!isDragging) {
      setIsFlipped(true)
      setTimeout(() => setShowSwipeHint(true), 600)
    }
  }

  const handleDrag = (_: any, info: PanInfo) => {
    x.set(info.offset.x * 1.6)
  }

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const currentX = x.get()
    const threshold = 120

    if (currentX > threshold || info.velocity.x > 500) {
      await animate(x, 500, { duration: 0.3, ease: 'easeOut' })
      nextCard()
    } else if (currentX < -threshold || info.velocity.x < -500) {
      await animate(x, -500, { duration: 0.3, ease: 'easeOut' })
      nextCard()
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 })
    }
    setIsDragging(false)
  }

  const nextCard = () => {
    setCompletedCount((c) => c + 1)
    setIsFlipped(false)
    setShowSwipeHint(false)
    x.set(0)
    setCurrentIndex((i) => (i + 1) % DEMO_CARDS.length)
  }

  const resetDemo = () => {
    setCompletedCount(0)
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowSwipeHint(false)
    x.set(0)
  }

  const handleBackClick = () => {
    if (!isDragging && isFlipped) {
      setShowSwipeHint(true)
      animate(x, -30, { duration: 0.15, ease: 'easeInOut' })
        .then(() => animate(x, 30, { duration: 0.15, ease: 'easeInOut' }))
        .then(() => animate(x, 0, { duration: 0.15, ease: 'easeInOut' }))
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {DEMO_CARDS.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i < completedCount
                ? 'bg-emerald-500'
                : i === currentIndex
                ? 'bg-[#3B82F6] scale-125'
                : isDark
                ? 'bg-white/20'
                : 'bg-black/15'
            }`}
          />
        ))}
      </div>

      {/* Card container - explicit dimensions to prevent collapse */}
      <div className="relative" style={{ width: 310, height: 512 }}>
        <motion.div
          style={{ x, rotateZ }}
          drag={isFlipped ? 'x' : false}
          onDragStart={() => setIsDragging(true)}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className={`absolute inset-0 touch-none ${isFlipped ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
          <motion.div
            className="w-full h-full relative"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* FRONT */}
            <div
              onPointerUp={handleFlip}
              className={`absolute inset-0 rounded-[32px] overflow-hidden shadow-2xl border cursor-pointer ${
                isDark ? 'bg-[#222222] border-white/10' : 'bg-white border-black/10'
              }`}
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <motion.div
                style={{ opacity: successOpacity }}
                className="absolute inset-0 bg-emerald-500/20 z-20 pointer-events-none flex items-start justify-start p-5"
              >
                <div className="border-4 border-emerald-500 px-2.5 py-1 rounded-xl -rotate-12">
                  <span className="text-emerald-500 text-lg font-black uppercase tracking-wider">Learned</span>
                </div>
              </motion.div>
              <motion.div
                style={{ opacity: struggleOpacity }}
                className="absolute inset-0 bg-rose-500/20 z-20 pointer-events-none flex items-start justify-end p-5"
              >
                <div className="border-4 border-rose-500 px-2.5 py-1 rounded-xl rotate-12">
                  <span className="text-rose-500 text-lg font-black uppercase tracking-wider">Review</span>
                </div>
              </motion.div>

              <div className="h-[45%] w-full">
                <img src={card.imageUrl} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="h-[55%] p-6 flex flex-col items-center text-center">
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <span className="text-emerald-500 text-[9px] tracking-[0.2em] uppercase font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {t('landing.demo.newWord')}
                  </span>
                  <h2 className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                    {card.word.charAt(0)}
                    <span className="tracking-widest opacity-50">_______</span>
                  </h2>
                  <p className={`text-xs md:text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#6B7280]'}`}>
                    {maskedSentence}
                  </p>
                </div>
                <div className={`pt-3 opacity-50 flex items-center gap-2 text-[9px] uppercase font-bold tracking-widest ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                  <Hand size={14} /> {t('landing.demo.tapReveal')}
                </div>
              </div>
            </div>

            {/* BACK */}
            <div
              onPointerUp={handleBackClick}
              className={`absolute inset-0 rounded-[32px] overflow-hidden shadow-2xl border ${
                isDark ? 'bg-[#222222] border-white/10' : 'bg-white border-black/10'
              }`}
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <motion.div
                style={{ opacity: successOpacity }}
                className="absolute inset-0 bg-emerald-500/20 z-20 pointer-events-none flex items-start justify-start p-5"
              >
                <div className="border-4 border-emerald-500 px-2.5 py-1 rounded-xl -rotate-12">
                  <span className="text-emerald-500 text-lg font-black uppercase tracking-wider">Learned</span>
                </div>
              </motion.div>
              <motion.div
                style={{ opacity: struggleOpacity }}
                className="absolute inset-0 bg-rose-500/20 z-20 pointer-events-none flex items-start justify-end p-5"
              >
                <div className="border-4 border-rose-500 px-2.5 py-1 rounded-xl rotate-12">
                  <span className="text-rose-500 text-lg font-black uppercase tracking-wider">Review</span>
                </div>
              </motion.div>

              <div className="h-[45%] w-full">
                <img src={card.imageUrl} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="h-[55%] p-6 flex flex-col items-center text-center relative">
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <h2 className={`text-2xl md:text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                    {card.word}
                  </h2>
                  <div className={`p-3 rounded-xl border text-xs md:text-sm flex items-start gap-2 text-left ${
                    isDark ? 'bg-white/5 border-white/5 text-zinc-300' : 'bg-black/5 border-black/5 text-[#4B5563]'
                  }`}>
                    <p className="leading-relaxed">
                      {card.sentence.split(new RegExp(`(\\b${card.word}\\b)`, 'gi')).map((part, i) =>
                        part.toLowerCase() === card.word.toLowerCase()
                          ? <span key={i} className="text-emerald-400 font-bold">{part}</span>
                          : part
                      )}
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {showSwipeHint && (
                    <div className="absolute inset-x-0 bottom-5 flex justify-between px-6 pointer-events-none">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center">
                          <ArrowLeft className="text-rose-500" size={16} />
                        </div>
                        <span className="text-rose-500 text-[7px] font-black uppercase tracking-widest">Review</span>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                          <ArrowRight className="text-emerald-500" size={16} />
                        </div>
                        <span className="text-emerald-500 text-[7px] font-black uppercase tracking-widest">Learned</span>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Reset button when all cards are reviewed */}
      {completedCount >= DEMO_CARDS.length && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={resetDemo}
          className="flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-bold text-[#3B82F6] border border-[#3B82F6]/30 hover:bg-[#3B82F6]/10 transition-all"
        >
          <RotateCcw size={14} />
          {t('landing.demo.tryAgain')}
        </motion.button>
      )}
    </div>
  )
}
