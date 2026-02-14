'use client'

import { motion, useMotionValue, useTransform, PanInfo, animate, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { Check, X, Hand, Sparkles, ArrowLeft, ArrowRight, Pencil } from 'lucide-react' // Added Pencil icon
import { useRouter } from 'next/navigation'

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
}

export default function Flashcard({ card, isTop, isFlipped, onFlip, onReview }: FlashcardProps) {
  const router = useRouter()
  const x = useMotionValue(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(false)

  const sensitivityMultiplier = 1.6

  useEffect(() => {
    if (!isTop) {
      x.set(0)
    }
  }, [isTop, x])

  useEffect(() => {
    if (!isFlipped) {
      setShowSwipeHint(false)
    }
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

    if (currentX > threshold || velocity > 500) {
      await animate(x, 500, { duration: 0.3, ease: "easeOut" })
      onReview(card.id as string, 'success')
      x.set(0)
    }
    else if (currentX < -threshold || velocity < -500) {
      await animate(x, -500, { duration: 0.3, ease: "easeOut" })
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
        scale: 1,
        y: 0,
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
      <div className="w-full max-w-[360px] h-[600px] relative">
        {/* EDIT BUTTON (CRAYON STYLE) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`${card.id}/edit`);
          }}
          className="absolute top-4 right-4 z-[60] p-3 bg-zinc-800/80 backdrop-blur-md border border-white/10 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all active:scale-90 shadow-xl"
          title="Edit Card"
        >
          <Pencil size={18} />
        </button>

        <motion.div
          className="w-full h-full relative preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* FRONT FACE */}
          <div
            onPointerUp={() => !isDragging && isTop && onFlip()}
            className="absolute inset-0 backface-hidden rounded-[32px] overflow-hidden shadow-2xl bg-zinc-900 border border-white/10"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Swiping Indicators for Front Face */}
            <motion.div style={{ opacity: successOpacity }} className="absolute inset-0 bg-emerald-500/20 z-20 pointer-events-none flex items-start justify-start p-8">
              <div className="border-4 border-emerald-500 px-4 py-1 rounded-xl -rotate-12">
                <span className="text-emerald-500 text-3xl font-black uppercase tracking-wider">Learned</span>
              </div>
            </motion.div>
            <motion.div style={{ opacity: struggleOpacity }} className="absolute inset-0 bg-rose-500/20 z-20 pointer-events-none flex items-start justify-end p-8">
              <div className="border-4 border-rose-500 px-4 py-1 rounded-xl rotate-12">
                <span className="text-rose-500 text-3xl font-black uppercase tracking-wider">Review</span>
              </div>
            </motion.div>

            <div className="h-[45%] w-full">
              <img src={card.imageUrl} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="h-[55%] p-6 flex flex-col items-center text-center">
              <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <span className="text-emerald-500 text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> New Word
                </span>
                <h2 className="text-4xl font-black text-white">
                  {card.word.charAt(0)}<span className="tracking-widest opacity-50">_______</span>
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed">{maskedSentence}</p>
              </div>
              <div className="pt-4 opacity-50 flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white">
                <Hand size={14} /> Tap to Reveal
              </div>
            </div>
          </div>

          {/* BACK FACE */}
          <div
            onPointerUp={handleBackClick}
            className="absolute inset-0 bg-zinc-900 rounded-[32px] overflow-hidden border border-white/10"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {/* Color Overlays during swipe with Labels */}
            <motion.div style={{ opacity: successOpacity }} className="absolute inset-0 bg-emerald-500/20 z-20 pointer-events-none flex items-start justify-start p-8">
              <div className="border-4 border-emerald-500 px-4 py-1 rounded-xl -rotate-12">
                <span className="text-emerald-500 text-3xl font-black uppercase tracking-wider">Learned</span>
              </div>
            </motion.div>
            <motion.div style={{ opacity: struggleOpacity }} className="absolute inset-0 bg-rose-500/20 z-20 pointer-events-none flex items-start justify-end p-8">
              <div className="border-4 border-rose-500 px-4 py-1 rounded-xl rotate-12">
                <span className="text-rose-500 text-3xl font-black uppercase tracking-wider">Review</span>
              </div>
            </motion.div>

            {/* Swipe Hint Indicators */}
            <AnimatePresence>
              {showSwipeHint && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute top-8 left-8 z-30 flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center">
                      <ArrowLeft className="text-rose-500" size={24} />
                    </div>
                    <span className="text-rose-500 text-xs font-bold uppercase tracking-wider">Review</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute top-8 right-8 z-30 flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                      <ArrowRight className="text-emerald-500" size={24} />
                    </div>
                    <span className="text-emerald-500 text-xs font-bold uppercase tracking-wider">Learned</span>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <div className="h-[45%] w-full">
              <img src={card.imageUrl} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="h-[55%] p-6 flex flex-col items-center text-center">
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <h2 className="text-5xl font-black text-white tracking-tighter">{card.word}</h2>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-zinc-300">
                  {rawSentence}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}