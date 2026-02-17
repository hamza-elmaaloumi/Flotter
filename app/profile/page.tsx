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
  LogOut, 
  ChevronRight,
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
      <main className="min-h-screen bg-[#121212] flex items-center justify-center p-6">
        <div className="bg-[#222222] border border-[#EF4444]/20 p-8 rounded-[14px] text-center">
          <p className="text-[#EF4444] text-[11px] font-bold uppercase tracking-widest">Profile not found</p>
        </div>
      </main>
    )
  }

  return (
    // Global Background: #121212
    <div className="min-h-screen bg-[#121212] text-[#FFFFFF] antialiased pb-[64px]">
      
      {/* Visual Asset influence: Brand Blue Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[250px] bg-[#3B82F6]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-[340px] md:max-w-md mx-auto px-[6px] pt-16 relative z-10">
        
        {/* AVATAR & IDENTITY */}
        <section className="flex flex-col items-center mb-[24px]">
          <div className="relative mb-4">
            {/* item_radius: 12px */}
            <div className="w-20 h-20 rounded-[12px] bg-[#222222] border border-[#2D2D2F] overflow-hidden flex items-center justify-center shadow-2xl">
              {user.image ? (
                <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-[#6B7280]" />
              )}
            </div>
            {/* Verified Green from Brand Tokens */}
            <div className="absolute -bottom-1 -right-1 bg-[#10B981] p-1.5 rounded-[8px] border-[3px] border-[#121212]">
              <Fingerprint size={12} className="text-[#000000]" />
            </div>
          </div>
          {/* h1: 19px Bold */}
          <h1 className="text-[19px] font-bold tracking-tight">{user.name ?? 'Learner'}</h1>
          {/* caption: 12px Medium, secondary color */}
          <p className="text-[#9CA3AF] text-[12px] font-medium">{user.email}</p>
        </section>

        {/* STATS STRIP - Standard Card Radius 16px (per cards.standard_card) */}
        <div className="grid grid-cols-2 gap-[8px] mb-[20px]">
          <div className="bg-[#1C1C1E] border border-[#2D2D2F] p-4 rounded-[16px]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">Member Since</p>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#3B82F6]" />
              <p className="text-[14px] font-regular">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="bg-[#1C1C1E] border border-[#2D2D2F] p-4 rounded-[16px]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">Last Activity</p>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#3B82F6]" />
              <p className="text-[14px] font-regular">{new Date(user.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* SETTINGS MENU - UI Element Divider: #262626 */}
        <div className="bg-[#1C1C1E] border border-[#2D2D2F] rounded-[16px] overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-[#262626] bg-[#222222]">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">Settings</h3>
          </div>
          
          {/* settings_row: height 56px, background #1C1C1E */}
          <div className="divide-y divide-[#262626]">
            <button className="w-full h-[56px] flex items-center justify-between px-5 hover:bg-[#222222] transition-all group">
              <div className="flex items-center gap-3">
                {/* Icon Container Rounded 8px */}
                <div className="w-8 h-8 rounded-[8px] bg-[#121212] border border-[#2D2D2F] flex items-center justify-center">
                  <Mail size={16} className="text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors" />
                </div>
                {/* body_medium: 14px Regular */}
                <span className="text-[14px] font-regular text-[#FFFFFF]">Email Address</span>
              </div>
              <ChevronRight size={14} className="text-[#6B7280]" />
            </button>

            <button className="w-full h-[56px] flex items-center justify-between px-5 hover:bg-[#222222] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[#121212] border border-[#2D2D2F] flex items-center justify-center">
                  <ShieldCheck size={16} className="text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors" />
                </div>
                <span className="text-[14px] font-regular text-[#FFFFFF]">Security</span>
              </div>
              <ChevronRight size={14} className="text-[#6B7280]" />
            </button>
          </div>
        </div>

        {/* LOGOUT - Status Color: Error #EF4444 */}
        <div className="bg-[#1C1C1E] border border-[#EF4444]/10 rounded-[16px] overflow-hidden">
          <Link 
            href="/logout"
            className="w-full flex items-center justify-between px-5 h-[64px] hover:bg-[#EF4444]/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#EF4444]/10 rounded-[12px] text-[#EF4444] flex items-center justify-center border border-[#EF4444]/10">
                <LogOut size={20} />
              </div>
              <div>
                <span className="text-[15px] font-bold text-[#EF4444] block leading-tight">Sign Out</span>
                <p className="text-[11px] text-[#EF4444]/50 font-bold uppercase tracking-wider">End Session</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#EF4444]/30" />
          </Link>
        </div>

        {/* Footer/System ID - Caption Style */}
        <div className="mt-[20px] text-center">
          <div className="inline-block px-3 py-1 rounded-full border border-[#2D2D2F] bg-[#1C1C1E]">
            <p className="text-[11px] text-[#6B7280] font-bold uppercase tracking-widest">
              System ID: {user.id.slice(0, 8)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}