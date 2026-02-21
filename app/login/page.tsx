"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { LogIn } from 'lucide-react'
import { useLanguage } from '../providers/LanguageProvider'
import { useTheme } from '../providers/ThemeProvider'

export default function LoginPage() {
  const router = useRouter()
  const session = useSession()
  const { t, language } = useLanguage()
  const { isDark } = useTheme()
  
  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/cards/learning")
    }
  }, [session.status, router])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError(t('login.errorInvalid'))
        setLoading(false)
      } else {
        router.push('/cards/learning')
        router.refresh()
      }
    } catch (err) {
      setError(t('login.errorGeneric'))
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/cards/learning' })
  }

  // Applied Design System Tokens:
  // background.secondary (#222222), ui_elements.border (#2D2D2F), item_radius (12px)
  const inputStyles = `w-full rounded-[12px] px-4 py-[14px] placeholder-[#6B7280] transition-all duration-200 focus:outline-none focus:border-[#3B82F6] text-[14px] ${isDark ? 'bg-[#222222] border border-[#2D2D2F] text-[#FFFFFF]' : 'bg-white border border-[#E2E4E9] text-[#111827]'}`
  
  // label typography: 11px, Bold, Uppercase
  const labelStyles = "text-[11px] font-bold uppercase tracking-widest text-[#6B7280] ml-1 mb-2 block"

  return (
    // Global background: primary (#121212)
    <main dir={language === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen flex items-center justify-center antialiased p-4 ${isDark ? 'bg-[#121212] text-[#FFFFFF]' : 'bg-[#F8F9FA] text-[#111827]'}`}>
      {/* Brand Blue Glow instead of Emerald */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3B82F608_0%,_transparent_65%)] pointer-events-none" />

      <div className="w-full max-w-[340px] z-10">
        {/* card_radius: 14px, background: primary (#121212) */}
        <div className={`p-6 md:p-8 rounded-[14px] shadow-2xl relative border ${isDark ? 'bg-[#121212] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}>
          
          <header className="mb-8 text-center">
            {/* Primary Blue Muted for secondary container feel */}
            <div className="w-12 h-12 bg-[#1D4ED8]/10 rounded-[12px] flex items-center justify-center border border-[#3B82F6]/20 mx-auto mb-4">
               <LogIn className="text-[#3B82F6]" size={24} />
            </div>
            {/* h1: 19px, Bold */}
            <h1 className="text-[19px] font-bold tracking-tight">{t('login.title')}</h1>
            {/* body_medium: 14px, Regular, secondary text color */}
            <p className="text-[#9CA3AF] mt-1 text-[14px] font-normal">{t('login.subtitle')}</p>
          </header>

          {/* Google Login - Standardized to item_radius 12px */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className={`w-full mb-6 font-bold py-[12px] rounded-[12px] transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-[14px] ${isDark ? 'bg-[#FFFFFF] hover:bg-[#F3F4F6] text-[#000000]' : 'bg-white hover:bg-[#F3F4F6] text-[#111827] border border-[#E2E4E9]'}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t('login.google')}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              {/* divider: #262626 */}
              <span className={`w-full border-t ${isDark ? 'border-[#262626]' : 'border-[#EBEDF0]'}`}></span>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase font-bold tracking-widest">
              <span className={`px-3 text-[#6B7280] ${isDark ? 'bg-[#121212]' : 'bg-white'}`}>{t('login.divider')}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelStyles}>{t('login.email')}</label>
              <div className="relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  type="email"
                  required
                  className={inputStyles}
                />
              </div>
            </div>

            <div>
              <label className={labelStyles}>{t('login.password')}</label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  required
                  className={inputStyles}
                />
              </div>
            </div>

            {/* Primary Button: #3B82F6, radius: 12px */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-[#FFFFFF] font-bold py-[14px] rounded-[12px] transition-all active:scale-[0.98] disabled:opacity-50 text-[15px] mt-2 shadow-lg shadow-[#3B82F6]/10"
            >
              {loading ? t('login.loading') : t('login.submit')}
            </button>

            {error && (
              // Status Color: Error (#EF4444)
              <div className="text-center text-[12px] p-3 rounded-[12px] border bg-[#EF4444]/5 border-[#EF4444]/20 text-[#EF4444] font-bold">
                {error}
              </div>
            )}
          </form>

          {/* Caption text: 12px, Medium, secondary color */}
          <p className="mt-8 text-center text-[12px] text-[#9CA3AF] font-medium">
            {t('login.noAccount')} <Link href="/register" className="text-[#3B82F6] hover:underline font-bold ml-1">{t('login.signUp')}</Link>
          </p>
        </div>
      </div>
    </main>
  )
}