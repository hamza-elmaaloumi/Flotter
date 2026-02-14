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
  ArrowRight 
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
      <main className="min-h-screen bg-[#000000] flex items-center justify-center p-6">
        <div className="bg-[#121212] border border-[#FF453A]/30 p-8 rounded-[24px] text-center">
          <p className="text-[#FF453A] font-[600]">User profile not found.</p>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] font-['San_Francisco',_Roboto,_Arial,_sans-serif] antialiased pb-[80px]">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-[#22C55E]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-[20px] pt-[100px] relative z-10">
        
        {/* Profile Card */}
        <section className="bg-[#121212] border border-[#3A3A3C] rounded-[32px] p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-28 h-28 rounded-[28px] bg-[#1C1C1E] border-2 border-[#3A3A3C] overflow-hidden flex items-center justify-center">
              {user.image ? (
                <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-[#636366]" />
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-[28px] font-[700] tracking-tight mb-1">{user.name ?? 'Learner'}</h1>
              <p className="text-[#98989E] text-[16px]">{user.email}</p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-[#1C1C1E] p-5 rounded-[22px] border border-transparent">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={16} className="text-[#3B82F6]" />
              <p className="text-[13px] font-[600] uppercase tracking-widest text-[#98989E]">Joined</p>
            </div>
            <p className="text-[16px] font-[500]">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="bg-[#1C1C1E] p-5 rounded-[22px] border border-transparent">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={16} className="text-[#4CD964]" />
              <p className="text-[13px] font-[600] uppercase tracking-widest text-[#98989E]">Last Update</p>
            </div>
            <p className="text-[16px] font-[500]">{new Date(user.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Account Settings Block */}
        <div className="bg-[#121212] border border-[#3A3A3C] rounded-[24px] overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#3A3A3C] bg-[#1C1C1E]">
            <h3 className="text-[13px] font-[700] uppercase tracking-widest text-[#98989E]">Account Settings</h3>
          </div>
          <div className="divide-y divide-[#3A3A3C]">
            <button className="w-full flex items-center justify-between px-6 py-5 hover:bg-[#1C1C1E] transition-colors group">
              <div className="flex items-center gap-4">
                <Mail size={20} className="text-[#636366] group-hover:text-white" />
                <span className="text-[16px]">Change Email Address</span>
              </div>
              <Settings size={18} className="text-[#636366]" />
            </button>
            <button className="w-full flex items-center justify-between px-6 py-5 hover:bg-[#1C1C1E] transition-colors group">
              <div className="flex items-center gap-4">
                <ShieldCheck size={20} className="text-[#636366] group-hover:text-white" />
                <span className="text-[16px]">Security & Password</span>
              </div>
              <Settings size={18} className="text-[#636366]" />
            </button>
          </div>
        </div>

        {/* Danger Zone / Logout Button */}
        <div className="bg-[#121212] border border-[#FF453A]/20 rounded-[24px] overflow-hidden shadow-lg shadow-[#FF453A]/5">
          <Link 
            href="/logout"
            className="w-full flex items-center justify-between px-6 py-6 hover:bg-[#FF453A]/5 transition-all group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="p-2.5 bg-[#FF453A]/10 rounded-[14px] text-[#FF453A] group-hover:bg-[#FF453A]/20 transition-colors">
                <LogOut size={22} />
              </div>
              <div>
                <span className="text-[17px] font-[600] text-[#FF453A] block leading-none mb-1">Sign Out</span>
                <p className="text-[13px] text-[#FF453A]/50 font-[500]">Terminate secure session</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-[#FF453A] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Footer Text */}
        <div className="mt-16 text-center">
          <p className="text-[11px] text-[#636366] font-[700] uppercase tracking-[0.3em]">
            Flotter Profile Identity
          </p>
        </div>
      </div>
    </div>
  )
}