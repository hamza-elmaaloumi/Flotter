"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
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
    <main className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-100 antialiased selection:bg-indigo-500/30">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md z-10 px-6">
        <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">Login</h1>
            <p className="text-zinc-400 mt-2 text-sm">Welcome back. Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-widest text-zinc-500 ml-1">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                type="email"
                required
                className="w-full bg-zinc-800/40 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-widest text-zinc-500 ml-1">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
                className="w-full bg-zinc-800/40 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100 shadow-[0_0_20px_rgba(79,70,229,0.15)]"
            >
              <span className="relative z-10">
                {loading ? 'Authenticating...' : 'Sign In'}
              </span>
            </button>

            {error && (
              <div className="text-center text-sm p-3 rounded-lg border bg-rose-500/10 border-rose-500/20 text-rose-400 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {error}
              </div>
            )}
          </form>

          <p className="mt-8 text-center text-xs text-zinc-600 uppercase tracking-tighter">
            Secure Session Encryption Active
          </p>
        </div>
      </div>
    </main>
  )
}