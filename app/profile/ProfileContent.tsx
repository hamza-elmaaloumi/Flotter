'use client'

import React from 'react'
import Link from 'next/link'
import ProfileForm from './ProfileForm'
import { useLanguage } from '../providers/LanguageProvider'
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  LogOut, 
  ChevronRight,
  Fingerprint,
  Zap,
  Flame,
  Trophy,
  X,
  Crown,
  Shield
} from 'lucide-react'

const RedAnimatedFlame = ({ size = 20, active = false, className = "" }: { size?: number, active?: boolean, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={`overflow-visible ${className}`}>
    <defs>
      {/* Outer Flame Gradient - Deep reds to base #EF4444 */}
      <linearGradient id="flameOuterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={active ? "#EF4444" : "#4B5563"}>
          {active && <animate attributeName="stop-color" values="#EF4444; #F87171; #EF4444" dur="2s" repeatCount="indefinite" />}
        </stop>
        <stop offset="100%" stopColor={active ? "#991B1B" : "#1F2937"}>
          {active && <animate attributeName="stop-color" values="#991B1B; #B91C1C; #991B1B" dur="2s" repeatCount="indefinite" />}
        </stop>
      </linearGradient>

      {/* Inner Flame Gradient - White-hot red core for realistic heat depth */}
      <linearGradient id="flameInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={active ? "#FEE2E2" : "#D1D5DB"}>
          {active && <animate attributeName="stop-color" values="#FEE2E2; #FECACA; #FEE2E2" dur="1.5s" repeatCount="indefinite" />}
        </stop>
        <stop offset="100%" stopColor={active ? "#EF4444" : "#4B5563"}>
          {active && <animate attributeName="stop-color" values="#EF4444; #DC2626; #EF4444" dur="1.5s" repeatCount="indefinite" />}
        </stop>
      </linearGradient>

      {/* Ambient Glow Filters */}
      <filter id="glowAmbientRed" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={active ? "12" : "4"} result="blur" />
      </filter>

      <filter id="glowCoreRed" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur" />
      </filter>

      {/* Base Flame Shape */}
      <path id="streakPathRed" d="M 58 25 C 50 35, 36 55, 36 80 C 36 95, 47 102, 60 102 C 73 102, 84 95, 84 80 C 84 65, 82 55, 78 52 C 74 49, 68 56, 65 62 C 62 68, 65 45, 58 25 Z" />
    </defs>

    <style>{`
      .flame-base-red {
        transform-origin: 60px 95px;
      }
      .glow-layer-red {
        ${active ? 'animation: pulseAmbientRed 2s ease-in-out infinite;' : 'opacity: 0.1;'}
      }
      .flame-outer-red {
        ${active ? 'animation: flickerOuterRed 2s ease-in-out infinite;' : ''}
      }
      .flame-inner-red {
        transform: scale(0.55);
        ${active ? 'animation: flickerInnerRed 1.7s ease-in-out infinite;' : ''}
      }

      /* Parallax dancing: Outer and Inner layers move at slightly different speeds/angles */
      @keyframes flickerOuterRed {
        0%   { transform: scaleX(1) scaleY(1) skewX(0deg); }
        20%  { transform: scaleX(0.95) scaleY(1.05) skewX(-2deg); }
        40%  { transform: scaleX(1.02) scaleY(0.98) skewX(2deg); }
        60%  { transform: scaleX(0.98) scaleY(1.02) skewX(-1deg); }
        80%  { transform: scaleX(1.04) scaleY(0.96) skewX(1deg); }
        100% { transform: scaleX(1) scaleY(1) skewX(0deg); }
      }
      
      @keyframes flickerInnerRed {
        0%   { transform: scale(0.55) skewX(0deg); }
        25%  { transform: scaleX(0.50) scaleY(0.60) skewX(3deg); }
        50%  { transform: scaleX(0.60) scaleY(0.50) skewX(-2deg); }
        75%  { transform: scaleX(0.52) scaleY(0.58) skewX(1deg); }
        100% { transform: scale(0.55) skewX(0deg); }
      }

      @keyframes pulseAmbientRed {
        0%   { opacity: 0.35; transform: scale(0.95); }
        50%  { opacity: 0.65; transform: scale(1.08); }
        100% { opacity: 0.35; transform: scale(0.95); }
      }
    `}</style>

    {/* 1. Large Ambient Red Back-Glow */}
    <use 
      href="#streakPathRed" 
      className="flame-base-red glow-layer-red" 
      fill="none" 
      stroke={active ? "#EF4444" : "#4B5563"} 
      strokeWidth="16" 
      filter="url(#glowAmbientRed)" 
      strokeLinejoin="round" 
    />

    {/* 2. Primary Outer Flame Body */}
    <use 
      href="#streakPathRed" 
      className="flame-base-red flame-outer-red" 
      fill="url(#flameOuterGrad)" 
      stroke="url(#flameOuterGrad)" 
      strokeWidth="4" 
      strokeLinejoin="round" 
    />

    {/* 3. Bright Inner Flame Core (Creates the 3D realistic hollow heat effect) */}
    <use 
      href="#streakPathRed" 
      className="flame-base-red flame-inner-red" 
      fill="url(#flameInnerGrad)" 
      filter="url(#glowCoreRed)"
    />
  </svg>
)

type ProfileUser = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  createdAt: string
  updatedAt: string
  totalXp: number
  monthlyXp: number
  streakCount: number
  isPro: boolean
  subscriptionStatus: string | null
  subscriptionStartedAt: string | null
  subscriptionEndsAt: string | null
}

type ProfileContentProps = {
  user: ProfileUser
  effectiveMonthlyXp: number
  rank: number
  isEditing: boolean
}

export default function ProfileContent({ user, effectiveMonthlyXp, rank, isEditing }: ProfileContentProps) {
  const { t, language } = useLanguage()

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#121212] text-[#FFFFFF] antialiased pb-[64px]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[250px] bg-[#3B82F6]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-[340px] md:max-w-md mx-auto px-[6px] pt-16 relative z-10">
        
        {isEditing ? (
          <section className="mb-[24px] bg-[#1C1C1E] border border-[#2D2D2F] p-6 rounded-[24px] shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-[19px] font-bold tracking-tight">{t('profile.editProfile')}</h1>
              <Link 
                href="/profile" 
                className="w-10 h-10 rounded-full bg-[#222222] border border-[#2D2D2F] flex items-center justify-center text-[#6B7280] hover:text-white transition-all"
              >
                <X size={18} />
              </Link>
            </div>
            <ProfileForm user={user} />
          </section>
        ) : (
          <section className="flex flex-col items-center mb-[24px]">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-[12px] bg-[#222222] border border-[#2D2D2F] overflow-hidden flex items-center justify-center shadow-2xl">
                {user.image ? (
                  <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={32} className="text-[#6B7280]" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#10B981] p-1.5 rounded-[8px] border-[3px] border-[#121212]">
                <Fingerprint size={12} className="text-[#000000]" />
              </div>
            </div>
            <h1 className="text-[19px] font-bold tracking-tight">{user.name ?? t('profile.learner')}</h1>
            <p className="text-[#9CA3AF] text-[12px] font-medium mb-4">{user.email}</p>
            <Link 
              href="/profile?edit=true" 
              className="px-5 py-2 rounded-full bg-[#1C1C1E] border border-[#2D2D2F] text-[11px] font-bold uppercase tracking-widest text-[#3B82F6] hover:bg-[#222222] transition-colors"
            >
              {t('profile.editProfile')}
            </Link>
          </section>
        )}

        <div className="grid grid-cols-2 gap-[8px] mb-[20px]">
          <div className="bg-[#1C1C1E] border border-[#2D2D2F] p-4 rounded-[16px]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">{t('profile.memberSince')}</p>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#3B82F6]" />
              <p className="text-[14px] font-regular">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="bg-[#1C1C1E] border border-[#2D2D2F] p-4 rounded-[16px]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">{t('profile.lastActivity')}</p>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#3B82F6]" />
              <p className="text-[14px] font-regular">{new Date(user.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[8px] mb-[20px]">
          <div className="bg-[#1C1C1E] border border-[#FACC15]/10 p-4 rounded-[16px] flex flex-col items-center text-center">
            <Zap size={16} className="text-[#FACC15] mb-1" fill="currentColor" />
            <p className="text-[19px] font-bold text-[#FACC15]">{user.totalXp.toLocaleString()}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mt-0.5">{t('profile.totalXp')}</p>
          </div>
          <div className="bg-[#1C1C1E] border border-[#EF4444]/10 p-4 rounded-[16px] flex flex-col items-center text-center">
            <RedAnimatedFlame size={28} active={user.streakCount > 0} className="" />
            <p className={`text-[19px] font-bold ${user.streakCount > 0 ? 'text-[#EF4444]' : 'text-[#6B7280]'}`}>{user.streakCount}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mt-0.5">{t('profile.dayStreak')}</p>
          </div>
          <div className="bg-[#1C1C1E] border border-[#3B82F6]/10 p-4 rounded-[16px] flex flex-col items-center text-center">
            <Trophy size={16} className="text-[#3B82F6] mb-1" />
            <p className="text-[19px] font-bold text-[#3B82F6]">#{rank}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mt-0.5">{t('profile.rank')}</p>
          </div>
        </div>

        <div className="bg-[#1C1C1E] border border-[#2D2D2F] p-4 rounded-[16px] mb-[20px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-0.5">{t('profile.monthlyXp')}</p>
              <p className="text-[16px] font-bold text-[#FFFFFF]">{effectiveMonthlyXp.toLocaleString()} <span className="text-[11px] text-[#6B7280] font-normal">{t('profile.xpThisMonth')}</span></p>
            </div>
            <Link href="/ranking" className="text-[11px] font-bold uppercase tracking-widest text-[#3B82F6] hover:opacity-80 transition-opacity">
              {t('profile.viewRankings')}
            </Link>
          </div>
        </div>

        {/* Subscription Status Section */}
        <div className={`border rounded-[16px] overflow-hidden mb-[20px] ${
          user.isPro 
            ? 'bg-[#1C1C1E] border-[#FACC15]/20' 
            : 'bg-[#1C1C1E] border-[#2D2D2F]'
        }`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {user.isPro ? (
                  <Crown size={16} className="text-[#FACC15]" fill="currentColor" />
                ) : (
                  <Shield size={16} className="text-[#6B7280]" />
                )}
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">
                  {t('profile.currentPlan')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                user.isPro
                  ? 'bg-[#FACC15]/10 text-[#FACC15] border border-[#FACC15]/20'
                  : 'bg-[#222222] text-[#6B7280] border border-[#2D2D2F]'
              }`}>
                {user.isPro ? t('profile.planPro') : t('profile.planFree')}
              </span>
            </div>
            
            {user.isPro ? (
              <div>
                <p className="text-[14px] font-bold text-[#FACC15] mb-1">{t('profile.planName')}</p>
                <p className="text-[12px] text-[#9CA3AF]">
                  {user.subscriptionStatus === 'active' ? t('profile.activeSub') : user.subscriptionStatus}
                  {user.subscriptionEndsAt && ` · ${t('profile.renews')} ${new Date(user.subscriptionEndsAt).toLocaleDateString()}`}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-[14px] text-[#9CA3AF] mb-3">
                  {t('profile.upgradeDesc')}
                </p>
                <Link
                  href="/subscribe"
                  className="inline-flex items-center gap-2 bg-[#FACC15] text-[#000000] px-5 py-2.5 rounded-[10px] font-bold text-[12px] transition-all active:scale-95"
                >
                  <Crown size={14} fill="currentColor" />
                  {t('profile.upgradeToPro')}
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#1C1C1E] border border-[#2D2D2F] rounded-[16px] overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-[#262626] bg-[#222222]">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">{t('profile.settings')}</h3>
          </div>
          
          <div className="divide-y divide-[#262626]">
            <Link 
              href="/profile?edit=true" 
              className="w-full h-[56px] flex items-center justify-between px-5 hover:bg-[#222222] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[#121212] border border-[#2D2D2F] flex items-center justify-center">
                  <User size={16} className="text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors" />
                </div>
                <span className="text-[14px] font-regular text-[#FFFFFF]">{t('profile.editProfile')}</span>
              </div>
              <ChevronRight size={14} className="text-[#6B7280]" />
            </Link>

            <button className="w-full h-[56px] flex items-center justify-between px-5 hover:bg-[#222222] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[#121212] border border-[#2D2D2F] flex items-center justify-center">
                  <Mail size={16} className="text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors" />
                </div>
                <span className="text-[14px] font-regular text-[#FFFFFF]">{t('profile.emailAddress')}</span>
              </div>
              <ChevronRight size={14} className="text-[#6B7280]" />
            </button>

            <button className="w-full h-[56px] flex items-center justify-between px-5 hover:bg-[#222222] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[#121212] border border-[#2D2D2F] flex items-center justify-center">
                  <ShieldCheck size={16} className="text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors" />
                </div>
                <span className="text-[14px] font-regular text-[#FFFFFF]">{t('profile.security')}</span>
              </div>
              <ChevronRight size={14} className="text-[#6B7280]" />
            </button>
          </div>
        </div>

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
                <span className="text-[15px] font-bold text-[#EF4444] block leading-tight">{t('profile.signOut')}</span>
                <p className="text-[11px] text-[#EF4444]/50 font-bold uppercase tracking-wider">{t('profile.endSession')}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#EF4444]/30" />
          </Link>
        </div>

        <div className="mt-[20px] text-center">
          <div className="inline-block px-3 py-1 rounded-full border border-[#2D2D2F] bg-[#1C1C1E]">
            <p className="text-[11px] text-[#6B7280] font-bold uppercase tracking-widest">
              {t('profile.systemId')} {user.id.slice(0, 8)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
