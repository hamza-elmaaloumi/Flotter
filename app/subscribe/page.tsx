"use client"

import React, { useState } from 'react'
import axios from 'axios'
import { useLanguage } from '../providers/LanguageProvider'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Sparkles,
  Zap,
  Shield,
  Flame,
  Crown,
  Check,
  ChevronLeft,
  Loader2,
  Ban,
  Infinity
} from 'lucide-react'

export default function SubscribePage() {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const res = await axios.post('/api/checkout')
      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl
      }
    } catch (err) {
      console.error('Checkout error', err)
      setLoading(false)
    }
  }

  if (success === 'true') {
    return (
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#121212] text-[#FFFFFF] antialiased flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-[#10B981]/10 rounded-full flex items-center justify-center border-2 border-[#10B981]/20">
              <Check size={48} className="text-[#10B981]" strokeWidth={3} />
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-[#10B981]/5 animate-ping" />
          </div>

          <h1 className="text-[24px] font-bold mb-3">{t('subscribe.successTitle')}</h1>
          <p className="text-[#9CA3AF] text-[14px] mb-8 leading-relaxed">
            {t('subscribe.successDesc')}
          </p>

          <Link
            href="/cards/learning"
            className="inline-flex items-center gap-2 bg-[#10B981] text-[#000000] px-8 py-4 rounded-[12px] font-bold text-[14px] transition-all active:scale-95"
          >
            <Sparkles size={16} fill="currentColor" />
            {t('subscribe.startLearning')}
          </Link>
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: Infinity,
      title: t('subscribe.feat1Title'),
      description: t('subscribe.feat1Desc'),
      freeLimit: t('subscribe.feat1Free'),
      proLimit: t('subscribe.feat1Pro'),
    },
    {
      icon: Ban,
      title: t('subscribe.feat2Title'),
      description: t('subscribe.feat2Desc'),
      freeLimit: t('subscribe.feat2Free'),
      proLimit: t('subscribe.feat2Pro'),
    },
    {
      icon: Shield,
      title: t('subscribe.feat3Title'),
      description: t('subscribe.feat3Desc'),
      freeLimit: t('subscribe.feat3Free'),
      proLimit: t('subscribe.feat3Pro'),
    },
    {
      icon: Flame,
      title: t('subscribe.feat4Title'),
      description: t('subscribe.feat4Desc'),
      freeLimit: t('subscribe.feat4Free'),
      proLimit: t('subscribe.feat4Pro'),
    },
    {
      icon: Crown,
      title: t('subscribe.feat5Title'),
      description: t('subscribe.feat5Desc'),
      freeLimit: t('subscribe.feat5Free'),
      proLimit: t('subscribe.feat5Pro'),
    },
  ]

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#121212] text-[#FFFFFF] antialiased pb-[100px]">
      {/* Header */}
      <header dir="ltr" className="sticky top-0 z-20 bg-[#121212]/80 backdrop-blur-xl border-b border-[#262626] px-4 h-[64px] flex items-center">
        <Link href="/cards/learning" className="p-1 text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors">
          <ChevronLeft size={24} />
        </Link>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20 mb-4">
            <Crown size={14} className="text-[#FACC15]" fill="currentColor" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#FACC15]">{t('subscribe.flotterPro')}</span>
          </div>

          <h1 className="text-[28px] md:text-[36px] font-bold leading-tight tracking-tight mb-4">
            {t('subscribe.heroTitle1')}<br />
            <span className="text-[#FACC15]">{t('subscribe.heroTitle2')}</span>
          </h1>

          <p className="text-[#9CA3AF] text-[14px] leading-relaxed max-w-sm mx-auto">
            {t('subscribe.heroDesc1')}<span className="text-[#FFFFFF] font-bold">{t('subscribe.heroPrice')}</span>{t('subscribe.heroDesc2')}
          </p>
        </div>

        {/* Price Card */}
        <div className="relative overflow-hidden bg-[#1C1C1E] border border-[#FACC15]/20 rounded-[20px] p-6 mb-8">
          <div className="absolute top-[-40px] right-[-40px] w-[160px] h-[160px] blur-[80px] rounded-full bg-[#FACC15]/10" />

          <div className="relative z-10 flex items-end gap-1 mb-1">
            <span className="text-[48px] font-bold text-[#FFFFFF] leading-none">{t('subscribe.price')}</span>
            <span className="text-[16px] text-[#6B7280] font-medium mb-2">{t('subscribe.perMonth')}</span>
          </div>
          <p className="text-[#9CA3AF] text-[13px] mb-6">
            {t('subscribe.priceSubtext')}
          </p>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-[#FACC15] text-[#000000] py-4 rounded-[12px] font-bold text-[14px] transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(250,204,21,0.15)]"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Zap size={16} fill="currentColor" />
                {t('subscribe.subscribeNow')}
              </>
            )}
          </button>
        </div>

        {/* Features Comparison */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] px-1 mb-4">
            {t('subscribe.whatYouGet')}
          </h3>

          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-[#1C1C1E] border border-[#2D2D2F] rounded-[14px] p-4 transition-all hover:border-[#FACC15]/20"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-[#FACC15]/10 border border-[#FACC15]/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon size={18} className="text-[#FACC15]" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-[#FFFFFF] mb-0.5">{feature.title}</p>
                  <p className="text-[12px] text-[#9CA3AF] leading-relaxed mb-2">{feature.description}</p>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-[#EF4444]/60 line-through">{t('subscribe.free')}: {feature.freeLimit}</span>
                    <span className="text-[#10B981]">{t('subscribe.pro')}: {feature.proLimit}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-[#6B7280] text-[12px] leading-relaxed mb-4">
            {t('subscribe.bottomMsg1')}<br />
            {t('subscribe.bottomMsg2')}
          </p>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-[#FACC15] text-[#000000] px-8 py-4 rounded-[12px] font-bold text-[14px] transition-all active:scale-[0.97] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Crown size={16} fill="currentColor" />
                {t('subscribe.getProBtn')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
