"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'
import Link from 'next/link'
import { Plus, Calendar, GraduationCap, ChevronDown, Image as ImageIcon, BookOpen, Sparkles, Zap, Check, ListFilter } from 'lucide-react'

// --- Sub-components ---
function StatCard({ label, value, loading, icon: Icon, colorClass }: any) {
  return (
    <div className="bg-[#1C1C1E] p-3 md:p-[12px] md:px-[16px] rounded-[16px] md:rounded-[20px] transition-all border border-transparent hover:border-[#3A3A3C] flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={12} className={colorClass} />
        <p className={`text-[9px] md:text-[12px] font-[700] uppercase tracking-wider md:tracking-widest ${colorClass} opacity-80`}>
          {label}
        </p>
      </div>
      <p className={`text-[18px] md:text-[22px] font-[600] ${colorClass}`}>
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
  const [isListExpanded, setIsListExpanded] = useState(false) // New state for expanding the whole section

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

  const radius = 70
  const circumference = 2 * Math.PI * radius
  const completionPercentage = isFinished ? 100 : (total > 0 ? ((total - due) / total) * 100 : 0)
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] font-['San_Francisco',_sans-serif] antialiased pb-[40px] md:pb-[60px]">
      <div className="max-w-5xl mx-auto px-[16px] md:px-[20px] pt-[20px] md:pt-[32px] relative">
        
        {/* HERO / PSYCHOLOGICAL SECTION */}
        <section className={`relative overflow-hidden rounded-[24px] md:rounded-[32px] border transition-all duration-1000 p-6 md:p-12 mb-[20px] md:mb-[32px] ${
          isFinished ? 'bg-[#121212] border-[#22C55E]/40' : 'bg-[#121212] border-[#1C1C1E]'
        }`}>
          
          <div className={`absolute top-[-50px] right-[-50px] w-[200px] h-[200px] md:w-[400px] md:h-[400px] blur-[80px] md:blur-[120px] rounded-full transition-all duration-1000 ${
            isFinished ? 'bg-[#22C55E]/15' : 'bg-[#FF453A]/10'
          }`} />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
            <div className="flex-1 text-center md:text-left order-2 md:order-1">
              <div className={`inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full mb-4 md:mb-6 border transition-colors duration-500 ${
                isFinished ? 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]' : 'bg-[#1C1C1E] border-[#3A3A3C] text-[#3B82F6]'
              }`}>
                <Sparkles size={12} fill="currentColor" />
                <span className="text-[11px] md:text-[13px] font-[700] uppercase tracking-widest">
                  {isFinished ? "Neural Pathways Synced" : "Daily Objective"}
                </span>
              </div>
              
              <h1 className="text-[28px] md:text-[48px] font-[700] leading-[1.1] tracking-tight mb-4 md:mb-6">
                {isFinished ? (
                  <>Everything is <br className="hidden md:block" /><span className="text-[#22C55E]">Mastered.</span></>
                ) : (
                  <>Don't lose the <br className="hidden md:block" /><span className="text-[#FF453A]">Momentum.</span></>
                )}
              </h1>
              
              <p className="text-[#98989E] text-[15px] md:text-[18px] max-w-md mb-6 md:mb-8 leading-relaxed mx-auto md:mx-0">
                {isFinished 
                  ? "Your review queue is empty. Knowledge protected."
                  : `You have ${due} cards needing immediate attention.`}
              </p>
              
              <div className="flex flex-row justify-center md:justify-start gap-3">
                <Link
                  href="/cards/deck"
                  className={`flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-[20px] md:px-[36px] py-[14px] md:py-[18px] rounded-[16px] md:rounded-[22px] font-[700] text-[14px] md:text-[17px] transition-all active:scale-[0.95] ${
                    isFinished 
                    ? "bg-[#1C1C1E] text-[#636366] border border-[#3A3A3C] cursor-not-allowed" 
                    : "bg-[#FF453A] text-[#FFFFFF] shadow-[0_10px_30px_rgba(255,69,58,0.2)]"
                  }`}
                >
                  <Zap size={16} fill="currentColor" />
                  <span>{isFinished ? "Finished" : "Start"}</span>
                </Link>
                <Link
                  href="/cards/new"
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white text-black px-[20px] md:px-[28px] py-[14px] md:py-[18px] rounded-[16px] md:rounded-[22px] font-[700] text-[14px] md:text-[17px] transition-all"
                >
                  <Plus size={16} strokeWidth={3} />
                  <span>New</span>
                </Link>
              </div>
            </div>

            {/* PSYCHOLOGICAL RING - Scaled for Mobile */}
            <div className="relative w-[140px] h-[140px] md:w-[220px] md:h-[220px] flex items-center justify-center order-1 md:order-2">
              {!isFinished && due > 0 && (
                <div className="absolute inset-0 rounded-full bg-[#FF453A]/5 animate-ping" />
              )}
              
              <svg className="w-full h-full transform -rotate-90 relative z-10 overflow-visible">
                <circle
                  cx="50%" cy="50%" r={radius}
                  stroke="currentColor" strokeWidth="12" 
                  fill={isFinished ? "#10ea60" : "transparent"}
                  className={`transition-all duration-1000 ${isFinished ? "text-[#22C55E]" : "text-[#1C1C1E]"}`}
                  style={{ r: 'calc(50% - 12px)' }}
                />
                <circle
                  cx="50%" cy="50%" r={radius}
                  stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray={2 * Math.PI * (radius)}
                  style={{ 
                    r: 'calc(50% - 12px)',
                    strokeDashoffset: loading ? 500 : (2 * Math.PI * (radius)) - (completionPercentage / 100) * (2 * Math.PI * (radius)),
                    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }}
                  strokeLinecap="round"
                  className={isFinished ? "text-[#10ea60]" : "text-[#FF453A]"}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
                {isFinished ? (
                  <Check size={30} className="text-black md:size-[38px]" strokeWidth={4} />
                ) : (
                  <>
                    <span className="text-[#FF453A] text-[36px] md:text-[52px] font-[800] tracking-tighter leading-none">
                      {loading ? ".." : due}
                    </span>
                    <span className="text-[#98989E] text-[9px] md:text-[11px] font-[700] uppercase tracking-[0.1em] mt-1">
                      Due
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* OVERVIEW SECTION - 3 Columns on Mobile for space efficiency */}
        <section className="mb-[24px] md:mb-[32px]">
          <div className="grid grid-cols-3 md:grid-cols-3 gap-[8px] md:gap-[12px]">
            <StatCard 
              label="Review" 
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

        {/* RECENT ACTIVITY TABLE - NOW EXPANDABLE */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[11px] md:text-[13px] font-[700] uppercase tracking-widest text-[#636366]">Activity</h2>
            <button 
              onClick={() => setIsListExpanded(!isListExpanded)}
              className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              {isListExpanded ? "Hide All" : "View All"}
              <ChevronDown size={14} className={`transition-transform duration-300 ${isListExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className={`bg-[#121212] border border-[#1C1C1E] rounded-[24px] md:rounded-[28px] overflow-hidden transition-all duration-500 ${isListExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <div className="w-full">
                {!loading && data?.cards?.map((c: any) => {
                  const isOpen = expandedId === c.id;
                  return (
                    <div key={c.id} className="border-b border-[#1C1C1E] last:border-0">
                      <div 
                        onClick={() => setExpandedId(isOpen ? null : c.id)} 
                        className={`flex items-center justify-between px-4 py-4 md:px-6 md:py-5 cursor-pointer transition-all hover:bg-[#1C1C1E] ${isOpen ? 'bg-[#1C1C1E]' : ''}`}
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-[12px] md:rounded-[14px] bg-[#1C1C1E] overflow-hidden flex-shrink-0 flex items-center justify-center border border-[#3A3A3C]">
                            {c.imageUrl ? (
                              <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={16} className="text-[#3A3A3C]" />
                            )}
                          </div>
                          <div className="max-w-[180px] md:max-w-none">
                              <p className="text-[15px] md:text-[17px] font-[500] text-[#FFFFFF] truncate">{c.sentences[0] || "Untitled"}</p>
                              <p className="text-[12px] text-[#636366] mt-0.5">Next: {new Date(c.nextReviewAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'text-[#3A3A3C]'}`}>
                          <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                      {isOpen && (
                        <div className="px-4 py-6 md:px-6 md:py-8 bg-[#000000]/50 animate-in slide-in-from-top-1 duration-200">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                              <div className="md:col-span-4 aspect-video rounded-[16px] md:rounded-[20px] overflow-hidden border border-[#1C1C1E] bg-[#121212]">
                                  {c.imageUrl ? <img src={c.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#3A3A3C] text-[10px] font-[700] uppercase tracking-widest">No Visual</div>}
                              </div>
                              <div className="md:col-span-8">
                                  <p className="text-[10px] md:text-[11px] font-[700] text-[#22C55E] uppercase tracking-widest mb-3">Context Variations</p>
                                  <div className="space-y-2">
                                      {c.sentences.map((s: string, i: number) => (
                                          <div key={i} className="p-3 md:p-4 rounded-[14px] md:rounded-[18px] bg-[#1C1C1E] border border-transparent">
                                              <p className="text-[14px] md:text-[15px] text-[#FFFFFF] leading-snug">{s}</p>
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
               <p className="text-[10px] text-zinc-700 font-black uppercase tracking-widest">List Hidden • Click View All to Expand</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}