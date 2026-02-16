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
    BarChart3,
    Activity,
    Fingerprint
  } from 'lucide-react'

  // --- Slender Feature Card ---
  function FeatureCard({ icon: Icon, title, description }: any) {
    return (
      <div className="bg-[#0A0A0A] p-6 rounded-[24px] border border-[#1C1C1E] hover:border-emerald-500/30 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 border border-emerald-500/20 group-hover:scale-110 transition-transform">
          <Icon className="text-emerald-500" size={20} />
        </div>
        <h3 className="text-[17px] font-black text-white mb-2">{title}</h3>
        <p className="text-zinc-500 text-[13px] leading-relaxed font-medium">
          {description}
        </p>
      </div>
    )
  }

  export default function LandingPage() {
    return (
      <div className="min-h-screen bg-black text-white antialiased selection:bg-emerald-500/30">
        
        {/* COMPACT NAVIGATION */}
        <nav className="fixed top-0 w-full z-50 border-b border-white/[0.03] bg-black/80 backdrop-blur-xl">
          <div className="max-w-[1100px] mx-auto px-6 h-[64px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Zap size={14} fill="black" className="text-black" />
              </div>
              <span className="text-[16px] font-black tracking-tighter">Linguist<span className="text-emerald-500">Pulse</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
              <a href="#method" className="hover:text-emerald-500 transition-colors">Algorithm</a>
              <a href="#features" className="hover:text-emerald-500 transition-colors">Protocol</a>
            </div>

            <Link 
              href="/login" 
              className="bg-[#121212] text-white px-5 py-2 rounded-full text-[12px] font-black border border-[#1C1C1E] hover:bg-zinc-900 transition-all active:scale-95"
            >
              Enter App
            </Link>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="relative pt-[140px] pb-[80px] overflow-hidden">
          {/* Background Neural Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-emerald-500/5 blur-[120px] pointer-events-none" />
          
          <div className="max-w-[340px] md:max-w-4xl mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20 mb-8">
              <Sparkles size={10} className="text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-500">
                Neural Optimization Active
              </span>
            </div>

            <h1 className="text-[40px] md:text-[68px] font-black leading-[1.05] tracking-tight mb-6">
              Shield your mind <br />
              from <span className="text-rose-600 underline decoration-rose-600/20 underline-offset-8">memory decay.</span>
            </h1>

            <p className="text-zinc-500 text-[14px] md:text-[17px] font-medium max-w-[300px] md:max-w-xl mx-auto mb-10 leading-relaxed">
              Stop losing progress. Our SRS engine triggers reviews at the exact millisecond of forgetfulness.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link 
                href="/register"
                className="w-full sm:w-auto bg-emerald-500 text-black px-8 py-4 rounded-2xl text-[15px] font-black hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/10 active:scale-95"
              >
                Initialize Training <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* COMPACT MOCKUP */}
        <section className="max-w-[340px] md:max-w-[800px] mx-auto px-4 mb-[80px]">
          <div className="relative p-px bg-gradient-to-b from-[#1C1C1E] to-transparent rounded-[32px] overflow-hidden group">
            <div className="bg-[#0A0A0A] rounded-[31px] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3 text-emerald-500">
                  <Activity size={16} />
                  <span className="font-black uppercase tracking-[0.2em] text-[10px]">Real-time Mastery</span>
                </div>
                <h2 className="text-2xl font-black mb-3">Sync Your Synapses.</h2>
                <p className="text-zinc-500 text-[13px] font-medium leading-relaxed">
                  Visualizing the "Forgetfulness Curve." Our dashboard keeps your cognitive load balanced and your retention at 98%.
                </p>
              </div>
              
              {/* Minimal Circular Metric */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-900" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeDashoffset="54.6" className="text-emerald-500" strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black">85%</span>
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter">Neural Link</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES PROTOCOL */}
        <section id="features" className="max-w-[340px] md:max-w-[1100px] mx-auto px-4 py-16 border-t border-white/[0.03]">
          <div className="mb-12 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-2">The Protocol</h2>
            <h3 className="text-2xl font-black italic">Precision Engineered.</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* COMPACT CTA */}
        <section className="max-w-[340px] md:max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="bg-[#0A0A0A] border border-[#1C1C1E] rounded-[32px] p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_#10B98105_0%,_transparent_70%)] pointer-events-none" />
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter italic">Achieve Fluency.</h2>
            <p className="text-zinc-500 text-[14px] font-medium max-w-xs mx-auto mb-8">
              Join the elite circle of learners mastering languages through algorithmic science.
            </p>
            <Link 
              href="/register"
              className="bg-white text-black px-10 py-4 rounded-full text-[14px] font-black hover:bg-zinc-200 transition-all active:scale-95 inline-block"
            >
              Begin Initialization
            </Link>
          </div>
        </section>

        {/* SLENDER FOOTER */}
        <footer className="py-12 border-t border-white/[0.03] text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 opacity-30 grayscale">
              <Zap size={12} fill="white" className="text-white" />
              <span className="text-[10px] font-black tracking-widest uppercase">Pulse OS © 2026</span>
            </div>
            <div className="flex justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-700">
              <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Secure Login</a>
            </div>
          </div>
        </footer>
      </div>
    )
  }