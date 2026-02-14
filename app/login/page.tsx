"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '../providers/UserProvider'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useUser()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Login failed')
        setLoading(false)
        return
      }

      if (data?.user) {
        setUser({ id: data.user.id, email: data.user.email })
        router.push('/')
      } else {
        setError('Unexpected response from server')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#000000] text-[#FFFFFF] antialiased font-['San_Francisco',_Roboto,_Arial,_sans-serif]">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#22C55E10_0%,_transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md z-10 px-[20px]">
        <div className="bg-[#121212] border border-[#3A3A3C] p-[32px] rounded-[24px]">
          <div className="mb-[32px]">
            <h1 className="text-[28px] font-[700] tracking-tight text-[#FFFFFF]">Login</h1>
            <p className="text-[#98989E] mt-2 text-[15px]">Welcome back. Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-[24px]">
            <div className="space-y-[12px]">
              <label className="text-[14px] font-[600] uppercase tracking-widest text-[#98989E] ml-1">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                type="email"
                required
                className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-[16px] px-4 py-[16px] text-[#FFFFFF] placeholder-[#636366] transition-all duration-200 focus:outline-none focus:border-[#22C55E] text-[17px]"
              />
            </div>

            <div className="space-y-[12px]">
              <label className="text-[14px] font-[600] uppercase tracking-widest text-[#98989E] ml-1">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
                className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-[16px] px-4 py-[16px] text-[#FFFFFF] placeholder-[#636366] transition-all duration-200 focus:outline-none focus:border-[#22C55E] text-[17px]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#FFFFFF] font-[600] py-[16px] rounded-[18px] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 text-[17px]"
            >
              <span>
                {loading ? 'Authenticating...' : 'Sign In'}
              </span>
            </button>

            {error && (
              <div className="text-center text-[15px] p-4 rounded-[16px] border bg-[#1C1C1E] border-[#FF453A]/30 text-[#FF453A]">
                {error}
              </div>
            )}
          </form>

          <p className="mt-4 text-center text-[14px] text-[#636366]">
            Don't have an account? <Link href="/register" className="underline text-[#22C55E] hover:text-[#16A34A] font-[600]">Sign Up</Link>
          </p>

          <p className="mt-8 text-center text-[14px] text-[#636366] uppercase tracking-widest font-[600]">
            Secure Session Encryption Active
          </p>
        </div>
      </div>
    </main>
  )
}