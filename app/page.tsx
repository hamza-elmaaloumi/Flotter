"use client"

import React from 'react'
import Link from 'next/link'
import {
  Zap,
  Sparkles,
  BrainCircuit,
  Target,
  ArrowRight,
  Layers,
  Activity
} from 'lucide-react'

// --- Feature Card (Applying standard_card border_radius and surface color) ---
function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="bg-[#1C1C1E] p-[20px] rounded-[24px] border border-[#3A3A3C] hover:border-[#22C55E] transition-all group relative overflow-hidden">
      <div className="w-10 h-10 rounded-[16px] bg-[#22C55E]/10 flex items-center justify-center mb-5 border border-[#22C55E]/20 group-hover:scale-110 transition-transform">
        <Icon className="text-[#22C55E]" size={20} strokeWidth={2} />
      </div>
      <h3 className="text-[17px] font-[600] text-[#FFFFFF] mb-2">{title}</h3>
      <p className="text-[#98989E] text-[15px] leading-relaxed font-[400]">
        {description}
      </p>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] antialiased selection:bg-[#22C55E]/30 font-['San_Francisco',_Roboto,_Arial,_sans-serif]">

      {/* NAVIGATION (Applying bottom_tab_bar logic to top nav for consistency) */}
      <nav className="fixed top-0 w-full z-50 border-b-[0.5px] border-[#1C1C1E] bg-[#000000]/80 backdrop-blur-xl">
        <div className="max-w-[1100px] mx-auto px-[20px] h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#22C55E] rounded-lg flex items-center justify-center">
              <Zap size={14} fill="#FFFFFF" className="text-[#FFFFFF]" />
            </div>
            <span className="text-[22px] font-[600] tracking-tight text-[#FFFFFF]">
              Linguist<span className="text-[#22C55E]">Pulse</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-[14px] font-[600] uppercase text-[#98989E]">
            <a href="#method" className="hover:text-[#22C55E] transition-colors">Algorithm</a>
            <a href="#features" className="hover:text-[#22C55E] transition-colors">Protocol</a>
          </div>

          <Link 
            href="/login" 
            className="bg-[#121212] text-[#FFFFFF] px-5 py-2 rounded-[100px] text-[14px] font-[600] border border-[#3A3A3C] hover:bg-[#1C1C1E] transition-all"
          >
            Enter App
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-[140px] pb-[80px] px-[20px]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[#22C55E]/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[20px] bg-[#1C1C1E] border border-[#22C55E]/30 mb-8">
            <Sparkles size={12} className="text-[#EAB308]" />
            <span className="text-[14px] font-[600] uppercase text-[#EAB308]">
              Neural Optimization Active
            </span>
          </div>

          <h1 className="text-[28px] md:text-[56px] font-[700] leading-[1.1] mb-6 text-[#FFFFFF]">
            Shield your mind <br />
            from <span className="text-[#FF453A]">memory decay.</span>
          </h1>

          <p className="text-[#98989E] text-[17px] font-[400] max-w-xl mx-auto mb-10 leading-relaxed">
            Stop losing progress. Our SRS engine triggers reviews at the exact millisecond of forgetfulness.
          </p>

          <div className="flex justify-center">
            <Link 
              href="/register"
              className="bg-[#22C55E] text-[#FFFFFF] px-[24px] py-[16px] rounded-[18px] text-[17px] font-[600] hover:bg-[#16A34A] transition-all flex items-center gap-2 shadow-lg shadow-[#22C55E]/10"
            >
              Initialize Training <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* INTERACTIVE MOCKUP (Applying interactive_card styles) */}
      <section className="max-w-[800px] mx-auto px-[20px] mb-[80px]">
        <div className="bg-[#1C1C1E] rounded-[24px] p-8 md:p-10 flex flex-col md:row items-center gap-8 border border-[#3A3A3C]">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3 text-[#3B82F6]">
              <Activity size={18} />
              <span className="font-[600] uppercase text-[14px]">Real-time Mastery</span>
            </div>
            <h2 className="text-[22px] font-[600] mb-3 text-[#FFFFFF]">Sync Your Synapses.</h2>
            <p className="text-[#98989E] text-[15px] font-[400] leading-relaxed">
              Visualizing the "Forgetfulness Curve." Our dashboard keeps your cognitive load balanced and your retention at 98%.
            </p>
          </div>
          
          {/* Circular Metric (Using vocabulary_header logic) */}
          <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-[4px] border-[#22C55E]">
            <div className="flex flex-col items-center">
              <span className="text-[24px] font-[700] text-[#FFFFFF]">85%</span>
              <span className="text-[10px] font-[600] text-[#98989E] uppercase">Neural</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES PROTOCOL */}
      <section id="features" className="max-w-[1100px] mx-auto px-[20px] py-16 border-t border-[#1C1C1E]">
        <div className="mb-12 text-center">
          <h2 className="text-[14px] font-[600] uppercase text-[#636366] mb-2 tracking-widest">The Protocol</h2>
          <h3 className="text-[22px] font-[600] text-[#FFFFFF]">Precision Engineered.</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
          <FeatureCard 
            icon={BrainCircuit}
            title="Active Recall"
            description="Trigger deep retrieval paths. We don't just show cards; we force neural reconstruction."
          />
          <FeatureCard 
            icon={Target}
            title="Visual Anchoring"
            description="Every word is tied to a high-density image, creating a dual-coding effect for instant memory."
          />
          <FeatureCard 
            icon={Layers}
            title="Context Mesh"
            description="Words aren't learned in isolation. We weave them into sentence matrices for natural fluency."
          />
        </div>
      </section>

      {/* CTA SECTION (Applying stats_card alignment) */}
      <section className="max-w-3xl mx-auto px-[20px] py-20">
        <div className="bg-[#1C1C1E] border border-[#3A3A3C] rounded-[24px] p-10 text-center">
          <h2 className="text-[28px] font-[700] mb-4 text-[#FFFFFF]">Achieve Fluency.</h2>
          <p className="text-[#98989E] text-[15px] font-[400] max-w-xs mx-auto mb-8">
            Join the elite circle of learners mastering languages through algorithmic science.
          </p>
          <Link 
            href="/register"
            className="bg-[#22C55E] text-[#FFFFFF] px-10 py-4 rounded-[100px] text-[15px] font-[600] hover:bg-[#16A34A] transition-all inline-block"
          >
            Begin Initialization
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-[#1C1C1E] text-center bg-[#000000]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap size={12} fill="#636366" className="text-[#636366]" />
            <span className="text-[14px] font-[600] text-[#636366] uppercase">Pulse OS © 2026</span>
          </div>
          <div className="flex justify-center gap-6 text-[14px] font-[600] uppercase text-[#636366]">
            <a href="#" className="hover:text-[#22C55E] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#22C55E] transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}