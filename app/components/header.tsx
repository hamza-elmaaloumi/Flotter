"use client"

import Link from 'next/link'
import { useUser } from '../providers/UserProvider'
import { User, Zap, Layers, LifeBuoy, Settings, Shield } from 'lucide-react'

export default function Header() {
  const { user, isLoading } = useUser()

  return (
    // Applied: primary background (#121212) and divider color (#262626)
    // Height: Not explicitly in JSON for header, but set to 64px to match Nav Bar consistency
    <header className="fixed top-0 left-0 right-0 z-[100] h-[64px] border-b border-[#262626] bg-[#121212]/90 backdrop-blur-xl">
      <nav className="max-w-5xl mx-auto px-[6px] h-full flex items-center justify-between">

        {/* Left: Brand & Header Style (Clean/Left alignment) */}
        <div className="flex items-center gap-4">
          <Link href="" className="flex items-center group">
            {/* item_radius: 12px | Brand Primary Blue: #3B82F6 */}
            <div className="w-9 h-9 bg-[#3B82F6] rounded-[12px] flex items-center justify-center transition-all group-hover:bg-[#1D4ED8]">
              <Zap size={20} fill="white" className="text-white" />
            </div>
          </Link>

          {/* Header Title: h2 style (16px, Bold) */}
          <span className="hidden md:block text-[16px] font-bold tracking-normal text-[#FFFFFF]">
            Flotter
          </span>
        </div>

        {/* Right: Action Buttons (Support, Settings) per JSON "elements" */}
        <div className="flex items-center gap-3">
          {!isLoading && (
            <>
              {user ? (
                <>
                  {/* Action Button: Premium Gold Ranking Shield */}
                  <Link
                    href="/ranking"
                    className="p-2 transition-all relative group flex items-center justify-center"
                    title="Rankings"
                  >
                    <div className="relative">
                      {/* Inner Glow/Shadow for depth */}
                      <Shield
                        size={20}
                        className="text-[#FACC15] fill-[#FACC15] filter drop-shadow-[0_0_8px_rgba(250,204,21,0.4)] transition-transform group-hover:scale-110 group-active:scale-95"
                        strokeWidth={2.5}
                      />
                      {/* Subtle highlight to make it look "metallic" */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-full pointer-events-none" />
                    </div>
                  </Link>

                  {/* Action Button: Settings */}
                  <Link
                    href="/settings"
                    className="p-2 text-[#9CA3AF] hover:text-[#3B82F6] transition-colors"
                    title="Settings"
                  >
                    <Settings size={19} />
                  </Link>

                  {/* Profile: item_radius 12px instead of full circle to match system */}
                  <Link
                    href="/profile"
                    className="ml-2 flex items-center justify-center w-[36px] h-[36px] rounded-[12px] bg-[#222222] border border-[#2D2D2F] text-[#9CA3AF] hover:border-[#3B82F6] transition-all overflow-hidden"
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
                    className="text-[15px] font-semibold text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors px-3"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    // button_primary: bg #3B82F6, radius 12px, text white
                    className="text-[14px] font-bold uppercase tracking-widest bg-[#3B82F6] text-[#FFFFFF] px-[20px] py-[10px] rounded-[12px] hover:bg-[#1D4ED8] transition-all active:scale-95"
                  >
                    Join
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