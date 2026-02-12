"use client"
import React, { useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"

type FormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { email: "", password: "" },
  })

  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(data: FormData) {
    setMessage(null)
    try {
      const res = await axios.post("/api/auth/login", data)
      setMessage(res.data?.message ?? "Login successful")
    } catch (err: any) {
      const errMsg = err?.response?.data?.error || err?.message || "Login failed"
      setMessage(String(errMsg))
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-100 antialiased selection:bg-indigo-500/30">
      {/* Background Decorative Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md z-10 px-6">
        <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="text-zinc-400 mt-2 text-sm">Please enter your credentials to log in.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-widest text-zinc-500 ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                {...register("email", { required: "Email is required" })}
                className="w-full bg-zinc-800/40 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
              {errors.email && (
                <p className="text-xs text-rose-400 mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-xs font-medium uppercase tracking-widest text-zinc-500 ml-1">
                  Password
                </label>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
                className="w-full bg-zinc-800/40 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
              {errors.password && (
                <p className="text-xs text-rose-400 mt-1 ml-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative group overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100 shadow-[0_0_20px_rgba(79,70,229,0.15)]"
            >
              <span className="relative z-10">
                {isSubmitting ? "Authenticating..." : "Sign In"}
              </span>
            </button>

            {message && (
              <div className={`text-center text-sm p-3 rounded-lg border animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                message.toLowerCase().includes("failed") 
                ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}>
                {message}
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <p className="text-sm text-zinc-500">
              Don't have an account?{" "}
              <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}