"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'
import Link from 'next/link'
import { Plus, Calendar, GraduationCap, ChevronDown, Image as ImageIcon, BookOpen, Sparkles, Zap, Check, Flame } from 'lucide-react'
import { useLanguage } from '../../providers/LanguageProvider'

// --- Sub-components ---
function StatCard({ label, value, loading, icon: Icon, colorClass }: any) {
  return (
    // Applied "standard_card" style and "item_radius" (12px)
    <div className="bg-[#1C1C1E] p-3 rounded-[12px] border border-[#2D2D2F] flex flex-col items-center justify-center text-center transition-all">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={12} className={colorClass} />
        {/* Applied "label" typography: 11px, Bold, Uppercase */}
        <p className={`text-[11px] font-bold uppercase tracking-wider ${colorClass}`}>
          {label}
        </p>
      </div>
      {/* Applied "h1" typography: Bold */}
      <p className={`text-[19px] font-bold ${colorClass}`}>
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

  const total = data?.totalCardsCount || 0
  const due = data?.dueCardsCount || 0
  const streak = data?.streak || 0
  const totalXp = data?.totalXp || 0
  const lastActiveDate = data?.lastActiveDate
  const isFinished = data && due === 0 && total > 0
  const completionPercentage = isFinished ? 100 : (total > 0 ? ((total - due) / total) * 100 : 0)

  // Streak status: check if user has been active today
  const isActiveToday = lastActiveDate
    ? new Date(lastActiveDate).toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)
    : false

  return (
    // Global Background: #121212 | Font: System Sans-Serif
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#121212] text-[#FFFFFF] font-sans antialiased pb-[64px]">
      <div className="max-w-5xl mx-auto px-[6px] pt-[20px] relative">

        {/* HERO SECTION - Card Radius: 14px */}
        <section className={`relative overflow-hidden rounded-[14px] bg-[#1e1e1e] border transition-all duration-1000 p-6 mb-[20px] ${isFinished ? 'border-[#10B981]/40' : 'border-[#2D2D2F]'
          }`}>

          {/* Sublte light effect - changed to white/5 to avoid green/red bias */}
          <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] blur-[80px] rounded-full bg-white/5 transition-all duration-1000" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left order-2 md:order-1">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 border transition-colors duration-500 ${isFinished ? 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]' : 'bg-[#121212] border-[#2D2D2F] text-[#3B82F6]'
                }`}>
                <Sparkles size={12} fill="currentColor" />
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
                  <Zap size={16} fill="currentColor" />
                  <span>{isFinished ? t('learning.finished') : t('learning.start')}</span>
                </Link>
                {/* Secondary/Action Style */}
                <Link
                  href="/cards/new"
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-[#FFFFFF] text-[#000000] px-[24px] py-[14px] rounded-[12px] font-bold text-[14px] transition-all"
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
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
                {isFinished ? (
                  <Check size={30} className="text-[#000000]" strokeWidth={4} />
                ) : (
                  <>
                    <span className="text-[#EF4444] text-[36px] font-bold tracking-tighter leading-none">
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

        {/* STREAK & XP SECTION */}
        <section className="mb-[20px]">
          <div className={`relative overflow-hidden rounded-[14px] border p-4 transition-all ${streak > 0 ? 'bg-[#1C1C1E] border-[#EF4444]/20' : 'bg-[#1C1C1E] border-[#2D2D2F]'
            }`}>
            {streak > 0 && (
              <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] blur-[60px] rounded-full bg-[#EF4444]/10" />
            )}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center border ${streak > 0 ? 'bg-[#EF4444]/10 border-[#EF4444]/20' : 'bg-[#222222] border-[#2D2D2F]'
                  }`}>
                  <Flame size={20} className={streak > 0 ? 'text-[#EF4444]' : 'text-[#6B7280]'} fill={streak > 0 ? 'currentColor' : 'none'} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[19px] font-bold ${streak > 0 ? 'text-[#EF4444]' : 'text-[#6B7280]'}`}>
                      {loading ? '...' : streak}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                      {t('learning.dayStreak')}
                    </span>
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
                <Zap size={12} className="text-[#FACC15]" fill="currentColor" />
                <span className="text-[12px] font-bold text-[#FACC15]">{loading ? '...' : totalXp}</span>
                <span className="text-[10px] text-[#6B7280] font-bold uppercase">XP</span>
              </div>
            </div>

            {/* Streak progress dots for the week */}
            {streak > 0 && (
              <div className="mt-3 pt-3 border-t border-[#262626] flex items-center justify-center gap-2">
                {(() => {
                  const weekLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
                  const todayIndex = (new Date().getDay() + 6) % 7

                  return weekLabels.map((label, i) => {
                    const isToday = i === todayIndex;

                    // LOGIC: 
                    // 1. If it's today, fill it ONLY if isActiveToday is true.
                    // 2. If it's a past day, fill it if the streak is long enough to cover it.
                    let filled = false;
                    if (isToday) {
                      filled = isActiveToday;
                    } else if (i < todayIndex) {
                      // If today is Tuesday (index 1) and we check Monday (index 0)
                      // we fill it if streak is at least 1 (if we haven't done today) 
                      // or 2 (if we have already done today).
                      const distance = todayIndex - i;
                      filled = streak >= (isActiveToday ? distance + 1 : distance);
                    }

                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${filled
                          ? 'bg-[#EF4444] shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                          : isToday
                            ? 'bg-[#222222] border-2 border-[#EF4444]/40' // Ring for today if not done
                            : 'bg-[#222222] border border-[#2D2D2F]'
                          } ${isToday ? 'scale-110' : ''}`}>
                          {filled && <Flame size={10} className="text-white" fill="currentColor" />}
                        </div>
                        <span className={`text-[8px] font-bold uppercase ${isToday ? 'text-[#EF4444]' : 'text-[#6B7280]'}`}>
                          {label}
                        </span>
                      </div>
                    )
                  })
                })()}
              </div>
            )}
          </div>
        </section>

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
              className="text-[11px] font-bold uppercase tracking-widest text-[#10B981] hover:opacity-80 transition-colors flex items-center gap-1.5"
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
                      className={`flex items-center justify-between px-4 h-[56px] cursor-pointer transition-all hover:bg-[#222222] ${isOpen ? 'bg-[#222222]' : ''}`}
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