import React from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  ArrowRight,
  Fingerprint
} from 'lucide-react'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  // @ts-ignore
  const userId = session.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true, createdAt: true, updatedAt: true },
  })

  if (!user) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-[#121212] border border-rose-500/20 p-8 rounded-[24px] text-center">
          <p className="text-rose-500 text-sm font-black uppercase tracking-widest">Profile not found</p>
        </div>
      </main>
    )
  }

  const labelStyle = "text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1"

  return (
    <div className="min-h-screen bg-black text-white antialiased pb-20">
      {/* Neural Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[250px] bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-[340px] md:max-w-md mx-auto px-4 pt-16 relative z-10">
        
        {/* AVATAR & IDENTITY */}
        <section className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-[24px] bg-[#121212] border border-[#1C1C1E] overflow-hidden flex items-center justify-center shadow-2xl">
              {user.image ? (
                <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-zinc-700" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-lg border-[3px] border-black">
              <Fingerprint size={12} className="text-black" />
            </div>
          </div>
          <h1 className="text-xl font-black tracking-tight">{user.name ?? 'Learner'}</h1>
          <p className="text-zinc-500 text-[12px] font-medium">{user.email}</p>
        </section>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-[#121212] border border-[#1C1C1E] p-4 rounded-[20px]">
            <p className={labelStyle}>Member Since</p>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-emerald-500" />
              <p className="text-[13px] font-bold">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="bg-[#121212] border border-[#1C1C1E] p-4 rounded-[20px]">
            <p className={labelStyle}>Last Activity</p>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-emerald-500" />
              <p className="text-[13px] font-bold">{new Date(user.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* SETTINGS MENU */}
        <div className="bg-[#121212] border border-[#1C1C1E] rounded-[24px] overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-white/[0.03] bg-white/[0.02]">
            <h3 className={labelStyle}>Settings</h3>
          </div>
          <div className="divide-y divide-white/[0.03]">
            <button className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] active:bg-white/[0.04] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Mail size={16} className="text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                </div>
                <span className="text-[14px] font-bold text-zinc-300">Email Address</span>
              </div>
              <ArrowRight size={14} className="text-zinc-700 group-hover:text-emerald-500 transition-all" />
            </button>
            <button className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] active:bg-white/[0.04] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <ShieldCheck size={16} className="text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                </div>
                <span className="text-[14px] font-bold text-zinc-300">Security</span>
              </div>
              <ArrowRight size={14} className="text-zinc-700 group-hover:text-emerald-500 transition-all" />
            </button>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="bg-[#121212] border border-rose-500/10 rounded-[24px] overflow-hidden shadow-xl shadow-rose-500/[0.02]">
          <Link 
            href="/logout"
            className="w-full flex items-center justify-between px-5 py-5 hover:bg-rose-500/[0.03] active:bg-rose-500/[0.05] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500/10 rounded-xl text-rose-500 flex items-center justify-center border border-rose-500/10">
                <LogOut size={20} />
              </div>
              <div>
                <span className="text-[15px] font-black text-rose-500 block leading-tight">Sign Out</span>
                <p className="text-[10px] text-rose-500/40 font-bold uppercase tracking-wider">End Session</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-rose-500/30 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-block px-3 py-1 rounded-full border border-white/[0.05] bg-white/[0.02]">
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">
              System ID: {user.id.slice(0, 8)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}