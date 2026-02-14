"use client"

import Link from 'next/link'
import { useUser } from '../providers/UserProvider'
import { User, LayoutGrid } from 'lucide-react'

export default function Header() {
  const { user, isLoading } = useUser()

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] border-b-[0.5px] border-[#1C1C1E] bg-[#000000] font-['San_Francisco',_Roboto,_Arial,_sans-serif]">
      <nav className="max-w-6xl mx-auto px-[20px] h-[60px] flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex flex-1 items-center">
          <Link
            href="/"
            className="text-[#FFFFFF] font-[700] tracking-[0.2em] text-[17px] hover:text-[#22C55E] transition-colors"
          >
            FLOTTER
          </Link>
        </div>

        {/* Middle: Home/Deck Icon */}
        <div className="flex items-center justify-center">
          {user && !isLoading && (
            <Link
              href="/cards/learning"
              className="flex items-center justify-center w-[40px] h-[40px] rounded-[12px] bg-[#1C1C1E] border border-[#3A3A3C] text-[#98989E] hover:text-[#22C55E] hover:border-[#22C55E]/30 transition-all group"
            >
              <LayoutGrid size={20} className="group-active:scale-90 transition-transform" />
            </Link>
          )}
        </div>

        {/* Right: Profile or Auth */}
        <div className="flex flex-1 items-center justify-end gap-[12px]">
          {!isLoading && (
            <>
              {user ? (
                <Link
                  href="/profile"
                  className="flex items-center justify-center w-[36px] h-[36px] rounded-full bg-[#1C1C1E] border border-[#3A3A3C] text-[#98989E] hover:text-[#FFFFFF] hover:border-[#22C55E] transition-all"
                >
                  <User size={18} />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-[14px] font-[600] uppercase tracking-widest text-[#98989E] hover:text-[#FFFFFF] transition-colors px-[16px] py-[8px]"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="text-[14px] font-[600] uppercase tracking-widest bg-[#22C55E] text-[#FFFFFF] hover:bg-[#16A34A] transition-colors px-[24px] py-[10px] rounded-[16px]"
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