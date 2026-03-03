"use client"

import React from 'react'
import { Bug, Lightbulb, Mail as MailIcon } from 'lucide-react'
import { useLanguage } from '../providers/LanguageProvider'
import { useTheme } from '../providers/ThemeProvider'

export default function IssueReportCard() {
  const { language } = useLanguage()
  const { isDark } = useTheme()

  const subject = language === 'ar' ? 'ملاحظات/مشكلة/ميزة في التطبيق' : 'Feedback / Bug / Feature Request'
  const bodyTemplate = language === 'ar'
    ? 'نوع: (مشكلة / ميزة)\nالوصف:\nالخطوات لإعادة إنتاجها (إن وجدت):\n\nشكرا لك.'
    : 'Type: (Bug / Feature)\nDescription:\nSteps to reproduce (if any):\n\nThanks.'
  const mailTo = `mailto:mezuma.co@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTemplate)}`

  return (
    <div className={`mb-3 rounded-[14px] p-4 border ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${isDark ? 'bg-[#111111]' : 'bg-[#F0F1F3]'}`}>
          <div className="flex items-center gap-1">
            <Bug size={18} className="text-[#EF4444]" />
          </div>
        </div>

        <div className="flex-1">
          <p className={`text-[15px] font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>
            {language === 'ar' ? 'هل وجدت مشكلة أو ترغب بميزة جديدة؟' : 'Found a bug or want a new feature?'}
          </p>
          <p className={`text-[13px] mb-3 ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
            {language === 'ar' ? 'أخبرنا بالمشكلة أو الفكرة وسنعمل على تنفيذها أو إصلاحها.' : 'Tell us the issue or idea and we’ll work to fix or implement it.'}
          </p>

          <a
            href={mailTo}
            aria-label={language === 'ar' ? 'راسلنا' : 'Contact us'}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-[10px] text-[13px] font-bold transition-all active:scale-95 ${isDark ? 'bg-[#3B82F6] text-white' : 'bg-[#3B82F6] text-white'}`}
          >
            <MailIcon size={14} />
            <span>{language === 'ar' ? 'راسلنا' : 'Contact us'}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
