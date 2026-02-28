"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { useForm } from "react-hook-form"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { UserPlus, Sparkles } from "lucide-react"
import { useLanguage } from '../providers/LanguageProvider'
import { useTheme } from '../providers/ThemeProvider'
import LanguageSwitcher from '../components/LanguageSwitcher'

type FormData = {
  email: string
  password: string
}

export default function RegisterPage() {
  const router = useRouter()
  const session = useSession()
  const { t, language } = useLanguage()
  const { isDark } = useTheme()

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/cards/learning")
    }
  }, [session.status, router])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { email: "", password: "" } })

  const [message, setMessage] = useState<string | null>(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  async function onSubmit(data: FormData) {
    setMessage(null)
    if (!acceptedTerms) {
      setMessage(t('register.termsRequired'))
      return
    }
    try {
      const res = await axios.post("/api/auth/register", data)
      
      if (res.status === 201) {
        setMessage(t('register.success'))
        const result = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        })

        if (!result?.error) {
          router.push('/cards/learning')
          router.refresh()
        } else {
          setMessage(t('register.loginFailed'))
        }
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.error || err?.message || "Registration failed"
      setMessage(String(errMsg))
    }
  }

  // Applied Design System Tokens:
  // background.secondary (#222222), ui_elements.border (#2D2D2F), item_radius (12px)
  const inputStyles = `w-full rounded-[12px] px-4 py-[14px] placeholder-[#6B7280] transition-all duration-200 focus:outline-none focus:border-[#3B82F6] text-[14px] ${isDark ? 'bg-[#222222] border border-[#2D2D2F] text-[#FFFFFF]' : 'bg-white border border-[#E2E4E9] text-[#111827]'}`
  
  // label typography: 11px, Bold, Uppercase
  const labelStyles = "text-[11px] font-bold uppercase tracking-widest text-[#6B7280] ml-1 mb-2 block"

  return (
    // Global background: primary (#121212)
    <main dir={language === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen flex items-center justify-center antialiased p-4 ${isDark ? 'bg-[#121212] text-[#FFFFFF]' : 'bg-[#F8F9FA] text-[#111827]'}`}>
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>
      {/* Brand Blue Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#3B82F608_0%,_transparent_65%)] pointer-events-none" />

      <div className="w-full max-w-[340px] z-10">
        {/* card_radius: 14px, background: primary (#121212) */}
        <div className={`p-6 md:p-8 rounded-[14px] shadow-2xl relative border ${isDark ? 'bg-[#121212] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}>
          
          <header className="mb-8 text-center">
            {/* Primary Blue Muted for icon container */}
            <div className="w-12 h-12 bg-[#1D4ED8]/10 rounded-[12px] flex items-center justify-center border border-[#3B82F6]/20 mx-auto mb-4">
               <UserPlus className="text-[#3B82F6]" size={24} />
            </div>
            {/* h1: 19px, Bold */}
            <h1 className="text-[19px] font-bold tracking-tight">{t('register.title')}</h1>
            {/* body_medium: 14px, Regular, secondary text color (#9CA3AF) */}
            <p className="text-[#9CA3AF] mt-1 text-[14px] font-normal">{t('register.subtitle')}</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className={labelStyles}>{t('register.email')}</label>
              <input
                type="email"
                placeholder="name@example.com"
                {...register("email", { required: t('register.emailRequired') })}
                className={inputStyles}
              />
              {errors.email && (
                // Status Color: Error (#EF4444), Label typography
                <p className="text-[11px] text-[#EF4444] mt-1.5 ml-1 font-bold uppercase tracking-wider">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className={labelStyles}>{t('register.password')}</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", { required: t('register.passwordRequired') })}
                className={inputStyles}
              />
              {errors.password && (
                <p className="text-[11px] text-[#EF4444] mt-1.5 ml-1 font-bold uppercase tracking-wider">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[#3B82F6] cursor-pointer"
              />
              <label htmlFor="acceptTerms" className="text-[12px] text-[#9CA3AF] leading-relaxed cursor-pointer">
                {t('register.acceptTerms')}{' '}
                <Link href="/legal/terms" className="text-[#3B82F6] hover:underline font-semibold" target="_blank">{t('register.termsLink')}</Link>
                {' '}{t('register.andThe')}{' '}
                <Link href="/legal/privacy" className="text-[#3B82F6] hover:underline font-semibold" target="_blank">{t('register.privacyLink')}</Link>
              </label>
            </div>

            {/* Primary Button: #3B82F6, radius: 12px */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-[#FFFFFF] font-bold py-[14px] rounded-[12px] transition-all active:scale-[0.98] disabled:opacity-50 text-[15px] mt-2 shadow-lg shadow-[#3B82F6]/10 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              {isSubmitting ? t('register.loading') : t('register.submit')}
            </button>

            {message && (
              <div className={`text-center text-[12px] p-3 rounded-[12px] border font-bold animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                message.includes("failed") 
                ? "bg-[#EF4444]/5 border-[#EF4444]/20 text-[#EF4444]" 
                : "bg-[#10B981]/5 border-[#10B981]/20 text-[#10B981]" // Success color: #10B981
              }`}>
                {message}
              </div>
            )}
          </form>

          {/* Caption text: 12px, Medium, secondary color (#9CA3AF) */}
          <p className="mt-8 text-center text-[12px] text-[#9CA3AF] font-medium">
            {t('register.hasAccount')} <Link href="/login" className="text-[#3B82F6] hover:underline font-bold ml-1">{t('register.signIn')}</Link>
          </p>
        </div>
      </div>
    </main>
  )
}