"use client"

import Link from 'next/link'
import { useUser } from '../providers/UserProvider'
import { useLanguage } from '../providers/LanguageProvider'
import { useTheme } from '../providers/ThemeProvider'
import { User, Layers, LifeBuoy, Settings, Trophy } from 'lucide-react'
import FlotterLogo from './FlotterLogo'

export default function Header() {
  const { user, isLoading } = useUser()
  const { t } = useLanguage()
  const { isDark } = useTheme()

  return (
    // Applied: primary background (#121212) and divider color (#262626)
    // Height: Not explicitly in JSON for header, but set to 64px to match Nav Bar consistency
    <header className={`fixed top-0 left-0 right-0 z-[100] h-[64px] border-b backdrop-blur-xl ${isDark ? 'border-[#262626] bg-[#1c1c1e]/90' : 'border-[#E2E4E9] bg-white/90'}`}>
      <nav className="max-w-5xl mx-auto px-[6px] h-full flex items-center justify-between">

        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <Link href="" className="flex items-center">
            <FlotterLogo isDark={isDark} height={34} />
          </Link>
        </div>

        {/* Right: Action Buttons (Support, Settings) per JSON "elements" */}
        <div className="flex items-center gap-3">
          {!isLoading && (
            <>
              {user ? (
                <>
                  {/* Action Button: Ranking */}
                  <Link
                    href="/ranking"
                    className={`p-2 hover:text-[#3B82F6] transition-colors ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
                    title="Rankings"
                  >
                    <Trophy size={19} />
                  </Link>

                  {/* Action Button: Settings */}
                  <Link
                    href="/settings"
                    className={`p-2 hover:text-[#3B82F6] transition-colors ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
                    title="Settings"
                  >
                    <Settings size={19} />
                  </Link>

                  {/* Profile: item_radius 12px instead of full circle to match system */}
                  <Link
                    href="/profile"
                    className={`ml-2 flex items-center justify-center w-[36px] h-[36px] rounded-[12px] border text-[#9CA3AF] hover:border-[#3B82F6] transition-all overflow-hidden ${isDark ? 'bg-[#222222] border-[#2D2D2F]' : 'bg-[#F0F1F3] border-[#E2E4E9]'}`}
                  >
                    {user.image ? (
                      <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} />
                    )}
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    // body_large: 15px SemiBold
                    className={`text-[15px] font-semibold transition-colors px-3 ${isDark ? 'text-[#9CA3AF] hover:text-[#FFFFFF]' : 'text-[#6B7280] hover:text-[#111827]'}`}
                  >
                    {t('header.login')}
                  </Link>

                  <Link
                    href="/register"
                    // button_primary: bg #3B82F6, radius 12px, text white
                    className="text-[14px] font-bold uppercase tracking-widest bg-[#3B82F6] text-[#FFFFFF] px-[20px] py-[10px] rounded-[12px] hover:bg-[#1D4ED8] transition-all active:scale-95"
                  >
                    {t('header.join')}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  )
}