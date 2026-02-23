"use client"

import React, { useState } from "react"
import { ChevronDown, ExternalLink, Globe, Sun, Moon } from "lucide-react"
import { useLanguage } from "../providers/LanguageProvider"
import { useTheme } from "../providers/ThemeProvider"

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme, isDark } = useTheme()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  const items: { title: string; content: React.ReactNode }[] = [
    {
      title: t('settings.xpTitle'),
      content: (
        <div className={`space-y-4 text-[14px] font-normal leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
          <section>
            <p className={`font-bold mb-2 uppercase text-[11px] tracking-wider ${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}`}>{t('settings.xp.howTitle')}</p>
            <p className="mb-2">{t('settings.xp.howIntro')}</p>
            <ul className="list-disc pl-5 space-y-2 text-[13px]">
              <li><span className="text-[#3B82F6] font-bold">+10 XP</span>: {t('settings.xp.perfect')}</li>
              <li><span className="text-[#FACC15] font-bold">+5 XP</span>: {t('settings.xp.audio')}</li>
              <li><span className="text-[#10B981] font-bold">+50 XP</span>: {t('settings.xp.builder')}</li>
              <li className="italic text-[#6B7280]">{t('settings.xp.note')}</li>
            </ul>
          </section>

          <section className={`pt-2 border-t ${isDark ? 'border-[#262626]' : 'border-[#EBEDF0]'}`}>
            <p className={`font-bold mb-2 uppercase text-[11px] tracking-wider ${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}`}>{t('settings.xp.climbTitle')}</p>
            <p className="mb-2">{t('settings.xp.climbIntro')}</p>
            <ul className="space-y-2 text-[13px]">
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6]">1.</span>
                <span><span className={`font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{t('settings.xp.tip1Title')}</span> {t('settings.xp.tip1Desc')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6]">2.</span>
                <span><span className={`font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{t('settings.xp.tip2Title')}</span> {t('settings.xp.tip2Desc')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6]">3.</span>
                <span><span className={`font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{t('settings.xp.tip3Title')}</span> {t('settings.xp.tip3Desc')}</span>
              </li>
            </ul>
          </section>
        </div>
      ),
    },
    {
      title: t('settings.guideTitle'),
      content: (
        <div className={`space-y-3 text-[14px] font-normal leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
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
        <div className={`space-y-3 text-[14px] font-normal ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
          <p>{t('settings.support.text')}</p>
          <div className={`p-4 rounded-[12px] border ${isDark ? 'bg-[#121212] border-[#2D2D2F]' : 'bg-[#F0F1F3] border-[#E2E4E9]'}`}>
            <p className="text-[11px] font-bold uppercase text-[#6B7280] mb-1">{t('settings.support.emailLabel')}</p>
            <a className="text-[#3B82F6] font-semibold flex items-center gap-2" href="mailto:support@flotter.app">
              support@flotter.app <ExternalLink size={14} />
            </a>
          </div>
        </div>
      ),
    },
    {
      title: t('settings.legalTitle'),
      content: (
        <div className={`space-y-4 text-[14px] font-normal ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
          <section>
            <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{t('settings.legal.publisher')}</h3>
            <p className="whitespace-pre-line">{t('settings.legal.publisherDesc')}</p>
          </section>
          <section>
            <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{t('settings.legal.tax')}</h3>
            <p>{t('settings.legal.taxDesc')}</p>
          </section>
          <section>
            <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{t('settings.legal.hosting')}</h3>
            <p className="whitespace-pre-line">{t('settings.legal.hostingDesc')}</p>
          </section>
          <section>
            <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{t('settings.legal.compliance')}</h3>
            <p>{t('settings.legal.complianceDesc')}</p>
          </section>
        </div>
      ),
    },
    {
      title: t('settings.privacyTitle'),
      content: (
        <div className={`space-y-4 text-[14px] font-normal ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
          <section>
            <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{t('settings.privacy.entity')}</h3>
            <p>{t('settings.privacy.entityDesc')}</p>
          </section>
          <section>
            <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{t('settings.privacy.cndp')}</h3>
            <p className="whitespace-pre-line">{t('settings.privacy.cndpDesc')}</p>
          </section>
          <section>
            <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{t('settings.privacy.collection')}</h3>
            <p>{t('settings.privacy.collectionDesc')}</p>
          </section>
          <section>
            <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{t('settings.privacy.storage')}</h3>
            <p>{t('settings.privacy.storageDesc')}</p>
          </section>
          <section>
            <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{t('settings.privacy.rights')}</h3>
            <p>{t('settings.privacy.rightsDesc')}</p>
          </section>
        </div>
      ),
    },
    {
      title: t('settings.termsTitle'),
      content: (
        <div className={`space-y-4 text-[14px] font-normal ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
          <section>
            <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{t('settings.terms.contract')}</h3>
            <p>{t('settings.terms.contractDesc')}</p>
          </section>
          <section>
            <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{t('settings.terms.merchant')}</h3>
            <p>{t('settings.terms.merchantDesc')}</p>
          </section>
          <section>
            <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{t('settings.terms.refund')}</h3>
            <p>{t('settings.terms.refundDesc')}</p>
          </section>
          <section>
            <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{t('settings.terms.rules')}</h3>
            <p>{t('settings.terms.rulesDesc')}</p>
          </section>
          <section>
            <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{t('settings.terms.jurisdiction')}</h3>
            <p>{t('settings.terms.jurisdictionDesc')}</p>
          </section>
        </div>
      ),
    },
  ]

  return (
    <main dir={language === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen flex flex-col items-center p-4 antialiased ${isDark ? 'bg-[#121212]' : 'bg-[#F8F9FA]'}`}>
      <div className="w-full max-w-md">
        <h1 className={`text-[22px] font-bold mb-8 mt-6 ${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}`}>{t('settings.title')}</h1>

        {/* Language Switcher */}
        <section className={`rounded-[12px] mb-3 p-4 border ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-[8px] border flex items-center justify-center ${isDark ? 'bg-[#121212] border-[#2D2D2F]' : 'bg-[#F0F1F3] border-[#E2E4E9]'}`}>
                <Globe size={16} className="text-[#3B82F6]" />
              </div>
              <span className={`text-[16px] font-semibold ${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}`}>{t('settings.language')}</span>
            </div>
            <div className={`flex rounded-[10px] overflow-hidden border ${isDark ? 'bg-[#121212] border-[#2D2D2F]' : 'bg-[#F0F1F3] border-[#E2E4E9]'}`}>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-1.5 text-[13px] font-bold transition-all ${
                  language === 'en'
                    ? 'bg-[#3B82F6] text-white'
                    : isDark ? 'text-[#9CA3AF] hover:text-white' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                {t('settings.langEn')}
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-4 py-1.5 text-[13px] font-bold transition-all ${
                  language === 'ar'
                    ? 'bg-[#3B82F6] text-white'
                    : isDark ? 'text-[#9CA3AF] hover:text-white' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                {t('settings.langAr')}
              </button>
            </div>
          </div>
        </section>

        {/* Theme Switcher */}
        <section className={`rounded-[12px] mb-3 p-4 border ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-[8px] border flex items-center justify-center ${isDark ? 'bg-[#121212] border-[#2D2D2F]' : 'bg-[#F0F1F3] border-[#E2E4E9]'}`}>
                {isDark ? <Moon size={16} className="text-[#3B82F6]" /> : <Sun size={16} className="text-[#D97706]" />}
              </div>
              <span className={`text-[16px] font-semibold ${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}`}>{t('settings.theme')}</span>
            </div>
            <div className={`flex rounded-[10px] overflow-hidden border ${isDark ? 'bg-[#121212] border-[#2D2D2F]' : 'bg-[#F0F1F3] border-[#E2E4E9]'}`}>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-1.5 text-[13px] font-bold transition-all flex items-center gap-1.5 ${
                  theme === 'dark'
                    ? 'bg-[#3B82F6] text-white'
                    : isDark ? 'text-[#9CA3AF] hover:text-white' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                <Moon size={12} />
                {t('settings.themeDark')}
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-1.5 text-[13px] font-bold transition-all flex items-center gap-1.5 ${
                  theme === 'light'
                    ? 'bg-[#3B82F6] text-white'
                    : isDark ? 'text-[#9CA3AF] hover:text-white' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                <Sun size={12} />
                {t('settings.themeLight')}
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
                className={`rounded-[12px] transition-all duration-200 ease-in-out border ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}
              >
                <button
                  onClick={() => toggle(i)}
                  className={`w-full h-[48px] flex items-center justify-between px-6 text-left focus:outline-none ${
                    isOpen ? isDark ? "bg-[#222222]/50" : "bg-[#F0F1F3]/50" : ""
                  }`}
                >
                  <span className={`text-[16px] font-semibold ${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}`}>{it.title}</span>
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
                    <div className={`px-6 pb-6 pt-2 border-t ${isDark ? 'border-[#262626]' : 'border-[#EBEDF0]'}`}>
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