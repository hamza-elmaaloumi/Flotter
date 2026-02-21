import React from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ProfileContent from './ProfileContent'

export default async function ProfilePage(props: { searchParams: Promise<{ edit?: string }> }) {
  const searchParams = await props.searchParams
  const isEditing = searchParams.edit === 'true'
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  // @ts-ignore
  const userId = session.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, name: true, email: true, image: true,
      createdAt: true, updatedAt: true,
      totalXp: true, monthlyXp: true, monthlyXpResetAt: true,
      streakCount: true, lastActiveDate: true,
      isPro: true, subscriptionStatus: true,
      subscriptionStartedAt: true, subscriptionEndsAt: true,
    },
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

  // Calculate monthly XP (handle stale month)
  const now = new Date()
  const currentMonth = now.getUTCMonth()
  const currentYear = now.getUTCFullYear()
  const resetMonth = user.monthlyXpResetAt.getUTCMonth()
  const resetYear = user.monthlyXpResetAt.getUTCFullYear()
  const isStale = resetMonth !== currentMonth || resetYear !== currentYear
  const effectiveMonthlyXp = isStale ? 0 : user.monthlyXp

  // Calculate rank
  const usersAbove = await prisma.user.count({
    where: {
      monthlyXp: { gt: effectiveMonthlyXp },
      monthlyXpResetAt: { gte: new Date(currentYear, currentMonth, 1) },
    },
  })
  const rank = usersAbove + 1

  // Serialize dates for client component
  const serializedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    totalXp: user.totalXp,
    monthlyXp: user.monthlyXp,
    streakCount: user.streakCount,
    isPro: user.isPro,
    subscriptionStatus: user.subscriptionStatus,
    subscriptionStartedAt: user.subscriptionStartedAt?.toISOString() ?? null,
    subscriptionEndsAt: user.subscriptionEndsAt?.toISOString() ?? null,
  }

  return (
    <ProfileContent 
      user={serializedUser} 
      effectiveMonthlyXp={effectiveMonthlyXp} 
      rank={rank} 
      isEditing={isEditing} 
    />
  )
}