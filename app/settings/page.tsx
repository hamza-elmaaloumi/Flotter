"use client"

import React, { useState } from "react"
import { ChevronDown, ExternalLink, Globe } from "lucide-react"
import { useLanguage } from "../providers/LanguageProvider"

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  const items: { title: string; content: React.ReactNode }[] = [
    {
      title: t('settings.xpTitle'),
      content: (
        <div className="space-y-4 text-[14px] font-normal text-[#9CA3AF] leading-relaxed">
          <section>
            <p className="font-bold text-[#FFFFFF] mb-2 uppercase text-[11px] tracking-wider">{t('settings.xp.howTitle')}</p>
            <p className="mb-2">{t('settings.xp.howIntro')}</p>
            <ul className="list-disc pl-5 space-y-2 text-[13px]">
              <li><span className="text-[#3B82F6] font-bold">+10 XP</span>: {t('settings.xp.perfect')}</li>
              <li><span className="text-[#FACC15] font-bold">+5 XP</span>: {t('settings.xp.audio')}</li>
              <li><span className="text-[#10B981] font-bold">+50 XP</span>: {t('settings.xp.builder')}</li>
              <li className="italic text-[#6B7280]">{t('settings.xp.note')}</li>
            </ul>
          </section>

          <section className="pt-2 border-t border-[#262626]">
            <p className="font-bold text-[#FFFFFF] mb-2 uppercase text-[11px] tracking-wider">{t('settings.xp.climbTitle')}</p>
            <p className="mb-2">{t('settings.xp.climbIntro')}</p>
            <ul className="space-y-2 text-[13px]">
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6]">1.</span>
                <span><span className="text-white font-semibold">{t('settings.xp.tip1Title')}</span> {t('settings.xp.tip1Desc')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6]">2.</span>
                <span><span className="text-white font-semibold">{t('settings.xp.tip2Title')}</span> {t('settings.xp.tip2Desc')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6]">3.</span>
                <span><span className="text-white font-semibold">{t('settings.xp.tip3Title')}</span> {t('settings.xp.tip3Desc')}</span>
              </li>
            </ul>
          </section>
        </div>
      ),
    },
    {
      title: t('settings.guideTitle'),
      content: (
        <div className="space-y-3 text-[14px] font-normal text-[#9CA3AF] leading-relaxed">
          <p>{t('settings.guide.intro')}</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t('settings.guide.tip1')}</li>
            <li>{t('settings.guide.tip2')}</li>
            <li>{t('settings.guide.tip3')}</li>
            <li>{t('settings.guide.tip4')}</li>
          </ul>
        </div>
      ),
    },
    {
      title: t('settings.supportTitle'),
      content: (
        <div className="space-y-3 text-[14px] font-normal text-[#9CA3AF]">
          <p>{t('settings.support.text')}</p>
          <div className="p-4 rounded-[12px] bg-[#121212] border border-[#2D2D2F]">
            <p className="text-[11px] font-bold uppercase text-[#6B7280] mb-1">{t('settings.support.emailLabel')}</p>
            <a className="text-[#3B82F6] font-semibold flex items-center gap-2" href="mailto:support@flotter.app">
              support@flotter.app <ExternalLink size={14} />
            </a>
          </div>
        </div>
      ),
    },
    {
      title: t('settings.termsTitle'),
      content: (
        <div className="text-[14px] font-normal text-[#9CA3AF]">
          <p>{t('settings.terms.text')}</p>
        </div>
      ),
    },
    {
      title: t('settings.privacyTitle'),
      content: (
        <div className="text-[14px] font-normal text-[#9CA3AF]">
          <p>{t('settings.privacy.text')}</p>
        </div>
      ),
    },
  ]

  return (
    <main dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#121212] flex flex-col items-center p-4 antialiased">
      <div className="w-full max-w-md">
        <h1 className="text-[22px] font-bold text-[#FFFFFF] mb-8 mt-6">{t('settings.title')}</h1>

        {/* Language Switcher */}
        <section className="bg-[#1C1C1E] border border-[#2D2D2F] rounded-[12px] mb-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[8px] bg-[#121212] border border-[#2D2D2F] flex items-center justify-center">
                <Globe size={16} className="text-[#3B82F6]" />
              </div>
              <span className="text-[16px] font-semibold text-[#FFFFFF]">{t('settings.language')}</span>
            </div>
            <div className="flex bg-[#121212] border border-[#2D2D2F] rounded-[10px] overflow-hidden">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-1.5 text-[13px] font-bold transition-all ${
                  language === 'en'
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                {t('settings.langEn')}
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-4 py-1.5 text-[13px] font-bold transition-all ${
                  language === 'ar'
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                {t('settings.langAr')}
              </button>
            </div>
          </div>
        </section>
        
        <div className="flex flex-col gap-3">
          {items.map((it, i) => {
            const isOpen = openIndex === i
            return (
              <section 
                key={i} 
                className="bg-[#1C1C1E] border border-[#2D2D2F] rounded-[12px] transition-all duration-200 ease-in-out"
              >
                <button
                  onClick={() => toggle(i)}
                  className={`w-full h-[48px] flex items-center justify-between px-6 text-left focus:outline-none ${
                    isOpen ? "bg-[#222222]/50" : ""
                  }`}
                >
                  <span className="text-[16px] font-semibold text-[#FFFFFF]">{it.title}</span>
                  <ChevronDown
                    size={20}
                    className={`text-[#6B7280] transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#3B82F6]" : "rotate-0"
                    }`}
                  />
                </button>
                
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-2 border-t border-[#262626]">
                      {it.content}
                    </div>
                  </div>
                </div>
              </section>
            )
          })}
        </div>

        <footer className="mt-16 text-center">
          <p className="text-[11px] font-bold text-[#48484A] uppercase tracking-[0.2em]">
            {t('settings.footer')}
          </p>
        </footer>
      </div>
    </main>
  )
}