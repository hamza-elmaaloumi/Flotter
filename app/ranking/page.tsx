"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '../providers/UserProvider'
import { useLanguage } from '../providers/LanguageProvider'
import { useTheme } from '../providers/ThemeProvider'
import Link from 'next/link'
import { Trophy, Flame, ChevronLeft, Loader2, Zap, Crown } from 'lucide-react'

// ——— Custom Streak SVG ———
const RedAnimatedFlame = ({ size = 20, active = false, className = "" }: { size?: number, active?: boolean, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={`overflow-visible ${className}`}>
    <defs>
      {/* Outer Flame Gradient - Deep reds to base #EF4444 */}
      <linearGradient id="flameOuterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={active ? "#EF4444" : "#4B5563"}>
          {active && <animate attributeName="stop-color" values="#EF4444; #F87171; #EF4444" dur="2s" repeatCount="indefinite" />}
        </stop>
        <stop offset="100%" stopColor={active ? "#991B1B" : "#1F2937"}>
          {active && <animate attributeName="stop-color" values="#991B1B; #B91C1C; #991B1B" dur="2s" repeatCount="indefinite" />}
        </stop>
      </linearGradient>

      {/* Inner Flame Gradient - White-hot red core for realistic heat depth */}
      <linearGradient id="flameInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={active ? "#FEE2E2" : "#D1D5DB"}>
          {active && <animate attributeName="stop-color" values="#FEE2E2; #FECACA; #FEE2E2" dur="1.5s" repeatCount="indefinite" />}
        </stop>
        <stop offset="100%" stopColor={active ? "#EF4444" : "#4B5563"}>
          {active && <animate attributeName="stop-color" values="#EF4444; #DC2626; #EF4444" dur="1.5s" repeatCount="indefinite" />}
        </stop>
      </linearGradient>

      {/* Ambient Glow Filters */}
      <filter id="glowAmbientRed" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={active ? "12" : "4"} result="blur" />
      </filter>

      <filter id="glowCoreRed" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur" />
      </filter>

      {/* Base Flame Shape */}
      <path id="streakPathRed" d="M 58 25 C 50 35, 36 55, 36 80 C 36 95, 47 102, 60 102 C 73 102, 84 95, 84 80 C 84 65, 82 55, 78 52 C 74 49, 68 56, 65 62 C 62 68, 65 45, 58 25 Z" />
    </defs>

    <style>{`
      .flame-base-red {
        transform-origin: 60px 95px;
      }
      .glow-layer-red {
        ${active ? 'animation: pulseAmbientRed 2s ease-in-out infinite;' : 'opacity: 0.1;'}
      }
      .flame-outer-red {
        ${active ? 'animation: flickerOuterRed 2s ease-in-out infinite;' : ''}
      }
      .flame-inner-red {
        transform: scale(0.55);
        ${active ? 'animation: flickerInnerRed 1.7s ease-in-out infinite;' : ''}
      }

      /* Parallax dancing: Outer and Inner layers move at slightly different speeds/angles */
      @keyframes flickerOuterRed {
        0%   { transform: scaleX(1) scaleY(1) skewX(0deg); }
        20%  { transform: scaleX(0.95) scaleY(1.05) skewX(-2deg); }
        40%  { transform: scaleX(1.02) scaleY(0.98) skewX(2deg); }
        60%  { transform: scaleX(0.98) scaleY(1.02) skewX(-1deg); }
        80%  { transform: scaleX(1.04) scaleY(0.96) skewX(1deg); }
        100% { transform: scaleX(1) scaleY(1) skewX(0deg); }
      }
      
      @keyframes flickerInnerRed {
        0%   { transform: scale(0.55) skewX(0deg); }
        25%  { transform: scaleX(0.50) scaleY(0.60) skewX(3deg); }
        50%  { transform: scaleX(0.60) scaleY(0.50) skewX(-2deg); }
        75%  { transform: scaleX(0.52) scaleY(0.58) skewX(1deg); }
        100% { transform: scale(0.55) skewX(0deg); }
      }

      @keyframes pulseAmbientRed {
        0%   { opacity: 0.35; transform: scale(0.95); }
        50%  { opacity: 0.65; transform: scale(1.08); }
        100% { opacity: 0.35; transform: scale(0.95); }
      }
    `}</style>

    {/* 1. Large Ambient Red Back-Glow */}
    <use 
      href="#streakPathRed" 
      className="flame-base-red glow-layer-red" 
      fill="none" 
      stroke={active ? "#EF4444" : "#4B5563"} 
      strokeWidth="16" 
      filter="url(#glowAmbientRed)" 
      strokeLinejoin="round" 
    />

    {/* 2. Primary Outer Flame Body */}
    <use 
      href="#streakPathRed" 
      className="flame-base-red flame-outer-red" 
      fill="url(#flameOuterGrad)" 
      stroke="url(#flameOuterGrad)" 
      strokeWidth="4" 
      strokeLinejoin="round" 
    />

    {/* 3. Bright Inner Flame Core (Creates the 3D realistic hollow heat effect) */}
    <use 
      href="#streakPathRed" 
      className="flame-base-red flame-inner-red" 
      fill="url(#flameInnerGrad)" 
      filter="url(#glowCoreRed)"
    />
  </svg>
)

// ——— Custom Rank SVG Icons ———

// #1 — Gold Trophy (distinct from the Crown/Pro icon)
const GoldTrophy = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="overflow-visible">
    <defs>
      <linearGradient id="goldTrophyBody" x1="12" y1="3" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="50%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
      <filter id="goldTrophyGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#facc15" floodOpacity="0.6" />
      </filter>
    </defs>
    {/* Cup */}
    <path d="M7 4h10v6c0 2.76-2.24 5-5 5s-5-2.24-5-5V4z" fill="url(#goldTrophyBody)" filter="url(#goldTrophyGlow)" />
    {/* Left handle */}
    <path d="M7 6H5a2 2 0 0 0-2 2v1a3 3 0 0 0 3 3h1" stroke="#eab308" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Right handle */}
    <path d="M17 6h2a2 2 0 0 1 2 2v1a3 3 0 0 1-3 3h-1" stroke="#eab308" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Stem */}
    <rect x="10.5" y="15" width="3" height="3" rx="0.5" fill="#ca8a04" />
    {/* Base */}
    <rect x="8" y="18" width="8" height="2" rx="1" fill="#ca8a04" />
    {/* Star engraving */}
    <path d="M12 6.5l0.9 1.8 2 0.3-1.45 1.4 0.35 2-1.8-0.95-1.8 0.95 0.35-2-1.45-1.4 2-0.3z" fill="#fef9c3" opacity="0.7" />
    {/* Shine */}
    <path d="M9 5.5l1 2.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
  </svg>
)

// #2 — Silver Medal
const SilverMedal = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="overflow-visible">
    <defs>
      <linearGradient id="silverMedalGrad" x1="12" y1="6" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#e5e7eb" />
        <stop offset="50%" stopColor="#9ca3af" />
        <stop offset="100%" stopColor="#6b7280" />
      </linearGradient>
      <filter id="silverGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#9ca3af" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Ribbon left */}
    <path d="M8 2l-2 7h3l1-5z" fill="#3b82f6" opacity="0.8" />
    {/* Ribbon right */}
    <path d="M16 2l2 7h-3l-1-5z" fill="#3b82f6" opacity="0.8" />
    {/* Medal circle */}
    <circle cx="12" cy="15" r="7" fill="url(#silverMedalGrad)" filter="url(#silverGlow)" />
    {/* Inner ring */}
    <circle cx="12" cy="15" r="5" fill="none" stroke="#d1d5db" strokeWidth="0.8" />
    {/* Number 2 */}
    <text x="12" y="17.5" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#374151" fontFamily="system-ui">2</text>
    {/* Shine */}
    <path d="M9 11.5c1-1.5 3-2 5-1" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.5" fill="none" />
  </svg>
)

// #3 — Bronze Medal
const BronzeMedal = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="overflow-visible">
    <defs>
      <linearGradient id="bronzeMedalGrad" x1="12" y1="6" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <filter id="bronzeGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#b45309" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Ribbon left */}
    <path d="M8 2l-2 7h3l1-5z" fill="#ef4444" opacity="0.7" />
    {/* Ribbon right */}
    <path d="M16 2l2 7h-3l-1-5z" fill="#ef4444" opacity="0.7" />
    {/* Medal circle */}
    <circle cx="12" cy="15" r="7" fill="url(#bronzeMedalGrad)" filter="url(#bronzeGlow)" />
    {/* Inner ring */}
    <circle cx="12" cy="15" r="5" fill="none" stroke="#d97706" strokeWidth="0.8" />
    {/* Number 3 */}
    <text x="12" y="17.5" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#451a03" fontFamily="system-ui">3</text>
    {/* Shine */}
    <path d="M9 11.5c1-1.5 3-2 5-1" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.5" fill="none" />
  </svg>
)

interface RankedUser {
  rank: number
  id: string
  name: string
  image: string | null
  totalXp: number
  monthlyXp: number
  streakCount: number
  isPro: boolean
}

function getRankIcon(rank: number) {
  if (rank === 1) return <GoldTrophy size={18} />
  if (rank === 2) return <SilverMedal size={18} />
  if (rank === 3) return <BronzeMedal size={18} />
  return <span className="text-[12px] font-bold text-[#6B7280]">#{rank}</span>
}

export default function RankingPage() {
  const { user } = useUser()
  const { t, language } = useLanguage()
  const { isDark } = useTheme()
  const [ranking, setRanking] = useState<RankedUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRanking() {
      try {
        const res = await axios.get('/api/ranking')
        setRanking(res.data.ranking || [])
      } catch (err) {
        console.error('Failed to load ranking')
      } finally {
        setLoading(false)
      }
    }
    fetchRanking()
  }, [])

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen antialiased pb-[64px] ${isDark ? 'bg-[#121212] text-[#FFFFFF]' : 'bg-[#F8F9FA] text-[#111827]'}`}>
      {/* Header */}
      <header dir="ltr" className={`sticky top-0 z-20 border-b px-4 h-[64px] flex items-center justify-between ${isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-[#E2E4E9]'}`}>
        <div className="flex items-center gap-2">
          <Link href="/cards/learning" className={`p-1 transition-colors ${isDark ? 'text-[#9CA3AF] hover:text-[#FFFFFF]' : 'text-[#6B7280] hover:text-[#111827]'}`}>
            <ChevronLeft size={24} />
          </Link>
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-[#9CA3AF]" />
            <h1 className="text-[17px] font-bold tracking-[-0.5px]">{t('ranking.title')}</h1>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-[12px] border ${isDark ? 'bg-[#222222] border-[#2D2D2F]' : 'bg-[#F0F1F3] border-[#E2E4E9]'}`}>
          <span className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>{t('ranking.thisMonth')}</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#3B82F6] mb-4" />
            <span className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">{t('ranking.loading')}</span>
          </div>
        ) : ranking.length === 0 ? (
          <div className="text-center py-20">
            <Trophy size={32} className="text-[#6B7280] mx-auto mb-4 opacity-30" />
            <p className="text-[#6B7280] text-[14px]">{t('ranking.empty')}</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {ranking.length >= 3 && (
              <section className="grid grid-cols-3 gap-2 mb-6">
                {[ranking[1], ranking[0], ranking[2]].map((u, podiumIndex) => {
                  const isFirst = podiumIndex === 1
                  const isMe = u.id === user?.id
                  return (
                    <div
                      key={u.id}
                      className={`flex flex-col items-center p-4 rounded-[14px] border transition-all ${
                        isFirst
                          ? `${isDark ? 'bg-[#1C1C1E]' : 'bg-white'} border-[#FACC15]/30 shadow-[0_0_30px_rgba(250,204,21,0.05)]`
                          : `${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`
                      } ${isMe ? 'ring-1 ring-[#3B82F6]/50' : ''} ${isFirst ? 'order-2' : podiumIndex === 0 ? 'order-1' : 'order-3'}`}
                    >
                      <div className={`w-12 h-12 rounded-[12px] overflow-hidden border-2 mb-2 flex items-center justify-center ${
                        isFirst ? `${isDark ? 'bg-[#222222]' : 'bg-[#F0F1F3]'} border-[#FACC15]` : `${isDark ? 'bg-[#222222] border-[#2D2D2F]' : 'bg-[#F0F1F3] border-[#E2E4E9]'}`
                      }`}>
                        {u.image ? (
                          <img src={u.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[16px] font-bold text-[#6B7280]">
                            {u.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="mb-1">{getRankIcon(u.rank)}</div>
                      <p className={`text-[12px] font-bold truncate max-w-full ${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}`}>
                        {u.name}
                        {u.isPro && (
                          <span className="inline-flex items-center ml-1 px-1.5 py-0.5 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20 align-middle">
                            <Crown size={8} className="text-[#FACC15]" fill="currentColor" />
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Zap size={10} className="text-[#FACC15]" fill="currentColor" />
                        <span className="text-[11px] font-bold text-[#FACC15]">{u.monthlyXp}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <RedAnimatedFlame size={14} active={u.streakCount > 0} />
                        <span className={`text-[10px] font-bold ${u.streakCount > 0 ? 'text-[#EF4444]' : 'text-[#6B7280]'}`}>{u.streakCount}d</span>
                      </div>
                    </div>
                  )
                })}
              </section>
            )}

            {/* Full List */}
            <div className={`border rounded-[14px] overflow-hidden ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}>
              {ranking.map((u) => {
                const isMe = u.id === user?.id
                return (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between px-4 h-[60px] border-b last:border-0 transition-all ${isDark ? 'border-[#262626]' : 'border-[#EBEDF0]'} ${
                      isMe ? 'bg-[#3B82F6]/5' : isDark ? 'hover:bg-[#222222]' : 'hover:bg-[#F0F1F3]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 flex items-center justify-center">
                        {getRankIcon(u.rank)}
                      </div>
                      <div className={`w-9 h-9 rounded-[10px] overflow-hidden border flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-[#222222] border-[#2D2D2F]' : 'bg-[#F0F1F3] border-[#E2E4E9]'}`}>
                        {u.image ? (
                          <img src={u.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[13px] font-bold text-[#6B7280]">
                            {u.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className={`text-[14px] font-semibold ${isMe ? 'text-[#3B82F6]' : isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}`}>
                          {u.name} {isMe && <span className="text-[10px] text-[#3B82F6] opacity-60">{t('ranking.you')}</span>}
                          {u.isPro && (
                            <span className="inline-flex items-center ml-1 px-1.5 py-0.5 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20 align-middle">
                              <Crown size={8} className="text-[#FACC15]" fill="currentColor" />
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-[#6B7280]">
                          {t('ranking.total')} {u.totalXp.toLocaleString()} XP
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <RedAnimatedFlame size={18} active={u.streakCount > 0} />
                        <span className={`text-[11px] font-bold ${u.streakCount > 0 ? 'text-[#EF4444]' : 'text-[#6B7280]'}`}>{u.streakCount}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-[10px] flex items-center gap-1 border ${isDark ? 'bg-[#222222] border-[#2D2D2F]' : 'bg-[#F0F1F3] border-[#E2E4E9]'}`}>
                        <Zap size={11} className="text-[#FACC15]" fill="currentColor" />
                        <span className="text-[12px] font-bold text-[#FACC15]">{u.monthlyXp}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 text-center">
              <p className="text-[11px] text-[#6B7280] font-bold uppercase tracking-widest">
                {t('ranking.resetNote')}
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
