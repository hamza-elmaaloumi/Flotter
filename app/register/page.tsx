"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { useForm } from "react-hook-form"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { UserPlus, Sparkles } from "lucide-react"

type FormData = {
  email: string
  password: string
}

export default function RegisterPage() {
  const router = useRouter()
  const session = useSession()

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/cards/learning")
    }
  }, [session.status, router])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { email: "", password: "" } })

  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(data: FormData) {
    setMessage(null)
    try {
      const res = await axios.post("/api/auth/register", data)
      
      if (res.status === 201) {
        setMessage("Account created! Signing you in...")
        const result = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        })

        if (!result?.error) {
          router.push('/')
          router.refresh()
        } else {
          setMessage("Login failed. Please go to Login page.")
        }
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.error || err?.message || "Registration failed"
      setMessage(String(errMsg))
    }
  }

  const inputStyles = "w-full bg-[#1C1C1E] border border-[#2C2C2E] rounded-[14px] px-4 py-[14px] text-white placeholder-[#48484A] transition-all duration-200 focus:outline-none focus:border-emerald-500/50 text-[15px]"
  const labelStyles = "text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 mb-2 block"

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white antialiased p-4">
      {/* Background Neural Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#10B98108_0%,_transparent_65%)] pointer-events-none" />

      <div className="w-full max-w-[340px] z-10">
        <div className="bg-[#121212] border border-[#1C1C1E] p-6 md:p-8 rounded-[28px] shadow-2xl relative">
          
          <header className="mb-8 text-center">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 mx-auto mb-4">
               <UserPlus className="text-emerald-500" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Create Account</h1>
            <p className="text-zinc-500 mt-1 text-[13px] font-medium">Start your mastery journey today.</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className={labelStyles}>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                {...register("email", { required: "Email is required" })}
                className={inputStyles}
              />
              {errors.email && (
                <p className="text-[10px] text-rose-500 mt-1.5 ml-1 font-bold uppercase tracking-wider">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className={labelStyles}>Security Key (Password)</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
                className={inputStyles}
              />
              {errors.password && (
                <p className="text-[10px] text-rose-500 mt-1.5 ml-1 font-bold uppercase tracking-wider">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-[14px] rounded-[16px] transition-all active:scale-[0.98] disabled:opacity-50 text-[15px] mt-2 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              {isSubmitting ? "Processing..." : "Register"}
            </button>

            {message && (
              <div className={`text-center text-[12px] p-3 rounded-xl border font-bold animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                message.includes("failed") 
                ? "bg-rose-500/5 border-rose-500/20 text-rose-500" 
                : "bg-emerald-500/5 border-emerald-500/20 text-emerald-500"
              }`}>
                {message}
              </div>
            )}
          </form>

          <p className="mt-8 text-center text-[12px] text-zinc-600 font-medium">
            Already a member? <Link href="/login" className="text-emerald-500 hover:text-emerald-400 font-black ml-1">Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  )
}