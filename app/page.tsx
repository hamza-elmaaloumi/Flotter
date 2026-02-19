"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Zap,
  BrainCircuit,
  Target,
  ArrowRight,
  Microscope,
  Sparkles,
  ChevronDown,
  Play,
  Lock,
  Eye,
  Shield
} from 'lucide-react'
import { useLanguage } from './providers/LanguageProvider'

// --- Science Badge Component ---
function ScienceBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6] text-[11px] font-bold uppercase tracking-wider">
      <Microscope size={12} />
      {children}
    </span>
  )
}

// --- Memory Demo Component ---
function MemoryDemo() {
  const [step, setStep] = useState(0)
  
  const stages = [
    { label: "Abstract", color: "#6B7280", icon: Lock },
    { label: "Visual", color: "#FACC15", icon: Eye }, // Gold color per design update
    { label: "Story", color: "#3B82F6", icon: BrainCircuit },
    { label: "Pathway", color: "#10B981", icon: Zap }
  ]

  return (
    /* card_radius: 16px | background: #1C1C1E */
    <div className="bg-[#1C1C1E] rounded-[16px] p-6 border border-[#2D2D2F]">
      <div className="flex justify-between mb-6 relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#2D2D2F] -z-10" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-[#3B82F6] transition-all duration-700 -z-10"
          style={{ width: `${(step / 3) * 100}%` }}
        />
        
        {stages.map((stage, idx) => {
          const Icon = stage.icon
          const isActive = idx <= step
          return (
            <button
              key={idx}
              onClick={() => setStep(idx)}
              className={`flex flex-col items-center gap-2 transition-all ${isActive ? 'opacity-100' : 'opacity-40'}`}
            >
              <div 
                className="w-10 h-10 rounded-[12px] flex items-center justify-center border-2 transition-all duration-300"
                style={{ 
                  borderColor: isActive ? stage.color : '#2D2D2F',
                  backgroundColor: isActive ? `${stage.color}10` : '#121212'
                }}
              >
                <Icon size={18} style={{ color: isActive ? stage.color : '#6B7280' }} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                {stage.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* item_radius: 12px */}
      <div className="bg-[#121212] rounded-[12px] p-5 border border-[#2D2D2F] min-h-[140px] flex items-center justify-center">
        {step === 0 && (
          <div className="text-center">
            <p className="text-[#6B7280] text-[14px] mb-2">Traditional apps teach:</p>
            <p className="text-[19px] font-bold text-[#FFFFFF]">"Ephemeral = Lasting a short time"</p>
            <p className="text-[#EF4444] text-[12px] mt-2 font-bold uppercase">10% Retention</p>
          </div>
        )}
        {step === 1 && (
          <div className="text-center">
            <p className="text-[#6B7280] text-[14px] mb-2">Visual Anchors:</p>
            <div className="px-4 py-2 bg-[#FACC15]/10 rounded-[8px] border border-[#FACC15]/20 mb-2">
              <span className="text-[#FACC15] font-bold">🌸 Falling Petals</span>
            </div>
            <p className="text-[#9CA3AF] text-[12px]">Visual encoding triggers long-term storage</p>
          </div>
        )}
        {step === 2 && (
          <div className="text-center space-y-2">
            <p className="text-[#6B7280] text-[14px]">Contextual Stories:</p>
            <p className="text-[15px] text-[#FFFFFF] italic font-medium">"Beauty that is <span className="text-[#3B82F6]">ephemeral</span>."</p>
            <p className="text-[#3B82F6] text-[12px] font-bold uppercase">Sensory binding active</p>
          </div>
        )}
        {step === 3 && (
          <div className="text-center">
            <p className="text-[#10B981] text-[14px] font-bold mb-2 uppercase tracking-widest">Neural Pathway Forged</p>
            <div className="flex items-center justify-center gap-2 text-[#FFFFFF] text-[13px]">
              <span>Image</span>
              <ArrowRight size={14} className="text-[#10B981]" />
              <span>Emotion</span>
              <ArrowRight size={14} className="text-[#10B981]" />
              <span className="font-bold text-[#10B981]">Memory</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => setStep(prev => Math.min(prev + 1, 3))}
          className="text-[11px] font-bold uppercase tracking-widest text-[#3B82F6] disabled:opacity-30 flex items-center gap-1"
        >
          {step === 3 ? "Complete" : "Next Phase"} <ChevronDown size={14} />
        </button>
      </div>
    </div>
  )
}

function EvidenceCard({ stat, label, source }: { stat: string, label: string, source: string }) {
  return (
    <div className="bg-[#1C1C1E] p-4 rounded-[12px] border border-[#2D2D2F] text-center">
      <div className="text-[24px] font-bold text-[#3B82F6] mb-1">{stat}</div>
      <div className="text-[#FFFFFF] text-[13px] font-bold mb-1">{label}</div>
      <div className="text-[#6B7280] text-[10px] uppercase tracking-wider font-bold">{source}</div>
    </div>
  )
}

export default function LandingPage() {
  const { t, language } = useLanguage()

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#121212] text-[#FFFFFF] antialiased selection:bg-[#3B82F6]/30">

      {/* HEADER - Consistent with App Header */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#262626] bg-[#121212]/95 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#3B82F6] rounded-[12px] flex items-center justify-center shadow-lg shadow-[#3B82F6]/20">
              <Zap size={20} fill="white" className="text-white" />
            </div>
            <span className="text-[18px] font-bold tracking-tight">Flotter</span>
          </div>
          
          <div className="flex items-center gap-3">
             <Link href="/ranking" className="p-2 text-[#FACC15]">
                <Shield size={20} fill="#FACC15" />
             </Link>
             <Link 
                href="/register" 
                className="bg-[#3B82F6] text-white px-5 py-2.5 rounded-[12px] text-[13px] font-bold uppercase tracking-widest hover:bg-[#1D4ED8] transition-all"
              >
                Join
              </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-[140px] pb-[80px] px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#3B82F6]/05 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <ScienceBadge>Science of Dual Coding</ScienceBadge>
          </div>

          <h1 className="text-[36px] md:text-[52px] font-bold leading-[1.1] mb-6 text-[#FFFFFF]">
            Words That <span className="text-[#3B82F6]">Stick</span>.<br />
            <span className="text-[#9CA3AF]">Not Just Your App.</span>
          </h1>

          <p className="text-[#9CA3AF] text-[16px] md:text-[18px] max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop memorizing lists. Start encoding <span className="text-[#ee3939] font-bold uppercase text-[15px]">neural pathways</span> using visual anchors and embodied storytelling.
          </p>

          <div className="max-w-sm mx-auto mb-12">
            <MemoryDemo />
          </div>

          <div className="flex flex-col items-center gap-4">
            <Link 
              href="/register"
              className="bg-[#3B82F6] text-white px-10 py-4 rounded-[12px] text-[15px] font-bold uppercase tracking-widest hover:bg-[#1D4ED8] transition-all flex items-center gap-3 shadow-xl shadow-[#3B82F6]/20 active:scale-95"
            >
              Start Neural Training 
              <ArrowRight size={19} />
            </Link>
            <p className="text-[#6B7280] text-[11px] font-bold uppercase tracking-widest">No credit card required</p>
          </div>
        </div>
      </section>

      {/* EVIDENCE SECTION */}
      <section className="max-w-5xl mx-auto px-4 py-16 border-y border-[#262626]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <EvidenceCard stat="65%" label="Retention" source="Dual Coding" />
          <EvidenceCard stat="2x" label="Recall" source="Recall Speed" />
          <EvidenceCard stat="3x" label="Memory" source="Self-Reference" />
          <EvidenceCard stat="60k" label="Processing" source="Visual Power" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-4xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-[11px] font-bold uppercase text-[#3B82F6] tracking-widest mb-3">The Methodology</h2>
          <h3 className="text-[28px] font-bold text-[#FFFFFF]">Encoding vs. Memorizing</h3>
        </div>

        <div className="space-y-[12px]">
          <div className="bg-[#1C1C1E] rounded-[16px] p-8 border border-[#2D2D2F] flex flex-col md:flex-row gap-8 items-center">
             <div className="w-16 h-16 rounded-[12px] bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center flex-shrink-0">
               <Lock className="text-[#EF4444]" size={28} />
             </div>
             <div className="flex-1 text-center md:text-left">
               <h4 className="text-[19px] font-bold text-[#FFFFFF] mb-2">The Forgetting Curve</h4>
               <p className="text-[#9CA3AF] text-[15px] leading-relaxed">
                 Traditional rote learning lacks emotional hooks. Flotter prevents data-dumping by forging sensory anchors within 24 hours.
               </p>
             </div>
          </div>

          <div className="bg-[#1C1C1E] rounded-[16px] p-8 border border-[#3B82F6]/20 flex flex-col md:flex-row gap-8 items-center">
             <div className="w-16 h-16 rounded-[12px] bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
               <Sparkles className="text-[#3B82F6]" size={28} />
             </div>
             <div className="flex-1 text-center md:text-left">
               <h4 className="text-[19px] font-bold text-[#FFFFFF] mb-2">The Flotter Method™</h4>
               <p className="text-[#9CA3AF] text-[15px] leading-relaxed">
                 We activate the <span className="text-[#FFFFFF] font-bold">Memory Tetrad</span>: Visual, Sensory, Emotional, and Personal experience traces.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-[#262626] text-center bg-[#121212] mb-16">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-[#6B7280]">
            <Zap size={14} fill="#6B7280" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Flotter Engine © 2026</span>
          </div>
          <p className="text-[#4B5563] text-[11px] max-w-xs font-medium">
            Cognitive Science Framework v1.0.0
          </p>
        </div>
      </footer>
    </div>
  )
}