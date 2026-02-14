"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from './providers/UserProvider'
import Link from 'next/link'
import { Plus, LayoutGrid, Calendar, GraduationCap, ChevronDown, Image as ImageIcon } from 'lucide-react'

type Card = {
  id: string
  imageUrl?: string | null
  sentences: string[]
  nextReviewAt: string
}

function StatCard({ label, value, loading, icon: Icon }: { label: string; value: React.ReactNode; loading?: boolean; icon: any }) {
  return (
    <div className="bg-[#1C1C1E] p-[12px] px-[16px] rounded-[20px] transition-all hover:bg-[#121212] flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className="text-[#3B82F6]" />
        <p className="text-[14px] font-[600] uppercase text-[#98989E]">
          {label}
        </p>
      </div>
      <p className="text-[22px] font-[600] text-[#FFFFFF]">
        {loading ? <span className="animate-pulse opacity-20">•••</span> : value}
      </p>
    </div>
  )
}

export default function Home() {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDash() {
      // We still check for user.id to know when the session has loaded 
      // before attempting the fetch
      if (!user?.id) return
      
      setLoading(true)
      setError(null)
      try {
        // CLEANER & SECURE: No need to pass userId in params anymore.
        // The server identifies you via the Session Cookie.
        const res = await axios.get('/api/cards/dash')
        setData(res.data)
      } catch (e: any) {
        setError(e?.response?.data?.error || 'Unable to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchDash()
  }, [user?.id])

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] font-['San_Francisco',_Roboto,_Arial,_sans-serif] antialiased">
      <div className="max-w-5xl mx-auto px-[20px] py-[32px] relative">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-[12px] mb-[32px]">
          <div>
            <h1 className="text-[28px] font-[700] tracking-tight text-[#FFFFFF] mb-2">
              Learning Overview
            </h1>
            <p className="text-[#98989E] text-[15px]">
              Manage your active flashcards and track study progress.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/cards/deck"
              className="inline-flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-[#FFFFFF] px-[20px] py-[12px] rounded-[18px] font-[600] text-[15px] transition-all active:scale-[0.98]"
            >
              <GraduationCap size={18} />
              <span>Start learning</span>
            </Link>

            <Link
              href="/cards/new"
              className="inline-flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-[#FFFFFF] px-[20px] py-[12px] rounded-[18px] font-[600] text-[15px] transition-all active:scale-[0.98]"
            >
              <Plus size={18} strokeWidth={3} />
              <span>New Card</span>
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-[12px] mb-[32px]">
          <StatCard label="Collection" icon={LayoutGrid} value={data?.totalCardsCount || 0} loading={loading} />
          <StatCard label="Due Now" icon={Calendar} value={data?.dueCardsCount || 0} loading={loading} />
          <StatCard label="Mastery" icon={GraduationCap} value={`${data?.learnedCardsCount || 0}`} loading={loading} />
        </section>

        {/* List Section */}
        <section>
          <div className="flex items-center justify-between mb-[12px]">
            <h2 className="text-[14px] font-[600] uppercase tracking-widest text-[#98989E]">
              Active Cards
            </h2>
            {loading && <div className="w-4 h-4 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin" />}
          </div>

          {error && (
            <div className="p-4 mb-6 rounded-[16px] bg-[#1C1C1E] border border-[#FF453A]/50 text-[#FF453A] text-[14px]">
              {error}
            </div>
          )}

          <div className="bg-[#121212] border border-[#3A3A3C] rounded-[24px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#3A3A3C] bg-[#1C1C1E]">
                  <th className="px-6 py-4 text-[14px] font-[600] text-[#98989E] uppercase tracking-widest">Card Content</th>
                  <th className="px-6 py-4 text-[14px] font-[600] text-[#98989E] uppercase tracking-widest hidden md:table-cell">Next Review</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A3A3C]">
                {!loading && data?.cards?.map((c: Card) => {
                  const isOpen = expandedId === c.id;
                  return (
                    <React.Fragment key={c.id}>
                      <tr
                        onClick={() => setExpandedId(isOpen ? null : c.id)}
                        className={`group cursor-pointer transition-colors hover:bg-[#1C1C1E] ${isOpen ? 'bg-[#1C1C1E]' : ''}`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-[12px] bg-[#3A3A3C] overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {c.imageUrl ? (
                                <img src={c.imageUrl} alt="" className="w-full h-full object-cover transition-all" />
                              ) : (
                                <ImageIcon size={18} className="text-[#98989E]" />
                              )}
                            </div>
                            <p className="text-[17px] font-[400] text-[#FFFFFF] line-clamp-1">
                              {c.sentences[0] || "Untitled Card"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden md:table-cell">
                          <span className="text-[15px] text-[#98989E]">
                            {new Date(c.nextReviewAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <ChevronDown 
                            size={18} 
                            className={`inline-block text-[#636366] transition-transform ${isOpen ? 'rotate-180 text-[#3B82F6]' : ''}`} 
                          />
                        </td>
                      </tr>

                      {isOpen && (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 bg-[#000000]">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                              <div className="md:col-span-4">
                                <div className="aspect-square rounded-[16px] overflow-hidden border border-[#3A3A3C] bg-[#121212]">
                                  {c.imageUrl ? (
                                    <img src={c.imageUrl} alt="Context" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#636366] text-[14px] font-[600] uppercase">
                                      No Image
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="md:col-span-8">
                                <p className="text-[14px] font-[600] text-[#22C55E] uppercase tracking-widest mb-4">Context Variations</p>
                                <div className="space-y-4">
                                  {c.sentences.map((s, i) => (
                                    <div key={i} className="flex gap-4 group/line p-3 rounded-[12px] hover:bg-[#121212] transition-colors">
                                      <span className="text-[#3B82F6] text-[15px] font-[600]">0{i + 1}</span>
                                      <p className="text-[17px] text-[#98989E] group-hover/line:text-[#FFFFFF] transition-colors leading-relaxed">
                                        {s}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            {!loading && (!data?.cards || data?.cards?.length === 0) && (
              <div className="py-20 text-center">
                <p className="text-[#98989E] text-[17px] mb-4">Your collection is empty.</p>
                <Link href="/cards/new" className="text-[#22C55E] text-[15px] font-[600] uppercase border-b border-[#22C55E]/20 hover:border-[#22C55E] pb-0.5 transition-all">
                  Create your first card
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}