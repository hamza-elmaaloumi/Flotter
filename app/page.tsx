"use client"

import React from 'react'
import Link from 'next/link'
import { 
  Zap, 
  Sparkles, 
  BrainCircuit, 
  Languages, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  BarChart3 
} from 'lucide-react'

// --- Reusable Feature Card Component ---
function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="bg-[#1C1C1E] p-8 rounded-[24px] border border-[#3A3A3C]/30 hover:border-[#22C55E]/50 transition-all group">
      <div className="w-12 h-12 rounded-[16px] bg-[#22C55E]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="text-[#22C55E]" size={24} />
      </div>
      <h3 className="text-[22px] font-[600] text-white mb-3">{title}</h3>
      <p className="text-[#98989E] text-[15px] leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white font-['San_Francisco',_sans-serif] selection:bg-[#22C55E]/30">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#1C1C1E] bg-[#000000]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#22C55E] rounded-lg flex items-center justify-center">
              <Zap size={18} fill="white" className="text-white" />
            </div>
            <span className="text-[20px] font-[700] tracking-tight">Linguist<span className="text-[#22C55E]">Pulse</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[14px] font-[600] text-[#98989E]">
            <a href="#method" className="hover:text-white transition-colors">Methodology</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
          </div>

          <Link 
            href="/auth/signin" 
            className="bg-[#1C1C1E] text-white px-6 py-2.5 rounded-[100px] text-[14px] font-[600] border border-[#3A3A3C] hover:bg-[#2C2C2E] transition-all"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-[180px] pb-[100px] overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#22C55E]/10 to-transparent opacity-50 pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-[#3B82F6]/10 blur-[120px] rounded-full" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1C1E] border border-[#3A3A3C] mb-8 animate-fade-in">
            <Sparkles size={14} className="text-[#FFCC00]" fill="#FFCC00" />
            <span className="text-[12px] font-[700] uppercase tracking-[0.15em] text-[#98989E]">
              Next-Gen Spaced Repetition
            </span>
          </div>

          <h1 className="text-[48px] md:text-[72px] font-[800] leading-[1.1] tracking-tight mb-8">
            Protect your knowledge <br />
            from <span className="text-[#FF453A]">neural decay.</span>
          </h1>

          <p className="text-[#98989E] text-[18px] md:text-[20px] max-w-2xl mx-auto mb-12 leading-relaxed">
            Stop forgetting what you learn. Our algorithm calculates the exact 
            moment your memory fades to trigger the perfect review.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login"
              className="w-full sm:w-auto bg-[#22C55E] text-white px-10 py-5 rounded-[18px] text-[17px] font-[700] hover:bg-[#16A34A] transition-all flex items-center justify-center gap-2 shadow-[0_10px_40px_rgba(34,197,94,0.2)]"
            >
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link 
              href="#method"
              className="w-full sm:w-auto bg-transparent text-white px-10 py-5 rounded-[18px] text-[17px] font-[700] border border-[#3A3A3C] hover:bg-[#1C1C1E] transition-all"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW / MOCKUP */}
      <section className="max-w-6xl mx-auto px-6 mb-[120px]">
        <div className="relative p-4 bg-[#121212] rounded-[32px] border border-[#1C1C1E] shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#22C55E]/5 via-transparent to-transparent pointer-events-none" />
          {/* A visual representation of your ring component */}
          <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4 text-[#22C55E]">
                <CheckCircle2 size={20} />
                <span className="font-[700] uppercase tracking-widest text-[12px]">Dynamic Scheduling</span>
              </div>
              <h2 className="text-[32px] font-[700] mb-4">Mastery via Momentum.</h2>
              <p className="text-[#98989E] text-[17px]">
                Your dashboard shows your daily objective. When the ring is red, your memory is at risk. 
                When it's green, your neural pathways are synced.
              </p>
            </div>
            <div className="relative w-[200px] h-[200px] border-[12px] border-[#1C1C1E] rounded-full flex flex-col items-center justify-center">
              <div className="absolute inset-0 border-[12px] border-[#22C55E] rounded-full border-t-transparent -rotate-45" />
              <span className="text-[40px] font-[800]">84%</span>
              <span className="text-[11px] font-[700] text-[#98989E] uppercase tracking-widest">Mastery</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-[100px] border-t border-[#1C1C1E]">
        <div className="text-center mb-16">
          <h2 className="text-[32px] font-[700] mb-4">Designed for Deep Learning</h2>
          <p className="text-[#98989E]">Everything you need to move vocabulary from short-term to long-term memory.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={BrainCircuit}
            title="Active Recall"
            description="Force your brain to retrieve information rather than just recognizing it, strengthening synaptic connections."
          />
          <FeatureCard 
            icon={Target}
            title="Visual Context"
            description="Attach every card to a visual anchor. We use image-based learning to double your retention speed."
          />
          <FeatureCard 
            icon={Layers}
            title="Context Variations"
            description="Learn how words behave in different sentences, not just in isolation. Master the nuance of language."
          />
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-6 py-[120px]">
        <div className="bg-[#1C1C1E] rounded-[32px] p-12 text-center border border-[#3A3A3C] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <h2 className="text-[36px] md:text-[42px] font-[800] mb-6">Ready to reach <br /><span className="text-[#22C55E]">Fluency?</span></h2>
          <p className="text-[#98989E] text-[18px] max-w-xl mx-auto mb-10">
            Join thousands of learners who are mastering languages using the 
            science of spaced repetition.
          </p>
          
          <Link 
            href="/login"
            className="inline-flex items-center gap-3 bg-white text-black px-12 py-5 rounded-[100px] text-[17px] font-[700] hover:bg-[#E5E5E5] transition-all active:scale-95"
          >
            Start Your Journey Now
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-[#1C1C1E] text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-6 h-6 bg-[#3A3A3C] rounded flex items-center justify-center">
            <Zap size={12} fill="white" className="text-white" />
          </div>
          <span className="text-[14px] font-[700] tracking-tight text-[#636366]">LinguistPulse © 2024</span>
        </div>
        <div className="flex justify-center gap-8 text-[13px] font-[600] text-[#636366]">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  )
}