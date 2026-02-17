"use client"
import React from 'react'
import Link from 'next/link'
import { Plus, Home, Book, Settings, Search } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function Footer() {

  const session = useSession()
  if (session.status !== "authenticated") {
    return null
  }

  return (
    // Applied: navigation.bottom_tab_bar (background, height, border_top)
    <footer className="fixed bottom-0 left-0 right-0 h-[60px] bg-[#121212] border-t-[0.5px] border-[#1C1C1E] z-50 flex items-center justify-around px-4">
      
      {/* Left Navigation Icons */}
      <Link href="/cards/learning" className="flex flex-col items-center justify-center text-[#FFFFFF] hover:text-[#3B82F6] transition-colors">
        <Home size={22} />
      </Link>
      

      {/* Center Primary Action Button */}
      {/* Applied: shapes.button_pill & brand.primary_green */}
      <div className="relative -top-5">
        <Link
          href="/cards/new"
          className="flex items-center justify-center w-14 h-14 bg-[#22C55E] text-[#FFFFFF] rounded-[100px] shadow-[0_4px_20px_rgba(34,197,94,0.4)] hover:bg-[#16A34A] active:scale-95 transition-all border-4 border-[#000000]"
        >
          <Plus size={28} strokeWidth={3} />
        </Link>
      </div>

      {/* Right Navigation Icons */}
      <Link href="/cards/search" className="flex flex-col items-center justify-center text-[#FFFFFF] hover:text-[#3B82F6] transition-colors">
        <Search size={22} />
      </Link>


    </footer>
  )
}