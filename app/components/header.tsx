"use client"

import Link from 'next/link'
import { useUser } from '../providers/UserProvider'
import { User, LayoutGrid, Zap, Layers } from 'lucide-react'

export default function Header() {
  const { user, isLoading } = useUser()

  return (
    // Applied: bottom_tab_bar background and border styles
    <header className="fixed top-0 left-0 right-0 z-[100] h-[60px] border-b-[0.5px] border-[#1C1C1E] bg-[#000000]/80 backdrop-blur-xl">
      <nav className="max-w-[1100px] mx-auto px-[20px] h-full flex items-center justify-between">
        
        {/* Left: Brand - Primary Green Logo */}
        <div className="flex flex-1 items-center">
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            {/* Applied: button_standard radius (16px) and brand colors */}
            <div className="w-8 h-8 bg-[#22C55E] rounded-[16px] flex items-center justify-center transition-all group-hover:bg-[#16A34A]">
              <Zap size={16} fill="white" className="text-white" strokeWidth={2} />
            </div>
          </Link>
        </div>

        {/* Middle: Navigation - System Style */}
        <div className="flex items-center justify-center gap-4">
          {user && !isLoading && (
            <>
              {/* Learning Hub Button */}
              <Link
                href="/cards/learning"
                // Applied: surface background and inner_card radius (16px)
                className="flex items-center justify-center w-[42px] h-[42px] rounded-[16px] bg-[#121212] border border-[#1C1C1E] text-[#98989E] hover:text-[#3B82F6] hover:border-[#3B82F6] transition-all active:scale-90"
                title="Learning Hub"
              >
                <LayoutGrid size={20} strokeWidth={2} />
              </Link>

              {/* Deck Button - Fixed to match Design System */}
              <Link
                href="/cards/deck"
                // Applied: Elevated Card color & Blue Accent for active state feel
                className="group flex items-center justify-center w-[42px] h-[42px] rounded-[16px] bg-[#1C1C1E] border border-[#3A3A3C] text-[#FFFFFF] hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all active:scale-90"
                title="Your Deck"
              >
                <Layers size={20} strokeWidth={2} />
              </Link>
            </>
          )}
        </div>

        {/* Right: Auth/Profile */}
        <div className="flex flex-1 items-center justify-end gap-3">
          {!isLoading && (
            <>
              {user ? (
                <Link
                  href="/profile"
                  // Profile circle
                  className="flex items-center justify-center w-[36px] h-[36px] rounded-full bg-[#121212] border border-[#1C1C1E] text-[#98989E] hover:border-[#3B82F6] transition-all overflow-hidden"
                >
                  {user.image ? (
                    <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} strokeWidth={2} />
                  )}
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    // Applied: label_bold style
                    className="text-[14px] font-[600] uppercase tracking-wider text-[#98989E] hover:text-[#FFFFFF] transition-colors px-3"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    // Applied: button_pill (100px) and primary_green
                    className="text-[14px] font-[600] uppercase tracking-wider bg-[#22C55E] text-[#FFFFFF] px-[24px] py-[10px] rounded-[100px] hover:bg-[#16A34A] transition-all active:scale-95"
                  >
                    Join
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  )
}