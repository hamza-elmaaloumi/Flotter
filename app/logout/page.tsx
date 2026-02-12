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
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-[#09090b] text-zinc-100">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative flex flex-col items-center">
        {/* Animated Loader */}
        <div className="w-16 h-16 relative mb-6">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <h2 className="text-xl font-medium tracking-tight text-white animate-pulse">
          Signing out...
        </h2>
        <p className="text-zinc-500 text-sm mt-2 font-light">
          Clearing your secure session
        </p>
      </div>
    </main>
  )
}