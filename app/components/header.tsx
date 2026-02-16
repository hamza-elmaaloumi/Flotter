"use client"

import Link from 'next/link'
import { useUser } from '../providers/UserProvider'
import { User, LayoutGrid, Zap } from 'lucide-react'

export default function Header() {
  const { user, isLoading } = useUser()

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/[0.03] bg-black/80 backdrop-blur-xl">
      <nav className="max-w-[1100px] mx-auto px-4 h-[56px] flex items-center justify-between">
        
        {/* Left: Brand - Slenderized */}
        <div className="flex flex-1 items-center">
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">
              <Zap size={12} fill="black" className="text-black" />
            </div>
            <span className="text-white font-black tracking-[0.25em] text-[13px] uppercase">
              Flotter
            </span>
          </Link>
        </div>

        {/* Middle: Deck Navigation - High Density Squircle */}
        <div className="flex items-center justify-center">
          {user && !isLoading && (
            <Link
              href="/cards/learning"
              className="flex items-center justify-center w-[36px] h-[36px] rounded-[10px] bg-[#121212] border border-[#1C1C1E] text-zinc-600 hover:text-emerald-500 hover:border-emerald-500/30 transition-all active:scale-90"
            >
              <LayoutGrid size={18} />
            </Link>
          )}
        </div>

        {/* Right: Auth/Profile - Compact Buttons */}
        <div className="flex flex-1 items-center justify-end gap-3">
          {!isLoading && (
            <>
              {user ? (
                <Link
                  href="/profile"
                  className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-[#121212] border border-[#1C1C1E] text-zinc-500 hover:text-emerald-500 hover:border-emerald-500/50 transition-all active:scale-95 overflow-hidden"
                >
                  {user.image ? (
                    <img src={user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={16} />
                  )}
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors px-3 py-2"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-500 text-black px-4 py-2 rounded-full hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
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