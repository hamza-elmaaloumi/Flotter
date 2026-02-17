"use client"
import React from 'react'
import Link from 'next/link'
import { Plus, Home, Search } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '../providers/LanguageProvider'

export default function Footer() {
  const pathname = usePathname()
  const { status } = useSession()
  const { t } = useLanguage()

  if (status !== "authenticated") {
    return null
  }

  return (
    /* Background: #121212 | Height: 64px | Border: #262626 */
    <footer className="fixed bottom-0 left-0 right-0 h-[64px] bg-[#1c1c1e] border-t border-[#262626] z-50 flex items-center justify-around px-4">
      
      {/* Left Icon - Home */}
      <Link 
        href="/cards/learning" 
        className={`flex flex-col items-center justify-center transition-colors ${
          pathname === '/cards/learning' ? 'text-[#3B82F6]' : 'text-[#9CA3AF] hover:text-[#FFFFFF]'
        }`}
      >
        <Home size={19} />
        <span className="text-[11px] font-bold uppercase tracking-widest mt-1">{t('footer.home')}</span>
      </Link>
      

      {/* Center Primary Action Button - Restored Original Logic */}
      <div className="relative -top-5">
        <Link
          href="/cards/new"
          /* Background: #3B82F6 | radius: 100px (Pill/Circle) | border: #121212 */
          className="flex items-center justify-center w-14 h-14 bg-[#3B82F6] text-[#FFFFFF] rounded-full shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:bg-[#1D4ED8] active:scale-95 transition-all border-4 border-[#121212]"
        >
          <Plus size={28} strokeWidth={3} />
        </Link>
      </div>

      {/* Right Icon - Search */}
      <Link 
        href="/cards/search" 
        className={`flex flex-col items-center justify-center transition-colors ${
          pathname === '/cards/search' ? 'text-[#3B82F6]' : 'text-[#9CA3AF] hover:text-[#FFFFFF]'
        }`}
      >
        <Search size={19} />
        <span className="text-[11px] font-bold uppercase tracking-widest mt-1">{t('footer.search')}</span>
      </Link>

    </footer>
  )
}