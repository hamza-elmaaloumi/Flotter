"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'
import Link from 'next/link'
import { Plus, Calendar, GraduationCap, ChevronDown, Image as ImageIcon, BookOpen, Sparkles, Zap, Check } from 'lucide-react'

// --- Sub-components ---
function StatCard({ label, value, loading, icon: Icon, colorClass }: any) {
  return (
    <div className="bg-[#1C1C1E] p-[12px] px-[16px] rounded-[20px] transition-all border border-transparent hover:border-[#3A3A3C] flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className={colorClass} />
        <p className={`text-[12px] font-[700] uppercase tracking-widest ${colorClass} opacity-80`}>
          {label}
        </p>
      </div>
      <p className={`text-[22px] font-[600] ${colorClass}`}>
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
  const isFinished = data && due === 0 && total > 0

  // SVG Circle Math
  const radius = 70
  const circumference = 2 * Math.PI * radius
  // If finished, we want 100% fill. If not, calculate percentage.
  const completionPercentage = isFinished ? 100 : (total > 0 ? ((total - due) / total) * 100 : 0)
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] font-['San_Francisco',_sans-serif] antialiased pb-[60px]">
      <div className="max-w-5xl mx-auto px-[20px] pt-[32px] relative">
        
        {/* HERO / PSYCHOLOGICAL SECTION */}
        <section className={`relative overflow-hidden rounded-[32px] border transition-all duration-1000 p-8 md:p-12 mb-[32px] ${
          isFinished ? 'bg-[#051109] border-[#22C55E]/40' : 'bg-[#0A0A0A] border-[#1C1C1E]'
        }`}>
          
          {/* Background Glows */}
          <div className={`absolute top-[-100px] right-[-100px] w-[400px] h-[400px] blur-[120px] rounded-full transition-all duration-1000 ${
            isFinished ? 'bg-[#22C55E]/20' : 'bg-[#FF453A]/10'
          }`} />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border transition-colors duration-500 ${
                isFinished ? 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]' : 'bg-[#1C1C1E] border-[#3A3A3C] text-[#3B82F6]'
              }`}>
                <Sparkles size={14} fill="currentColor" />
                <span className="text-[13px] font-[700] uppercase tracking-widest">
                  {isFinished ? "Neural Pathways Synced" : "Daily Objective"}
                </span>
              </div>
              
              <h1 className="text-[32px] md:text-[48px] font-[700] leading-[1.05] tracking-tight mb-6">
                {isFinished ? (
                  <>Everything is <br /><span className="text-[#22C55E]">Mastered.</span></>
                ) : (
                  <>Don't lose the <br /><span className="text-[#FF453A]">Momentum.</span></>
                )}
              </h1>
              
              <p className="text-[#98989E] text-[18px] max-w-md mb-8 leading-relaxed">
                {isFinished 
                  ? "Great job. Your review queue is empty. You've successfully protected your knowledge from decay."
                  : `You have ${due} cards that need immediate attention to stay in your long-term memory.`}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Link
                  href="/cards/deck"
                  className={`inline-flex items-center justify-center gap-3 px-[36px] py-[18px] rounded-[22px] font-[700] text-[17px] transition-all active:scale-[0.95] ${
                    isFinished 
                    ? "bg-[#1C1C1E] text-[#636366] border border-[#3A3A3C] cursor-not-allowed" 
                    : "bg-[#FF453A] text-[#FFFFFF] hover:bg-[#E03E33] shadow-[0_10px_30px_rgba(255,69,58,0.3)]"
                  }`}
                >
                  <Zap size={18} fill="currentColor" />
                  <span>{isFinished ? "No Pending Cards" : "Start Session"}</span>
                </Link>
                <Link
                  href="/cards/new"
                  className="inline-flex items-center justify-center gap-3 bg-white text-black hover:bg-[#E5E5E5] px-[28px] py-[18px] rounded-[22px] font-[700] text-[17px] transition-all"
                >
                  <Plus size={18} strokeWidth={3} />
                  <span>New Card</span>
                </Link>
              </div>
            </div>

            {/* THE REDESIGNED PSYCHOLOGICAL RING */}
            <div className="relative w-[220px] h-[220px] flex items-center justify-center">
              {/* Outer Pulse for Red state */}
              {!isFinished && due > 0 && (
                <div className="absolute inset-0 rounded-full bg-[#FF453A]/5 animate-ping" />
              )}
              
              <svg className="w-full h-full transform -rotate-90 relative z-10 overflow-visible">
                {/* Background Ring */}
                <circle
                  cx="110" cy="110" r={radius}
                  stroke="currentColor" strokeWidth="14" 
                  fill={isFinished ? "#10ea60" : "transparent"}
                  className={`transition-all duration-1000 ${isFinished ? "text-[#22C55E]" : "text-[#1C1C1E]"}`}
                />
                
                {/* Progress/State Ring */}
                <circle
                  cx="110" cy="110" r={radius}
                  stroke="currentColor" strokeWidth="14" fill="transparent"
                  strokeDasharray={circumference}
                  style={{ 
                    strokeDashoffset: loading ? circumference : strokeDashoffset,
                    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }}
                  strokeLinecap="round"
                  className={isFinished ? "text-[#10ea60]" : "text-[#FF453A]"}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
                {isFinished ? (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
                    <Check size={38} className="text-black" strokeWidth={4} />
                    <p className="text-black text-[12px] font-[800] uppercase tracking-[0.15em] mt-1">Completed</p>
                  </div>
                ) : (
                  <>
                    <span className="text-[#FF453A] text-[52px] font-[800] tracking-tighter leading-none">
                      {loading ? "..." : due}
                    </span>
                    <span className="text-[#98989E] text-[11px] font-[700] uppercase tracking-[0.2em] mt-1">
                      Due Now
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* OVERVIEW SECTION */}
        <section className="mb-[32px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
            <StatCard 
              label="Ready to Review" 
              icon={Calendar} 
              value={due} 
              loading={loading} 
              colorClass={due > 0 ? "text-[#FF453A]" : "text-[#98989E]"} 
            />
            <StatCard 
              label="Learning" 
              icon={BookOpen} 
              value={Math.max(0, (total) - (data?.learnedCardsCount || 0) - due)} 
              loading={loading} 
              colorClass="text-[#FFCC00]" 
            />
            <StatCard 
              label="Mastered" 
              icon={GraduationCap} 
              value={data?.learnedCardsCount || 0} 
              loading={loading} 
              colorClass="text-[#3B82F6]" 
            />
          </div>
        </section>

        {/* RECENT ACTIVITY TABLE */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-[13px] font-[700] uppercase tracking-widest text-[#636366]">Recent Deck Activity</h2>
          </div>

          <div className="bg-[#121212] border border-[#1C1C1E] rounded-[28px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-[#1C1C1E]">
                {!loading && data?.cards?.map((c: any) => {
                  const isOpen = expandedId === c.id;
                  return (
                    <React.Fragment key={c.id}>
                      <tr 
                        onClick={() => setExpandedId(isOpen ? null : c.id)} 
                        className={`group cursor-pointer transition-all hover:bg-[#1C1C1E] ${isOpen ? 'bg-[#1C1C1E]' : ''}`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-[14px] bg-[#1C1C1E] overflow-hidden flex-shrink-0 flex items-center justify-center border border-[#3A3A3C]">
                              {c.imageUrl ? (
                                <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon size={18} className="text-[#3A3A3C]" />
                              )}
                            </div>
                            <div>
                                <p className="text-[17px] font-[500] text-[#FFFFFF]">{c.sentences[0] || "Untitled"}</p>
                                <p className="text-[13px] text-[#636366] mt-0.5">Next: {new Date(c.nextReviewAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'text-[#3A3A3C]'}`}>
                            <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr>
                          <td colSpan={2} className="px-6 py-8 bg-[#000000]/50">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                <div className="md:col-span-4 aspect-video rounded-[20px] overflow-hidden border border-[#1C1C1E] bg-[#121212]">
                                    {c.imageUrl ? <img src={c.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#3A3A3C] text-[11px] font-[700] uppercase tracking-widest">No Visual Context</div>}
                                </div>
                                <div className="md:col-span-8">
                                    <p className="text-[11px] font-[700] text-[#22C55E] uppercase tracking-widest mb-3">Context Variations</p>
                                    <div className="space-y-2">
                                        {c.sentences.map((s: string, i: number) => (
                                            <div key={i} className="p-4 rounded-[18px] bg-[#1C1C1E] border border-transparent">
                                                <p className="text-[15px] text-[#FFFFFF] leading-snug">{s}</p>
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
          </div>
        </section>
      </div>
    </div>
  )
}