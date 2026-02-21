import { prisma } from '@/lib/prisma'

/**
 * Awards XP to a user and updates their streak.
 * - Adds XP to both totalXp and monthlyXp.
 * - Resets monthlyXp if the current month differs from monthlyXpResetAt.
 * - Updates daily streak: increments if last active was yesterday, resets to 1 if gap > 1 day.
 */
export async function awardXp(userId: string, amount: number) {
  // Fetch user details including pro status for streak protection
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      monthlyXp: true, 
      monthlyXpResetAt: true, 
      streakCount: true, 
      lastActiveDate: true,
      isPro: true 
    },
  })

  if (!user) throw new Error('User not found')

  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10) // "YYYY-MM-DD"

  // --- Monthly XP Reset Logic ---
  const resetMonth = user.monthlyXpResetAt.getUTCMonth()
  const resetYear = user.monthlyXpResetAt.getUTCFullYear()
  const currentMonth = now.getUTCMonth()
  const currentYear = now.getUTCFullYear()

  const isNewMonth = currentMonth !== resetMonth || currentYear !== resetYear
  const newMonthlyXp = isNewMonth ? amount : user.monthlyXp + amount

  // --- Streak Logic with Pro Freeze Protection ---
  let newStreak = user.streakCount
  if (user.lastActiveDate) {
    const lastStr = user.lastActiveDate.toISOString().slice(0, 10)
    if (lastStr === todayStr) {
      // Same day — streak unchanged
    } else {
      const lastDate = new Date(lastStr)
      const todayDate = new Date(todayStr)
      const diffMs = todayDate.getTime() - lastDate.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        newStreak = user.streakCount + 1
      } else if (user.isPro) {
        // Streak Protection: Pro users keep their streak count even if they miss days
        // It doesn't INCREMENT for missed days, but it doesn't RESET either.
        // We'll increment from their last streak count now that they are active again.
        newStreak = user.streakCount + 1
      } else {
        newStreak = 1 // broke streak
      }
    }
  } else {
    newStreak = 1 // first ever activity
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      totalXp: { increment: amount },
      monthlyXp: newMonthlyXp,
      monthlyXpResetAt: isNewMonth ? now : undefined,
      streakCount: newStreak,
      lastActiveDate: now,
    },
  })

  return { xpAwarded: amount, newStreak }
}
