"use client"

import React, { useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { ShieldAlert } from 'lucide-react'

export default function LogoutPage() {
  useEffect(() => {
    const performLogout = async () => {
      // Small delay to ensure the animation is seen
      setTimeout(async () => {
        await signOut({ callbackUrl: '/' })
      }, 1800)
    }
    performLogout()
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white antialiased p-4">
      {/* Background Neural Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#10B98108_0%,_transparent_65%)] pointer-events-none" />
      
      <div className="relative flex flex-col items-center z-10 w-full max-w-[310px]">
        {/* Progress Metric Container */}
        <div className="relative w-20 h-20 mb-8">
          {/* Static Track */}
          <div className="absolute inset-0 border-[3px] border-zinc-900 rounded-[24px]"></div>
          {/* Animated Pulse Ring */}
          <div className="absolute inset-0 border-[3px] border-emerald-500 border-t-transparent rounded-[24px] animate-spin shadow-[0_0_15px_rgba(16,185,129,0.2)]"></div>
          {/* Inner Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldAlert className="text-emerald-500/40" size={24} />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black tracking-tight italic">
            Terminating...
          </h2>
          
          <div className="inline-block bg-[#121212] border border-white/[0.03] px-4 py-1.5 rounded-full">
            <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              Clearing Secure Cache
            </p>
          </div>
        </div>
      </div>

      {/* Slender Branding Footer */}
      <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-20">
        <div className="h-[1px] w-8 bg-zinc-800 mb-2" />
        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">
          Pulse Protocol
        </p>
      </div>
    </main>
  )
}