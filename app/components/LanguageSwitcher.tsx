"use client"

import { useLanguage } from '../providers/LanguageProvider'
import { useTheme } from '../providers/ThemeProvider'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage()
  const { isDark } = useTheme()

  return (
    <button
      type="button"
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[12px] font-bold uppercase tracking-wider transition-all active:scale-95 border ${
        isDark
          ? 'bg-[#222222] border-[#2D2D2F] text-[#9CA3AF] hover:text-[#FFFFFF] hover:border-[#3B82F6]/50'
          : 'bg-white border-[#E2E4E9] text-[#6B7280] hover:text-[#111827] hover:border-[#3B82F6]/50'
      } ${className}`}
      aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Globe size={14} />
      {language === 'en' ? <span style={{ fontFamily: 'var(--font-cairo), Arial, sans-serif' }}>العربية</span> : 'English'}
    </button>
  )
}
