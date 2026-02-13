'use client'

import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  PanInfo
} from 'framer-motion'
import React, { useState, useEffect, useRef } from 'react'
import { Check, X, Hand, Sparkles } from 'lucide-react'

interface FlashcardProps {
  card: {
    id: string | number
    word: string
    imageUrl: string
    sentences: string[]
    currentSentenceIndex: number
  }
  displayIndex: number // 0 is the top card
  isFlipped: boolean
  onFlip: () => void
  onReview: (id: string, status: 'success' | 'struggle') => void
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default function Flashcard({ card, displayIndex, isFlipped, onFlip, onReview }: FlashcardProps) {
  const x = useMotionValue(0)
  const controls = useAnimation()
  const [isDragging, setIsDragging] = useState(false)
  const [windowWidth, setWindowWidth] = useState(1000)
  const exitDir = useRef(0) // 1 or -1 (used for exit animation direction)

  useEffect(() => {
    setWindowWidth(window.innerWidth)
  }, [])

  // --- 1. Physics & Transforms ---
  const rotateZ = useTransform(x, [-200, 200], [-12, 12])
  const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 1, 1, 1, 0])
  const successOpacity = useTransform(x, [50, 150], [0, 1])
  const struggleOpacity = useTransform(x, [-50, -150], [0, 1])

  // Stack effect: Cards below the top one are scaled down and moved slightly down
  const stackScale = 1 - (displayIndex * 0.05)
  const stackY = displayIndex * 15

  const handleDragEnd = async (_: any, info: PanInfo) => {
    if (displayIndex !== 0) return // Only top card is interactive

    setIsDragging(false)
    const offset = info.offset.x
    const velocity = info.velocity.x
    const threshold = windowWidth < 768 ? 80 : 150

    if (offset > threshold || velocity > 500) {
      exitDir.current = 1
      // animate top card out (so underlying cards don't have to run entrance)
      await controls.start({ x: windowWidth + 200, opacity: 0, transition: { duration: 0.28 } })
      onReview(card.id as string, 'success')
    } else if (offset < -threshold || velocity < -500) {
      exitDir.current = -1
      await controls.start({ x: -windowWidth - 200, opacity: 0, transition: { duration: 0.28 } })
      onReview(card.id as string, 'struggle')
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 40 } })
    }
  }

  const rawSentence = card.sentences[card.currentSentenceIndex] || ''
  const maskedSentence = rawSentence.replace(new RegExp(`\\b(${escapeRegExp(card.word)})\\b`, 'gi'), "______")

  return (
    <motion.div
      // disable initial entrance animation so underlying cards don't "pop" when top card is removed
      initial={false}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      animate={{
        scale: stackScale,
        y: stackY,
        opacity: 1,
        zIndex: 50 - displayIndex
      }}
      exit={{
        x: exitDir.current >= 0 ? 500 : -500,
        opacity: 0,
        scale: 0.5,
        transition: { duration: 0.18 },
        zIndex: 0
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div
        className={`relative w-full max-w-[360px] h-[600px] touch-none pointer-events-auto ${displayIndex === 0 ? 'cursor-grab active:cursor-grabbing' : ''}`}
        style={{ x: displayIndex === 0 ? x : 0, rotate: displayIndex === 0 ? rotateZ : 0, opacity }}
        animate={controls}
        drag={displayIndex === 0 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
      >

        <motion.div
          className="w-full h-full relative preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        >

          {/* FRONT FACE */}
          <CardFace side="front" onClick={() => !isDragging && displayIndex === 0 && onFlip()}>
            <div className="h-[45%] w-full relative bg-zinc-900 overflow-hidden rounded-t-[32px]">
              <img src={card.imageUrl} className="w-full h-full object-cover" alt="Context" />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-zinc-900 to-transparent" />
            </div>

            <div className="h-[55%] bg-zinc-900 w-full rounded-b-[32px] p-6 flex flex-col items-center text-center border-x border-b border-white/10">
              <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <span className="text-emerald-500 text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-2">
                  <Sparkles size={12} /> New Word
                </span>
                <h2 className="text-4xl font-black text-white tracking-tight">
                  {card.word.charAt(0)}<span className="tracking-widest opacity-50">_______</span>
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed font-medium">{maskedSentence}</p>
              </div>
              <div className="pt-4 opacity-50">
                <span className="text-[10px] uppercase font-bold tracking-widest text-white flex items-center gap-2">
                  <Hand size={14} /> Tap to Reveal
                </span>
              </div>
            </div>
          </CardFace>

          {/* BACK FACE */}
          <CardFace side="back">
            <motion.div style={{ opacity: successOpacity }} className="absolute inset-0 bg-emerald-500/20 z-20 pointer-events-none rounded-[32px]" />
            <motion.div style={{ opacity: struggleOpacity }} className="absolute inset-0 bg-rose-500/20 z-20 pointer-events-none rounded-[32px]" />
            <StatusStamp side="left" opacity={struggleOpacity} />
            <StatusStamp side="right" opacity={successOpacity} />

            <div className="h-[45%] w-full relative bg-zinc-900 overflow-hidden rounded-t-[32px]">
              <img src={card.imageUrl} className="w-full h-full object-cover" alt="Context" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-900 to-transparent" />
            </div>

            <div className="h-[55%] bg-zinc-900 w-full rounded-b-[32px] p-6 flex flex-col items-center text-center border-x border-b border-white/10 relative z-10">
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <span className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase font-bold">Definition</span>
                <h2 className="text-5xl font-black text-white drop-shadow-xl tracking-tighter">{card.word}</h2>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <HighlightSentence sentence={rawSentence} word={card.word} />
                </div>
              </div>
              <div className="w-full flex justify-between px-4 pt-4 opacity-40">
                <div className="flex items-center gap-1 text-rose-500">
                  <X size={14} /> <span className="text-[9px] font-black uppercase">Study</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-500">
                  <span className="text-[9px] font-black uppercase">Mastered</span> <Check size={14} />
                </div>
              </div>
            </div>
          </CardFace>

        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function CardFace({ children, side, onClick }: any) {
  const isBack = side === 'back'
  return (
    <div
      onClick={onClick}
      className="absolute inset-0 w-full h-full rounded-[32px] shadow-2xl flex flex-col"
      style={{
        backfaceVisibility: 'hidden',
        transform: isBack ? 'rotateY(180deg)' : 'none',
        backgroundColor: '#18181b'
      }}
    >
      {children}
    </div>
  )
}


function StatusStamp({ side, opacity }: { side: 'left' | 'right', opacity: any }) {
  const isRight = side === 'right'
  return (
    <motion.div
      style={{ opacity, rotate: isRight ? -15 : 15 }}
      className={`absolute top-1/2 -translate-y-1/2 ${isRight ? 'left-8' : 'right-8'} z-50 border-[6px] rounded-xl px-4 py-2 pointer-events-none`}
    >
      <span className={`text-4xl font-black uppercase tracking-widest ${isRight ? 'text-emerald-500 border-emerald-500' : 'text-rose-500 border-rose-500'}`}>
        {isRight ? 'YES' : 'NOPE'}
      </span>
    </motion.div>
  )
}

function HighlightSentence({ sentence, word }: { sentence: string, word: string }) {
  const parts = sentence.split(new RegExp(`(${escapeRegExp(word)})`, 'gi'))
  return (
    <p className="text-sm md:text-base text-zinc-300 leading-snug">
      {parts.map((part, i) =>
        part.toLowerCase() === word.toLowerCase() ? (
          <span key={i} className="text-emerald-400 font-bold">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  )
}
