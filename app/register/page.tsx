"use client"

import React, { useState } from "react"
import Link from "next/link"
import axios from "axios"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

type FormData = {
  email: string
  password: string
}

export default function RegisterPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { email: "", password: "" } })

  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(data: FormData) {
    setMessage(null)
    try {
      // 1. Register the user in the database
      const res = await axios.post("/api/auth/register", data)
      
      if (res.status === 201) {
        setMessage("Account created! Signing you in...")
        
        // 2. Automatically log them in with NextAuth
        const result = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        })

        if (!result?.error) {
          router.push('/')
          router.refresh()
        } else {
          setMessage("Account created, but login failed. Please go to Login page.")
        }
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.error || err?.message || "Registration failed"
      setMessage(String(errMsg))
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#000000] text-[#FFFFFF] antialiased font-['San_Francisco',_Roboto,_Arial,_sans-serif]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#22C55E08_0%,_transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md z-10 px-[20px]">
        <div className="bg-[#121212] border border-[#3A3A3C] p-[32px] rounded-[24px]">
          <div className="mb-[32px]">
            <h1 className="text-[28px] font-[700] tracking-tight text-[#FFFFFF]">Create account</h1>
            <p className="text-[#98989E] mt-2 text-[15px]">Enter your details to get started.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-[24px]">
            <div className="space-y-[12px]">
              <label className="text-[14px] font-[600] uppercase tracking-widest text-[#98989E] ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                {...register("email", { required: "Email is required" })}
                className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-[16px] px-4 py-[16px] text-[#FFFFFF] placeholder-[#636366] transition-all duration-200 focus:outline-none focus:border-[#22C55E] text-[17px]"
              />
              {errors.email && (
                <p className="text-[14px] text-[#FF453A] mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-[12px]">
              <label className="text-[14px] font-[600] uppercase tracking-widest text-[#98989E] ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
                className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-[16px] px-4 py-[16px] text-[#FFFFFF] placeholder-[#636366] transition-all duration-200 focus:outline-none focus:border-[#22C55E] text-[17px]"
              />
              {errors.password && (
                <p className="text-[14px] text-[#FF453A] mt-1 ml-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#FFFFFF] font-[600] py-[16px] rounded-[18px] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 text-[17px] text-center"
            >
              <span>
                {isSubmitting ? "Creating account..." : "Register"}
              </span>
            </button>

            {message && (
              <div className={`text-center text-[15px] p-4 rounded-[16px] border animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                message.includes("failed") 
                ? "bg-[#1C1C1E] border-[#FF453A]/30 text-[#FF453A]" 
                : "bg-[#1C1C1E] border-[#4CD964]/30 text-[#4CD964]"
              }`}>
                {message}
              </div>
            )}
          </form>

          <p className="mt-4 text-center text-[14px] text-[#636366]">
            Already have an account? <Link href="/login" className="underline text-[#22C55E] hover:text-[#16A34A] font-[600]">Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  )
}