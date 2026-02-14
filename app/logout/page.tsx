"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../providers/UserProvider'

export default function LogoutPage() {
  const router = useRouter()
  const { clear } = useUser()

  useEffect(() => {
    // Logic remains untouched
    const timer = setTimeout(() => {
      clear()
      router.push('/')
    }, 1500) // Small delay to show the "fancy" transition
    return () => clearTimeout(timer)
  }, [clear, router])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#000000] text-[#FFFFFF] font-['San_Francisco',_Roboto,_Arial,_sans-serif]">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#22C55E08_0%,_transparent_70%)] pointer-events-none" />
      
      <div className="relative flex flex-col items-center z-10">
        {/* Animated Loader */}
        <div className="w-16 h-16 relative mb-[24px]">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-[4px] border-[#3A3A3C] rounded-full"></div>
          {/* Spinning Brand Ring */}
          <div className="absolute inset-0 border-[4px] border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <h2 className="text-[22px] font-[600] tracking-tight text-[#FFFFFF] animate-pulse">
          Signing out...
        </h2>
        
        <div className="mt-[12px] bg-[#1C1C1E] px-[16px] py-[4px] rounded-[20px] border border-[#3A3A3C]">
          <p className="text-[#98989E] text-[14px] font-[600] uppercase tracking-widest">
            Clearing secure session
          </p>
        </div>
      </div>

      {/* Footer Branding hint */}
      <p className="absolute bottom-[32px] text-[14px] text-[#636366] font-[600] uppercase tracking-[0.3em]">
        Linguistic-Dark-UI
      </p>
    </main>
  )
}