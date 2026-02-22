'use client'

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Crown, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '../../../providers/LanguageProvider'

// ────────────────────────────────────────────────────
// Animated Celebration Flame (Learning-page style, enhanced)
// ────────────────────────────────────────────────────
const CelebrationFlame = () => (
  <motion.div
    initial={{ scale: 0, rotate: -15 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: 'spring', damping: 10, stiffness: 140, delay: 0.1 }}
  >
    <svg width={76} height={76} viewBox="0 0 120 120" fill="none" className="overflow-visible">
      <defs>
        <linearGradient id="celebFlameFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF5B8">
            <animate attributeName="stop-color" values="#FEF5B8;#FFFBE3;#FEF5B8" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#FCEE99">
            <animate attributeName="stop-color" values="#FCEE99;#F5E16E;#FCEE99" dur="2s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        <linearGradient id="celebFlameStroke" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
        <filter id="celebGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
        </filter>
        <path id="celebPath" d="M 58 25 C 50 35, 36 55, 36 80 C 36 95, 47 102, 60 102 C 73 102, 84 95, 84 80 C 84 65, 82 55, 78 52 C 74 49, 68 56, 65 62 C 62 68, 65 45, 58 25 Z" />
      </defs>
      <style>{`
        .celeb-core{transform-origin:60px 95px;animation:celebDance 1.5s ease-in-out infinite alternate}
        .celeb-glow-layer{transform-origin:60px 95px;animation:celebPulse 1.5s ease-in-out infinite alternate}
        @keyframes celebDance{
          0%{transform:scaleX(1) scaleY(1) skewX(0deg)}
          25%{transform:scaleX(.93) scaleY(1.08) skewX(-2deg)}
          50%{transform:scaleX(1.05) scaleY(.95) skewX(1.5deg)}
          75%{transform:scaleX(.95) scaleY(1.05) skewX(-1.5deg)}
          100%{transform:scaleX(1) scaleY(1) skewX(0deg)}
        }
        @keyframes celebPulse{
          0%{transform:scale(.9);opacity:.4}
          100%{transform:scale(1.15);opacity:.8}
        }
      `}</style>

      {/* Outer glow aura */}
      <use href="#celebPath" className="celeb-glow-layer" fill="none" stroke="#F97316" strokeWidth="20" filter="url(#celebGlow)" strokeLinejoin="round" />
      {/* Core flame */}
      <g className="celeb-core">
        <use href="#celebPath" fill="url(#celebFlameFill)" stroke="url(#celebFlameStroke)" strokeWidth="10" strokeLinejoin="round" />
      </g>
    </svg>
  </motion.div>
)

// ────────────────────────────────────────────────────
// Animated Day Circle (fills from empty to checked)
// ────────────────────────────────────────────────────
function AnimatedDayCircle({
  label,
  filled,
  isToday,
  animateToFilled,
  isFrozen = false,
  delay = 0,
}: {
  label: string
  filled: boolean
  isToday: boolean
  animateToFilled: boolean
  isFrozen?: boolean
  delay?: number
}) {
  const showFilled = filled || (isToday && animateToFilled)

  return (
    <motion.div
      className="flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <div className="relative">
        {/* Static circle base - optimized for tight mobile views */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center border-[1.5px] transition-colors duration-300 ${
            filled
              ? 'bg-[#10B981] border-[#10B981] shadow-[0_2px_10px_rgba(16,185,129,0.3)]'
              : isFrozen
              ? 'bg-[#3B82F6]/10 border-[#3B82F6]/50 shadow-[0_2px_10px_rgba(59,130,246,0.15)]'
              : isToday
              ? 'bg-[#1C1C1E] border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.15)]'
              : 'bg-[#1C1C1E] border-[#2D2D2F]'
          } ${isToday ? 'scale-[1.15]' : ''}`}
        >
          {/* Animated green fill for today */}
          {isToday && animateToFilled && (
            <motion.div
              className="absolute inset-0 rounded-full bg-[#10B981] shadow-[0_0_16px_rgba(16,185,129,0.4)]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: delay + 0.3,
                duration: 0.5,
                type: 'spring',
                damping: 14,
                stiffness: 160,
              }}
            />
          )}

          {/* Content */}
          <div className="relative z-10">
            {showFilled ? (
              <motion.div
                initial={isToday ? { scale: 0, rotate: -90 } : { scale: 1 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: isToday ? delay + 0.5 : delay + 0.1,
                  type: 'spring',
                  damping: 12,
                }}
              >
                <Check size={14} className="text-black" strokeWidth={3.5} />
              </motion.div>
            ) : isFrozen ? (
              <Shield size={12} className="text-[#3B82F6]" fill="currentColor" fillOpacity={0.2} />
            ) : (
              <div className={`w-1 h-1 rounded-full ${isToday ? 'bg-[#10B981]' : 'bg-[#3A3A3C]'}`} />
            )}
          </div>
        </div>

        {/* Ripple rings for today */}
        {isToday && animateToFilled && (
          <>
            <motion.div
              className="absolute inset-[-4px] rounded-full border-2 border-[#10B981]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ delay: delay + 0.6, duration: 1.2, repeat: Infinity, repeatDelay: 0.6 }}
            />
            <motion.div
              className="absolute inset-[-4px] rounded-full border border-[#10B981]/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.7, opacity: 0 }}
              transition={{ delay: delay + 0.8, duration: 1.2, repeat: Infinity, repeatDelay: 0.6 }}
            />
          </>
        )}
      </div>

      <motion.span
        className={`text-[9px] font-bold uppercase tracking-widest ${
          isToday || filled ? 'text-[#10B981]' : isFrozen ? 'text-[#3B82F6]' : 'text-[#6B7280]'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.1 }}
      >
        {label}
      </motion.span>
    </motion.div>
  )
}

// ────────────────────────────────────────────────────
// Confetti Piece
// ────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#10B981', '#FACC15', '#3B82F6', '#EF4444', '#8B5CF6', '#F97316', '#EC4899']

function ConfettiPiece({ x, y, color, size, rotation, delay }: {
  x: number; y: number; color: string; size: number; rotation: number; delay: number
}) {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-sm"
      style={{
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        left: '50%',
        top: '35%',
      }}
      initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0 }}
      animate={{
        x,
        y,
        opacity: [0, 1, 1, 0],
        rotate: rotation,
        scale: [0, 1.3, 1, 0.5],
      }}
      transition={{
        duration: 2.8,
        delay,
        ease: [0.36, 0.07, 0.19, 0.97],
      }}
    />
  )
}

// ────────────────────────────────────────────────────
// Main Streak Celebration Component
// ────────────────────────────────────────────────────
interface StreakCelebrationProps {
  visible: boolean
  onDismiss: () => void
  streak: number
  swipeCount: number
  sessionXp: number
  isPro: boolean
}

export default function StreakCelebration({
  visible,
  onDismiss,
  streak,
  swipeCount,
  sessionXp,
  isPro,
}: StreakCelebrationProps) {
  const router = useRouter()
  const { t, language } = useLanguage()
  const isArabic = language === 'ar'

  // Stable random confetti (only generated once)
  const confetti = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 360,
        y: -(Math.random() * 120 + 40) + Math.random() * 140,
        rotation: Math.random() * 720 - 360,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: Math.random() * 7 + 4,
        delay: Math.random() * 0.4 + 0.15,
      })),
    []
  )

  // The streak just incremented (user earned it this session)
  const newStreak = streak + 1

  // Week labels & today index (Mon–Sun)
  const weekLabels =
    isArabic
      ? ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'أ']
      : ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const todayIndex = (new Date().getDay() + 6) % 7

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="streak-celebration"
          className="fixed inset-0 z-[300] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
          />

          {/* Card - Styled to match the modern upsell structure */}
          <motion.div
            dir={isArabic ? 'rtl' : 'ltr'}
            className="relative max-w-[340px] w-full bg-[#1C1C1E] border border-[#2D2D2F] rounded-[24px] overflow-hidden pt-8 pb-5 px-5 text-center"
            initial={{ scale: 0.96, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 20, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Animated shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(105deg, transparent 40%, rgba(16,185,129,0.05) 50%, transparent 60%)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPositionX: ['200%', '-200%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
            />

            {/* Glow orbs */}
            <div className="absolute top-[-50px] right-[-50px] w-[140px] h-[140px] blur-[70px] rounded-full bg-[#10B981]/15 pointer-events-none" />
            <div className="absolute bottom-[-40px] left-[-40px] w-[120px] h-[120px] blur-[60px] rounded-full bg-[#FACC15]/10 pointer-events-none" />

            {/* Confetti */}
            {confetti.map((p) => (
              <ConfettiPiece key={p.id} {...p} />
            ))}

            <div className="relative z-10 flex flex-col items-center">
              {/* Flame */}
              <div className="flex justify-center mb-1">
                <CelebrationFlame />
              </div>

              {/* Streak Number */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.3 }}
                className="mb-1"
              >
                <span className="text-[48px] font-black text-[#10B981] tabular-nums leading-none tracking-tight drop-shadow-md">
                  {newStreak}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h3
                className="text-[18px] font-bold text-white mb-1.5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {t('deck.streakAlive')}
              </motion.h3>

              {/* Subtitle */}
              <motion.p
                className="text-[12px] leading-relaxed text-[#9CA3AF] mb-6 px-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                {t('deck.sessionSummary1')}
                <span className="text-white font-bold">{swipeCount}</span>
                {t('deck.sessionSummary2')}
                <span className="text-[#FACC15] font-bold">+{sessionXp} XP</span>
                {t('deck.sessionSummary3')}
              </motion.p>

              {/* Week Progress Bar - Optimized for tight mobile spaces */}
              <motion.div
                className="flex items-center justify-between w-full px-2 py-3.5 mb-6 bg-[#151517] rounded-[18px] border border-[#2D2D2F]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {weekLabels.map((label, i) => {
                  const isToday = i === todayIndex
                  const distance = todayIndex - i

                  let filled = false
                  let isFrozen = false

                  if (!isToday && distance > 0) {
                    if (distance < newStreak) {
                      filled = true
                    } else if (isPro && streak > 0) {
                      isFrozen = true
                    }
                  }

                  return (
                    <AnimatedDayCircle
                      key={i}
                      label={label}
                      filled={filled}
                      isToday={isToday}
                      animateToFilled={isToday}
                      isFrozen={isFrozen}
                      delay={0.55 + i * 0.06}
                    />
                  )
                })}
              </motion.div>

              {/* Pro hint for free users */}
              {!isPro && (
                <motion.p
                  className="text-[10px] font-bold uppercase tracking-widest text-[#FACC15] mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  {t('deck.proStreakHint')}
                </motion.p>
              )}

              {/* Buttons */}
              <motion.div
                className="flex flex-col gap-2 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <button
                  onClick={() => {
                    onDismiss()
                    router.push('/cards/learning')
                  }}
                  className="w-full bg-[#10B981] text-black py-3.5 rounded-[14px] font-bold text-[13px] transition-all active:scale-[0.97]"
                >
                  {t('deck.backToDashboard')}
                </button>
                <button
                  onClick={onDismiss}
                  className="w-full py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-widest hover:text-white transition-colors"
                >
                  {t('deck.continueLearning')}
                </button>
                {!isPro && (
                  <Link
                    href="/subscribe"
                    onClick={onDismiss}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#FACC15]/10 border border-[#FACC15]/20 text-[#FACC15] py-3.5 rounded-[14px] font-bold text-[13px] transition-all active:scale-[0.97]"
                  >
                    <Crown size={14} fill="currentColor" />
                    {t('deck.protectStreak')}
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}