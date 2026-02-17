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
import AdBanner from './components/AdBanner'
import { useLanguage } from './providers/LanguageProvider'

// --- Feature Card (Mapping to card.standard_card tokens) ---
function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    /* bg: #1C1C1E | border: #2D2D2F | radius: 14px */
    <div className="bg-[#1C1C1E] p-[20px] rounded-[14px] border border-[#2D2D2F] hover:border-[#3B82F6] transition-all group relative overflow-hidden">
      {/* Icon Container: item_radius (12px) | Primary Blue: #3B82F6 */}
      <div className="w-10 h-10 rounded-[12px] bg-[#3B82F6]/10 flex items-center justify-center mb-5 border border-[#3B82F6]/20 group-hover:scale-110 transition-transform">
        <Icon className="text-[#3B82F6]" size={20} />
      </div>
      {/* title: h2 (16px Bold) */}
      <h3 className="text-[16px] font-bold text-[#FFFFFF] mb-2">{title}</h3>
      {/* body_medium: 14px Regular | text.secondary: #9CA3AF */}
      <p className="text-[#9CA3AF] text-[14px] leading-relaxed font-normal">
        {description}
      </p>
    </div>
  )
}

export default function LandingPage() {
  const { t, language } = useLanguage()

  return (
    /* Global bg: #121212 */
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#121212] text-[#FFFFFF] antialiased selection:bg-[#3B82F6]/30">

      {/* NAVIGATION (Aligned with Header design) */}
      <nav dir="ltr" className="fixed top-0 w-full z-50 border-b border-[#262626] bg-[#121212]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-[16px] h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#3B82F6] rounded-[8px] flex items-center justify-center">
              <Zap size={16} fill="#FFFFFF" className="text-[#FFFFFF]" />
            </div>
            {/* Logo: H2 (16px Bold) */}
            <span className="text-[16px] font-bold tracking-tight text-[#FFFFFF]">
              iStoria<span className="text-[#3B82F6]">Pulse</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">
            <a href="#method" className="hover:text-[#3B82F6] transition-colors">{t('landing.navAlgorithm')}</a>
            <a href="#features" className="hover:text-[#3B82F6] transition-colors">{t('landing.navProtocol')}</a>
          </div>

          <Link 
            href="/login" 
            className="bg-[#222222] text-[#FFFFFF] px-5 py-2 rounded-[12px] text-[14px] font-semibold border border-[#2D2D2F] hover:bg-[#2D2D2F] transition-all"
          >
            {t('landing.enterApp')}
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-[140px] pb-[80px] px-[20px]">
        {/* Visual Asset: Brand Blue Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[#3B82F6]/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[12px] bg-[#1C1C1E] border border-[#3B82F6]/30 mb-8">
            <Sparkles size={12} className="text-[#FBBF24]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#FBBF24]">
              {t('landing.badge')}
            </span>
          </div>

          {/* Large Hero Title (Custom 48px for Landing, using bold system weight) */}
          <h1 className="text-[32px] md:text-[56px] font-bold leading-[1.1] mb-6 text-[#FFFFFF]">
            {t('landing.heroTitle1')} <br />
            {t('landing.heroTitle2')} <span className="text-[#EF4444]">{t('landing.heroTitle3')}</span>
          </h1>

          {/* body_large: 15px | text.secondary: #9CA3AF */}
          <p className="text-[#9CA3AF] text-[15px] font-normal max-w-xl mx-auto mb-10 leading-relaxed">
            {t('landing.heroSub')}
          </p>

          <div className="flex justify-center">
            <Link 
              href="/register"
              className="bg-[#3B82F6] text-[#FFFFFF] px-[32px] py-[16px] rounded-[12px] text-[15px] font-bold hover:bg-[#1D4ED8] transition-all flex items-center gap-2 shadow-lg shadow-[#3B82F6]/20"
            >
              {t('landing.cta')} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <AdBanner dataAdSlot="6974039515" />

      {/* INTERACTIVE MOCKUP (Applying interactive_card tokens) */}
      <section className="max-w-[800px] mx-auto px-[20px] mb-[80px]">
        <div className="bg-[#1C1C1E] rounded-[14px] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 border border-[#2D2D2F]">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3 text-[#3B82F6]">
              <Activity size={18} />
              <span className="font-bold uppercase text-[11px] tracking-widest">{t('landing.realtimeMastery')}</span>
            </div>
            <h2 className="text-[19px] font-bold mb-3 text-[#FFFFFF]">{t('landing.syncSynapses')}</h2>
            <p className="text-[#9CA3AF] text-[14px] font-normal leading-relaxed">
              {t('landing.syncDesc')}
            </p>
          </div>
          
          {/* Circular Metric (vocabulary_header logic) */}
          <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-[6px] border-[#3B82F6] border-t-[#222222]">
            <div className="flex flex-col items-center">
              <span className="text-[24px] font-bold text-[#FFFFFF]">85%</span>
              <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">{t('landing.neural')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES PROTOCOL */}
      <section id="features" className="max-w-5xl mx-auto px-[16px] py-16 border-t border-[#262626]">
        <div className="mb-12 text-center">
          <h2 className="text-[11px] font-bold uppercase text-[#6B7280] mb-2 tracking-widest">{t('landing.theProtocol')}</h2>
          <h3 className="text-[19px] font-bold text-[#FFFFFF]">{t('landing.precisionEngineered')}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          <FeatureCard 
            icon={BrainCircuit}
            title={t('landing.activeRecall')}
            description={t('landing.activeRecallDesc')}
          />
          <FeatureCard 
            icon={Target}
            title={t('landing.visualAnchoring')}
            description={t('landing.visualAnchoringDesc')}
          />
          <FeatureCard 
            icon={Layers}
            title={t('landing.contextMesh')}
            description={t('landing.contextMeshDesc')}
          />
        </div>
      </section>

      {/* CTA SECTION (Applying stats_card radius/padding) */}
      <section className="max-w-3xl mx-auto px-[20px] py-20">
        <div className="bg-[#1C1C1E] border border-[#2D2D2F] rounded-[14px] p-10 text-center">
          <h2 className="text-[28px] font-bold mb-4 text-[#FFFFFF]">{t('landing.achieveFluency')}</h2>
          <p className="text-[#9CA3AF] text-[14px] font-normal max-w-xs mx-auto mb-8">
            {t('landing.achieveFluencyDesc')}
          </p>
          <Link 
            href="/register"
            className="bg-[#3B82F6] text-[#FFFFFF] px-10 py-4 rounded-[12px] text-[15px] font-bold hover:bg-[#1D4ED8] transition-all inline-block"
          >
            {t('landing.beginInit')}
          </Link>
        </div>
      </section>

      {/* FOOTER (Aligned with Caption System) */}
      <footer className="py-12 border-t border-[#262626] text-center bg-[#121212]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap size={12} className="text-[#6B7280]" />
            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">iStoria OS © 2026</span>
          </div>
          <div className="flex justify-center gap-6 text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">
            <a href="#" className="hover:text-[#3B82F6] transition-colors">{t('landing.privacy')}</a>
            <a href="#" className="hover:text-[#3B82F6] transition-colors">{t('landing.terms')}</a>
          </div>
        </div>
      </footer>
    </div>
  )
}