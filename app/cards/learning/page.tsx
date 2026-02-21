"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'
import Link from 'next/link'
import { Plus, Calendar, GraduationCap, ChevronDown, Image as ImageIcon, BookOpen, Check, Shield } from 'lucide-react'
import { useLanguage } from '../../providers/LanguageProvider'
import AdBanner from '../../components/AdBanner'
import Loading from '../../loading'

// --- Custom Animated SVG Components ---

// 1. MAIN HERO FLAME (New Streak Icon)
const MainAnimatedFlame = ({ size = 20, active = false, className = "" }: { size?: number, active?: boolean, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={`overflow-visible ${className}`}>
    <defs>
      {/* Vibrant inner fill gradient with a subtle animated shift */}
      <linearGradient id="flameFill" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={active ? "#FEF5B8" : "#374151"}>
          {active && <animate attributeName="stop-color" values="#FEF5B8; #FFFBE3; #FEF5B8" dur="3s" repeatCount="indefinite" />}
        </stop>
        <stop offset="100%" stopColor={active ? "#FCEE99" : "#1F2937"}>
          {active && <animate attributeName="stop-color" values="#FCEE99; #F5E16E; #FCEE99" dur="3s" repeatCount="indefinite" />}
        </stop>
      </linearGradient>

      {/* Teal border gradient to give it depth */}
      <linearGradient id="flameStroke" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={active ? "#41DEAB" : "#4B5563"}/>
        <stop offset="100%" stopColor={active ? "#36C497" : "#374151"}/>
      </linearGradient>

      {/* Soft outer glow filter */}
      <filter id="glowBlur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="5" result="blur" />
      </filter>

      <path id="streakPath" d="M 58 25 C 50 35, 36 55, 36 80 C 36 95, 47 102, 60 102 C 73 102, 84 95, 84 80 C 84 65, 82 55, 78 52 C 74 49, 68 56, 65 62 C 62 68, 65 45, 58 25 Z" />
    </defs>

    <style>{`
      .flame-core {
        transform-origin: 60px 95px;
        ${active ? 'animation: streakDance 2.5s ease-in-out infinite alternate;' : ''}
      }
      .glow-layer {
        transform-origin: 60px 95px;
        ${active ? 'animation: streakPulse 2s ease-in-out infinite alternate;' : ''}
        opacity: ${active ? '0.55' : '0.2'};
      }
      @keyframes streakDance {
        0%   { transform: scaleX(1) scaleY(1) skewX(0deg); }
        25%  { transform: scaleX(0.95) scaleY(1.05) skewX(-1.5deg); }
        50%  { transform: scaleX(1.03) scaleY(0.97) skewX(1deg); }
        75%  { transform: scaleX(0.97) scaleY(1.03) skewX(-1deg); }
        100% { transform: scaleX(1) scaleY(1) skewX(0deg); }
      }
      @keyframes streakPulse {
        0%   { transform: scale(0.95); opacity: 0.35; }
        100% { transform: scale(1.08); opacity: 0.75; }
      }
    `}</style>

    {/* Underlying glowing aura */}
    <use href="#streakPath" className="glow-layer" fill="none" stroke={active ? "#41DEAB" : "#4B5563"} strokeWidth="16" filter="url(#glowBlur)" strokeLinejoin="round" />

    {/* Crisp, primary streak icon */}
    <g className="flame-core">
      <use href="#streakPath" fill="url(#flameFill)" stroke="url(#flameStroke)" strokeWidth="12" strokeLinejoin="round" />
    </g>
  </svg>
)


// 2. WEEK DAY PROGRESS CIRCLE
export const WeekDayFlame = ({
  label,
  filled,
  isToday,
  isFrozen,
  className = "",
}: {
  label: string;
  filled: boolean;
  isToday: boolean;
  isFrozen?: boolean;
  className?: string;
}) => {
  return (
    <div className={`relative flex flex-col items-center gap-1.5 ${className}`}>
      {/* Circle Holder */}
      <div 
        className={`relative w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all duration-300 border ${
          filled 
            ? "bg-[#10B981] border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.4)]" 
            : isFrozen 
              ? "bg-[#3B82F6] border-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.3)]"
              : isToday
                ? "bg-[#1C1C1E] border-[2px] border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                : "bg-[#1C1C1E] border-[#2D2D2F]"
        } ${isToday ? "scale-110" : "scale-100"}`}
      >
        {filled ? (
          <Check size={16} className="text-[#000000]" strokeWidth={3} />
        ) : isFrozen ? (
          <Shield size={14} className="text-[#FFFFFF]" fill="currentColor" fillOpacity={0.2} />
        ) : (
          <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-[#3B82F6] shadow-[0_0_8px_#3B82F6]' : 'bg-[#2D2D2F]'}`} />
        )}

        {/* Floating Ring for Today */}
        {isToday && !filled && !isFrozen && (
          <div className="absolute inset-[-4px] rounded-full border border-[#3B82F6]/30 animate-[ping_2s_infinite]" />
        )}
      </div>

      {/* Day Label */}
      <span className={`text-[10px] font-bold uppercase tracking-wider ${
        isToday ? "text-[#FFFFFF]" : filled ? "text-[#10B981]" : isFrozen ? "text-[#3B82F6]" : "text-[#6B7280]"
      }`}>
        {label}
      </span>

      {/* Active Today Pulse removed as it's now a floating ring */}
    </div>
  );
};

// --- Other Icons (Zaps, Sparkles, etc.) ---

const AnimatedZap = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`overflow-visible ${className}`}>
    <defs>
      <filter id={`zapGlow-${size}`}>
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" filter={`url(#zapGlow-${size})`}>
      <animate attributeName="opacity" values="1; 0.6; 1" dur="1.5s" repeatCount="indefinite" />
    </path>
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="1" fill="none">
      <animateTransform attributeName="transform" type="scale" values="1; 1.2; 1" dur="1.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8; 0; 0" dur="1.5s" repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="translate" values="0,0; -2,-2; 0,0" dur="1.5s" repeatCount="indefinite" />
    </path>
  </svg>
)

const AnimatedSparkles = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`overflow-visible ${className}`}>
    <g>
      <animateTransform attributeName="transform" type="rotate" values="0 12 12; 10 12 12; 0 12 12; -10 12 12; 0 12 12" dur="3s" repeatCount="indefinite"/>
      <path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z" fill="currentColor">
        <animateTransform attributeName="transform" type="scale" values="1; 1.1; 1" dur="2s" repeatCount="indefinite" />
      </path>
      <circle cx="19" cy="5" r="2" fill="currentColor">
        <animate attributeName="opacity" values="0; 1; 0" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="r" values="1; 2.5; 1" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="5" cy="19" r="2" fill="currentColor">
        <animate attributeName="opacity" values="0; 1; 0" dur="2s" repeatCount="indefinite" begin="0.5s"/>
        <animate attributeName="r" values="1; 2.5; 1" dur="2s" repeatCount="indefinite" begin="0.5s"/>
      </circle>
    </g>
  </svg>
)



const AnimatedCheck = ({ size = 30, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6L9 17l-5-5" strokeDasharray="24" strokeDashoffset="0">
      <animate attributeName="stroke-dashoffset" values="24;0" dur="0.8s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1" />
    </path>
    <circle cx="12" cy="12" r="14" stroke="currentColor" strokeWidth="2" strokeDasharray="90" strokeDashoffset="0" className="opacity-50">
       <animate attributeName="stroke-dashoffset" values="90;0" dur="1s" fill="freeze" />
    </circle>
  </svg>
)

const AnimatedShield = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`overflow-visible ${className}`}>
    <g>
      <animateTransform attributeName="transform" type="scale" values="1; 1.05; 1" dur="2.5s" repeatCount="indefinite" />
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.2"/>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z">
        <animate attributeName="stroke" values="currentColor; #ffffff; currentColor" dur="2.5s" repeatCount="indefinite" />
      </path>
    </g>
  </svg>
)

const AnimatedCrown = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`overflow-visible ${className}`}>
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,0; 0,-2; 0,0" dur="2s" repeatCount="indefinite" />
      <path d="M2 22H22V20H2V22ZM2 6L7 11L12 2L17 11L22 6V18H2V6Z">
        <animate attributeName="fill" values="currentColor; #fef08a; currentColor" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M-10 0L-5 24H-3L-8 0Z" fill="#ffffff" opacity="0.4">
        <animateTransform attributeName="transform" type="translate" values="0,0; 40,0" dur="3s" repeatCount="indefinite" />
      </path>
    </g>
  </svg>
)

// --- Sub-components ---
function StatCard({ label, value, loading, icon: Icon, colorClass }: any) {
  return (
    <div className="bg-[#1C1C1E] p-3 rounded-[12px] border border-[#2D2D2F] flex flex-col items-center justify-center text-center transition-all relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="flex items-center gap-1.5 mb-1 relative z-10">
        <div className="relative">
          <Icon size={12} className={colorClass} />
          {/* Subtle pulsing glow behind the icon for extra detail */}
          <div className={`absolute inset-0 blur-md rounded-full ${colorClass} opacity-30 animate-pulse`} />
        </div>
        <p className={`text-[11px] font-bold uppercase tracking-wider ${colorClass}`}>
          {label}
        </p>
      </div>
      <p className={`text-[19px] font-bold ${colorClass} relative z-10`}>
        {loading ? <span className="animate-pulse opacity-20">•••</span> : value}
      </p>
    </div>
  )
}

export default function Home() {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isListExpanded, setIsListExpanded] = useState(false)
  const { t, language } = useLanguage()

  useEffect(() => {
    async function fetchDash() {
      if (!user?.id) return
      setLoading(true)
      try {
        const res = await axios.get('/api/cards/dash')
        setData(res.data)
      } catch (e: any) {
        console.error('Unable to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchDash()
  }, [user?.id])

   if (loading && !data) {
    return <Loading />; 
  }

  const total = data?.totalCardsCount || 0
  const due = data?.dueCardsCount || 0
  const streak = data?.streak || 0
  const totalXp = data?.totalXp || 0
  const lastActiveDate = data?.lastActiveDate
  const isPro = data?.isPro || user?.isPro || false
  const isFinished = data && due === 0 && total > 0
  const completionPercentage = isFinished ? 100 : (total > 0 ? ((total - due) / total) * 100 : 0)

  // Streak status: check if user has been active today
  const isActiveToday = lastActiveDate
    ? new Date(lastActiveDate).toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)
    : false

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#121212] text-[#FFFFFF] font-sans antialiased pb-[64px]">
      <div className="max-w-5xl mx-auto px-[6px] pt-[20px] relative">

        {/* HERO SECTION - Card Radius: 14px */}
        <section className={`relative overflow-hidden rounded-[14px] bg-[#1e1e1e] border transition-all duration-1000 p-6 mb-[20px] ${isFinished ? 'border-[#10B981]/40' : 'border-[#2D2D2F]'}`}>

          {/* Animated Background SVG Effect */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[14px]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="heroGlowFx" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={isFinished ? "#10B981" : "#EF4444"} stopOpacity="0.12" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="90%" cy="10%" r="150" fill="url(#heroGlowFx)">
                <animate attributeName="cx" values="90%; 80%; 90%" dur="8s" repeatCount="indefinite" />
                <animate attributeName="cy" values="10%; 30%; 10%" dur="10s" repeatCount="indefinite" />
                <animate attributeName="r" values="150; 200; 150" dur="6s" repeatCount="indefinite" />
              </circle>
              <circle cx="10%" cy="90%" r="100" fill="url(#heroGlowFx)">
                <animate attributeName="cx" values="10%; 20%; 10%" dur="7s" repeatCount="indefinite" />
                <animate attributeName="cy" values="90%; 80%; 90%" dur="9s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left order-2 md:order-1">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 border transition-colors duration-500 ${isFinished ? 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]' : 'bg-[#121212] border-[#2D2D2F] text-[#3B82F6]'
                }`}>
                <AnimatedSparkles size={12} className="text-current" />
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  {isFinished ? t('learning.neuralSynced') : t('learning.dailyObjective')}
                </span>
              </div>

              {/* H1 Typography: 19px, Bold */}
              <h1 className="text-[19px] md:text-[24px] font-bold leading-tight tracking-tight mb-4">
                {isFinished ? (
                  <>{t('learning.everythingIs')} <br className="hidden md:block" /><span className="text-[#10B981]">{t('learning.mastered')}</span></>
                ) : (
                  <>{t('learning.dontLose')} <br className="hidden md:block" /><span className="text-[#EF4444]">{t('learning.momentum')}</span></>
                )}
              </h1>

              {/* Body Medium: 14px, Regular | Color: Secondary Text #9CA3AF */}
              <p className="text-[#9CA3AF] text-[14px] font-normal max-w-md mb-6 leading-relaxed mx-auto md:mx-0">
                {isFinished
                  ? t('learning.queueEmpty')
                  : language === 'ar' ? `لديك ${due} بطاقات تحتاج مراجعة فورية.` : `You have ${due} cards needing immediate attention.`}
              </p>

              <div className="flex flex-row justify-center md:justify-start gap-3">
                {/* Primary Button Style - Radius: 12px */}
                <Link
                  href="/cards/deck"
                  className={`flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-[24px] py-[14px] rounded-[12px] font-bold text-[14px] transition-all active:scale-[0.95] ${isFinished
                      ? "bg-[#374151] text-[#6B7280] cursor-not-allowed"
                      : "bg-[#EF4444] text-[#FFFFFF] shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
                    }`}
                >
                  <AnimatedZap size={16} className="text-current" />
                  <span>{isFinished ? t('learning.finished') : t('learning.start')}</span>
                </Link>
                {/* Secondary/Action Style */}
                <Link
                  href="/cards/new"
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-[#FFFFFF] text-[#000000] px-[24px] py-[14px] rounded-[12px] font-bold text-[14px] transition-all active:scale-[0.95]"
                >
                  <Plus size={16} strokeWidth={3} />
                  <span>{t('learning.new')}</span>
                </Link>
              </div>
            </div>

            {/* PSYCHOPATHIC RING */}
            <div className="relative w-[140px] h-[140px] md:w-[180px] md:h-[180px] flex items-center justify-center order-1 md:order-2">
              {!isFinished && due > 0 && (
                <div className="absolute inset-0 rounded-full bg-[#EF4444]/5 animate-ping" />
              )}

              <svg className="w-full h-full transform -rotate-90 relative z-10 overflow-visible" viewBox="0 0 100 100">
                <defs>
                  <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                
                {/* Decorative rotating dotted inner circle */}
                <circle
                  cx="50" cy="50" r="34"
                  stroke="currentColor" strokeWidth="1"
                  strokeDasharray="4 8"
                  fill="transparent"
                  className={isFinished ? "text-[#10B981]/40" : "text-[#EF4444]/40"}
                >
                  <animateTransform attributeName="transform" type="rotate" values="0 50 50; 360 50 50" dur="12s" repeatCount="indefinite" />
                </circle>

                {/* Background Track Circle */}
                <circle
                  cx="50" cy="50" r="42"
                  stroke="currentColor" strokeWidth="8"
                  fill={isFinished ? "#10B981" : "transparent"}
                  className={`transition-all duration-1000 ${isFinished ? "text-[#10B981]" : "text-[#dd4d4d]"}`}
                />
                
                {/* Progress Circle (The Stroke) */}
                <circle
                  cx="50" cy="50" r="42"
                  stroke="currentColor" strokeWidth="8" fill="transparent"
                  strokeDasharray={2 * Math.PI * 42}
                  style={{
                    strokeDashoffset: loading
                      ? (2 * Math.PI * 42)
                      : (2 * Math.PI * 42) - (completionPercentage / 100) * (2 * Math.PI * 42),
                    transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s'
                  }}
                  strokeLinecap="round"
                  className={isFinished ? "text-[#10B981]" : "text-[#EF4444]"}
                  filter="url(#ringGlow)"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
                {isFinished ? (
                  <AnimatedCheck size={30} className="text-[#000000]" />
                ) : (
                  <>
                    <span className="text-[#EF4444] text-[36px] font-bold tracking-tighter leading-none drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                      {loading ? ".." : due}
                    </span>
                    <span className="text-[#9CA3AF] text-[11px] font-bold uppercase tracking-widest mt-1">
                      {t('learning.due')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* PRO MEMBERSHIP FLAG */}
        {isPro && !loading && (
          <section className="mb-[20px]">
            <div className="relative overflow-hidden rounded-[14px] bg-[#1C1C1E] border border-[#FACC15]/20 p-4">
              <div className="absolute top-[-30px] right-[-30px] w-[100px] h-[100px] blur-[50px] rounded-full bg-[#FACC15]/8 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-3">
                {/* Animated Pro Flag SVG */}
                <div className="w-11 h-11 rounded-[12px] bg-[#FACC15]/10 border border-[#FACC15]/20 flex items-center justify-center flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="overflow-visible">
                    <defs>
                      <linearGradient id="proFlagGrad" x1="8" y1="3" x2="20" y2="14" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#fde047" />
                        <stop offset="50%" stopColor="#facc15" />
                        <stop offset="100%" stopColor="#eab308" />
                      </linearGradient>
                      <filter id="proFlagGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#facc15" floodOpacity="0.5" />
                      </filter>
                    </defs>
                    {/* Flag pole */}
                    <rect x="4" y="2" width="1.8" height="20" rx="0.9" fill="#ca8a04" />
                    {/* Flag body — pennant shape */}
                    <path d="M6 3h13c1 0 1.5 0.8 0.8 1.5L17 8l2.8 3.5c0.7 0.7 0.2 1.5-0.8 1.5H6V3z" fill="url(#proFlagGrad)" filter="url(#proFlagGlow)">
                      <animate attributeName="d" values="M6 3h13c1 0 1.5 0.8 0.8 1.5L17 8l2.8 3.5c0.7 0.7 0.2 1.5-0.8 1.5H6V3z;M6 3h13c1 0 1.5 0.8 0.8 1.5L16.5 8l3.3 3.5c0.7 0.7 0.2 1.5-0.8 1.5H6V3z;M6 3h13c1 0 1.5 0.8 0.8 1.5L17 8l2.8 3.5c0.7 0.7 0.2 1.5-0.8 1.5H6V3z" dur="2s" repeatCount="indefinite" />
                    </path>
                    {/* Star on flag */}
                    <path d="M12 6.2l0.7 1.4 1.6 0.2-1.15 1.1 0.27 1.6L12 9.8l-1.42 0.7 0.27-1.6L9.7 7.8l1.6-0.2z" fill="#fef9c3" opacity="0.85" />
                    {/* Shine streak */}
                    <path d="M8 4.5l2 3" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
                    {/* Pole base dot */}
                    <circle cx="4.9" cy="22" r="1.5" fill="#a16207" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#FACC15]">{t('subscribe.flotterPro')}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20 text-[8px] font-bold text-[#FACC15] uppercase tracking-widest">{t('profile.activeSub')}</span>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{t('learning.tagUnlimited')} · {t('learning.tagNoAds')} · {t('learning.tagStreakFreeze')}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STREAK & XP SECTION */}
        <section className="mb-[20px]">
          <div className={`relative overflow-hidden rounded-[14px] border p-4 transition-all ${streak > 0 ? 'bg-[#1C1C1E] border-[#34D399]/20' : 'bg-[#1C1C1E] border-[#2D2D2F]'
            }`}>
            {streak > 0 && (
              <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] blur-[60px] rounded-full bg-[#34D399]/10 pointer-events-none" />
            )}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center border ${streak > 0 ? 'bg-[#34D399]/10 border-[#34D399]/20' : 'bg-[#222222] border-[#2D2D2F]'
                  }`}>
                  <MainAnimatedFlame size={32} active={streak > 0} className={streak > 0 ? "text-[#34D399]" : "text-[#6B7280]"} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[19px] font-bold ${streak > 0 ? 'text-[#34D399]' : 'text-[#6B7280]'}`}>
                      {loading ? '...' : streak}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                      {t('learning.dayStreak')}
                    </span>
                    {isPro && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20">
                        <AnimatedShield size={8} className="text-[#FACC15]" />
                        <span className="text-[8px] font-bold text-[#FACC15] uppercase tracking-widest">{t('learning.frozen')}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">
                    {isActiveToday
                      ? `✓ ${t('learning.activeToday')}`
                      : streak > 0
                        ? t('learning.earnXp')
                        : t('learning.startLearning')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-[#222222] border border-[#2D2D2F] px-3 py-1.5 rounded-[12px]">
                <AnimatedZap size={12} className="text-[#FACC15]" />
                <span className="text-[12px] font-bold text-[#FACC15]">{loading ? '...' : totalXp}</span>
                <span className="text-[10px] text-[#6B7280] font-bold uppercase">XP</span>
              </div>
            </div>

            {/* Streak progress - UPDATED WITH FLAME SHAPES CONTAINING LETTERS */}
            {streak > 0 && (
              <div className="mt-4 pt-4 border-t border-[#262626] flex items-center justify-between px-2">
                {(() => {
                  const weekLabels = language === 'ar' 
                    ? ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'أ'] 
                    : ['M', 'T', 'W', 'T', 'F', 'S', 'S']
                  const todayIndex = (new Date().getDay() + 6) % 7

                  return weekLabels.map((label, i) => {
                    const isToday = i === todayIndex;
                    const distance = todayIndex - i;

                    let filled = false;
                    let isFrozen = false;

                    if (isToday) {
                      filled = isActiveToday;
                    } else if (distance > 0) {
                      // Check day status relative to streak and last activity
                      const dayDate = new Date();
                      dayDate.setDate(dayDate.getDate() - distance);
                      const dayStr = dayDate.toISOString().slice(0, 10);
                      const lastActiveStr = lastActiveDate ? new Date(lastActiveDate).toISOString().slice(0, 10) : "";

                      if (dayStr === lastActiveStr) {
                        filled = true;
                      } else if (dayStr < lastActiveStr) {
                        // Part of streak before last activity
                        filled = streak > distance;
                      } else if (isPro && streak > 0) {
                        // Days between last active and today are frozen if Pro
                        isFrozen = true;
                      }
                    }

                    return (
                      <div key={i} className="flex flex-col items-center">
                        <WeekDayFlame 
                          label={label}
                          filled={filled}
                          isToday={isToday}
                          isFrozen={isFrozen}
                          className="transition-transform active:scale-95"
                        />
                      </div>
                    )
                  })
                })()}
              </div>
            )}
          </div>
        </section>

        {/* STREAK FREEZE UPSELL FOR FREE USERS */}
        {!isPro && !loading && streak > 0 && (
          <section className="mb-[20px]">
            <div className="relative overflow-hidden rounded-[14px] bg-[#1C1C1E] border border-[#FACC15]/20 p-4">
              <div className="absolute top-[-30px] right-[-30px] w-[100px] h-[100px] blur-[50px] rounded-full bg-[#FACC15]/10 pointer-events-none" />
              <div className="relative z-10 flex items-start gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-[#FACC15]/10 border border-[#FACC15]/20 flex items-center justify-center flex-shrink-0">
                  <AnimatedShield size={18} className="text-[#FACC15]" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-[#FFFFFF] mb-1">{t('learning.protectStreak')}{streak}{t('learning.dayStreakBang')}</p>
                  <p className="text-[11px] text-[#9CA3AF] leading-relaxed mb-2">
                    {t('learning.streakUpsellDesc')}
                  </p>
                  <Link
                    href="/subscribe"
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#FACC15] active:opacity-70 transition-opacity"
                  >
                    <AnimatedCrown size={10} className="text-current" />
                    {t('learning.getStreakProtection')}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SUBSCRIBE BANNER FOR FREE USERS */}
        {!isPro && !loading && (
          <section className="mb-[20px]">
            <div className="relative overflow-hidden rounded-[14px] border border-[#FACC15]/30 bg-gradient-to-br from-[#1C1C1E] to-[#1a1a0f] p-5">
              <div className="absolute top-[-40px] right-[-40px] w-[160px] h-[160px] blur-[80px] rounded-full bg-[#FACC15]/10 pointer-events-none" />
              <div className="absolute bottom-[-20px] left-[-20px] w-[80px] h-[80px] blur-[40px] rounded-full bg-[#FACC15]/5 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <AnimatedCrown size={14} className="text-[#FACC15]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#FACC15]">Flotter Pro</span>
                </div>
                
                <h3 className="text-[17px] font-bold text-[#FFFFFF] mb-1">
                  {t('learning.unlockPotential')}
                </h3>
                <p className="text-[12px] text-[#9CA3AF] leading-relaxed mb-4">
                  {t('learning.bannerDesc1')}<span className="text-[#FACC15] font-bold">{t('subscribe.heroPrice')}</span>{t('learning.bannerDesc2')}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {[t('learning.tagUnlimited'), t('learning.tagNoAds'), t('learning.tagStreakFreeze'), t('learning.tagProBadge')].map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20 text-[9px] font-bold uppercase tracking-widest text-[#FACC15]">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <Link
                  href="/subscribe"
                  className="inline-flex items-center gap-2 bg-[#FACC15] text-[#000000] px-5 py-3 rounded-[10px] font-bold text-[12px] transition-all active:scale-95 shadow-[0_8px_24px_rgba(250,204,21,0.15)]"
                >
                  <AnimatedZap size={14} className="text-[#000000]" />
                  {t('learning.subscribeBtn')}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* AD BANNER FOR FREE USERS */}
        {!isPro && !loading && (
          <section className="mb-[20px]">
            <AdBanner dataAdClient="ca-pub-XXXXXXXXXXXXXXXX" dataAdSlot="XXXXXXXXXX" />
          </section>
        )}

        {/* OVERVIEW SECTION - Section Gap: 20px */}
        <section className="mb-[20px]">
          <div className="grid grid-cols-3 gap-[8px]">
            <StatCard
              label={t('learning.review')}
              icon={Calendar}
              value={due}
              loading={loading}
              colorClass={due > 0 ? "text-[#EF4444]" : "text-[#9CA3AF]"}
            />
            <StatCard
              label={t('learning.learning')}
              icon={BookOpen}
              value={Math.max(0, (total) - (data?.learnedCardsCount || 0) - due)}
              loading={loading}
              colorClass="text-[#EAB308]" // Premium Gold
            />
            <StatCard
              label={t('learning.mastered2')}
              icon={GraduationCap}
              value={data?.learnedCardsCount || 0}
              loading={loading}
              colorClass="text-[#3B82F6]" // Primary Blue
            />
          </div>
        </section>
        

        {/* RECENT ACTIVITY - List Item / Settings Row Implementation */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">{t('learning.activity')}</h2>
            <button
              onClick={() => setIsListExpanded(!isListExpanded)}
              className="text-[11px] font-bold uppercase tracking-widest text-[#10B981] active:opacity-70 transition-colors flex items-center gap-1.5"
            >
              {isListExpanded ? t('learning.hideAll') : t('learning.viewAll')}
              <ChevronDown size={14} className={`transition-transform duration-300 ${isListExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className={`bg-[#121212] border border-[#2D2D2F] rounded-[14px] overflow-hidden transition-all duration-500 ${isListExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <div className="w-full">
              {!loading && data?.cards?.map((c: any) => {
                const isOpen = expandedId === c.id;
                return (
                  <div key={c.id} className="border-b border-[#262626] last:border-0">
                    <div
                      onClick={() => setExpandedId(isOpen ? null : c.id)}
                      className={`flex items-center justify-between px-4 h-[56px] cursor-pointer transition-all active:bg-[#222222] ${isOpen ? 'bg-[#222222]' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon Container Rounded 8px per spec */}
                        <div className="w-10 h-10 rounded-[8px] bg-[#121212] overflow-hidden flex-shrink-0 flex items-center justify-center border border-[#2D2D2F]">
                          {c.imageUrl ? (
                            <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={16} className="text-[#6B7280]" />
                          )}
                        </div>
                        <div className="max-w-[180px] md:max-w-none">
                          <p className="text-[15px] font-semibold text-[#FFFFFF] truncate">{c.sentences[0] || "Untitled"}</p>
                          <p className="text-[12px] text-[#9CA3AF]">{t('learning.next')} {new Date(c.nextReviewAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'text-[#3B82F6]' : 'text-[#6B7280]'}`}>
                        <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    {isOpen && (
                      <div className="px-4 py-6 bg-[#222222]/50 animate-in slide-in-from-top-1 duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div className="md:col-span-4 aspect-video rounded-[12px] overflow-hidden border border-[#2D2D2F] bg-[#121212]">
                            {c.imageUrl ? <img src={c.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#6B7280] text-[11px] font-bold uppercase">{t('learning.noVisual')}</div>}
                          </div>
                          <div className="md:col-span-8">
                            <p className="text-[11px] font-bold text-[#10B981] uppercase tracking-widest mb-3">{t('learning.contextVariations')}</p>
                            <div className="space-y-2">
                              {c.sentences.map((s: string, i: number) => (
                                <div key={i} className="p-3 rounded-[12px] bg-[#1C1C1E] border border-[#2D2D2F]">
                                  <p className="text-[14px] text-[#FFFFFF] leading-snug">{s}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {!isListExpanded && (
            <div className="mt-2 text-center">
              {/* Caption Typography: 12px, Medium */}
              <p className="text-[12px] text-[#6B7280] font-medium uppercase tracking-widest">{t('learning.listHidden')}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}