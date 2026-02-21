"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '../providers/UserProvider'
import { useLanguage } from '../providers/LanguageProvider'
import Link from 'next/link'
import { Shield, Trophy, Flame, ChevronLeft, Loader2, Zap, Crown, Medal } from 'lucide-react'

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
  if (rank === 1) return <Crown size={16} className="text-[#FACC15]" fill="currentColor" />
  if (rank === 2) return <Medal size={16} className="text-[#C0C0C0]" fill="currentColor" />
  if (rank === 3) return <Medal size={16} className="text-[#CD7F32]" fill="currentColor" />
  return <span className="text-[12px] font-bold text-[#6B7280]">#{rank}</span>
}

export default function RankingPage() {
  const { user } = useUser()
  const { t, language } = useLanguage()
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
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#121212] text-[#FFFFFF] antialiased pb-[64px]">
      {/* Header */}
      <header dir="ltr" className="sticky top-0 z-20 bg-[#121212] border-b border-[#262626] px-4 h-[64px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1 text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-[#FACC15]" fill="currentColor" />
            <h1 className="text-[17px] font-bold tracking-[-0.5px]">{t('ranking.title')}</h1>
          </div>
        </div>
        <div className="bg-[#222222] border border-[#2D2D2F] px-3 py-1 rounded-[12px]">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">{t('ranking.thisMonth')}</span>
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
                          ? 'bg-[#1C1C1E] border-[#FACC15]/30 shadow-[0_0_30px_rgba(250,204,21,0.05)]'
                          : 'bg-[#1C1C1E] border-[#2D2D2F]'
                      } ${isMe ? 'ring-1 ring-[#3B82F6]/50' : ''} ${isFirst ? 'order-2' : podiumIndex === 0 ? 'order-1' : 'order-3'}`}
                    >
                      <div className={`w-12 h-12 rounded-[12px] overflow-hidden border-2 mb-2 flex items-center justify-center bg-[#222222] ${
                        isFirst ? 'border-[#FACC15]' : 'border-[#2D2D2F]'
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
                      <p className="text-[12px] font-bold text-[#FFFFFF] truncate max-w-full">
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
                      {u.streakCount > 0 && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Flame size={10} className="text-[#EF4444]" />
                          <span className="text-[10px] text-[#EF4444] font-bold">{u.streakCount}d</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </section>
            )}

            {/* Full List */}
            <div className="bg-[#1C1C1E] border border-[#2D2D2F] rounded-[14px] overflow-hidden">
              {ranking.map((u) => {
                const isMe = u.id === user?.id
                return (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between px-4 h-[60px] border-b border-[#262626] last:border-0 transition-all ${
                      isMe ? 'bg-[#3B82F6]/5' : 'hover:bg-[#222222]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 flex items-center justify-center">
                        {getRankIcon(u.rank)}
                      </div>
                      <div className="w-9 h-9 rounded-[10px] overflow-hidden bg-[#222222] border border-[#2D2D2F] flex items-center justify-center flex-shrink-0">
                        {u.image ? (
                          <img src={u.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[13px] font-bold text-[#6B7280]">
                            {u.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className={`text-[14px] font-semibold ${isMe ? 'text-[#3B82F6]' : 'text-[#FFFFFF]'}`}>
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
                      {u.streakCount > 0 && (
                        <div className="flex items-center gap-1">
                          <Flame size={12} className="text-[#EF4444]" />
                          <span className="text-[11px] text-[#EF4444] font-bold">{u.streakCount}</span>
                        </div>
                      )}
                      <div className="bg-[#222222] border border-[#2D2D2F] px-3 py-1 rounded-[10px] flex items-center gap-1">
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
