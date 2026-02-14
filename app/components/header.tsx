"use client"

import Link from 'next/link'
import { useUser } from '../providers/UserProvider'

export default function Header() {
  const { user } = useUser()

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] border-b-[0.5px] border-[#1C1C1E] bg-[#000000] font-['San_Francisco',_Roboto,_Arial,_sans-serif]">
      <nav className="max-w-6xl mx-auto px-[20px] h-[60px] flex items-center justify-between">
        <div className="flex items-center gap-[32px]">
          <Link
            href="/"
            className="text-[#FFFFFF] font-[700] tracking-[0.2em] text-[17px] hover:text-[#22C55E] transition-colors"
          >
            FLOTTER
          </Link>
        </div>

        <div className="flex items-center gap-[12px]">
          {user ? (
            <Link
              href="/logout"
              className="text-[14px] font-[600] uppercase tracking-widest text-[#98989E] hover:text-[#FF453A] transition-colors px-[16px] py-[8px]"
            >
              Sign Out
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
        </div>
      </nav>
    </header>
  )
}