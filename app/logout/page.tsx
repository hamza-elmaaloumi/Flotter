"use client"

import React, { useEffect } from 'react'
import { signOut } from 'next-auth/react'

export default function LogoutPage() {
  useEffect(() => {
    const performLogout = async () => {
      // Small delay to show the "fancy" transition before redirecting
      setTimeout(async () => {
        await signOut({ callbackUrl: '/' })
      }, 1500)
    }
    performLogout()
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#000000] text-[#FFFFFF] font-['San_Francisco',_Roboto,_Arial,_sans-serif]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#22C55E08_0%,_transparent_70%)] pointer-events-none" />
      
      <div className="relative flex flex-col items-center z-10">
        <div className="w-16 h-16 relative mb-[24px]">
          <div className="absolute inset-0 border-[4px] border-[#3A3A3C] rounded-full"></div>
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

      <p className="absolute bottom-[32px] text-[14px] text-[#636366] font-[600] uppercase tracking-[0.3em]">
        Linguistic-Dark-UI
      </p>
    </main>
  )
}