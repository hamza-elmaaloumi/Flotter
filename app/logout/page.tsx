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
    // primary background: #121212
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-[#FFFFFF] antialiased p-4">
      {/* Background Glow updated to Primary Blue Muted (#1D4ED8) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1D4ED805_0%,_transparent_65%)] pointer-events-none" />
      
      <div className="relative flex flex-col items-center z-10 w-full max-w-[310px]">
        {/* Progress Metric Container - using progress_indicators logic */}
        <div className="relative w-20 h-20 mb-8">
          {/* Static Track: track_color #2C2C2E | radius: 12px (item_radius) */}
          <div className="absolute inset-0 border-[3px] border-[#2C2C2E] rounded-[12px]"></div>
          
          {/* Animated Pulse Ring: fill_color #3B82F6 */}
          <div className="absolute inset-0 border-[3px] border-[#3B82F6] border-t-transparent rounded-[12px] animate-spin shadow-[0_0_15px_rgba(59,130,246,0.1)]"></div>
          
          {/* Inner Icon: text.tertiary #6B7280 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldAlert className="text-[#6B7280]" size={24} />
          </div>
        </div>
        
        <div className="text-center space-y-3">
          {/* h1 typography: 19px, Bold */}
          <h2 className="text-[19px] font-bold tracking-tight">
            Terminating...
          </h2>
          
          {/* secondary background: #222222 | border: #2D2D2F */}
          <div className="inline-block bg-[#222222] border border-[#2D2D2F] px-4 py-1.5 rounded-full">
            {/* label typography: 11px, Bold, Uppercase */}
            <p className="text-[#6B7280] text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse" />
              Clearing Secure Cache
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding - caption typography: 12px, Medium */}
      <div className="absolute bottom-12 flex flex-col items-center gap-2">
        {/* divider: #262626 */}
        <div className="h-[1px] w-8 bg-[#262626] mb-2" />
        <p className="text-[12px] text-[#6B7280] font-medium uppercase tracking-[0.3em]">
          iStoria System
        </p>
      </div>
    </main>
  )
}