import { prisma } from '@/lib/prisma'

/**
 * Awards XP to a user and updates their streak.
 * - Adds XP to both totalXp and monthlyXp (atomically).
 * - Resets monthlyXp if the current month differs from monthlyXpResetAt.
 * - Updates daily streak: increments if last active was yesterday, resets to 1 if gap > 1 day.
 * - Pro users get a 1-day streak freeze (gap of up to 2 days preserves streak).
 *
 * Uses an interactive transaction to prevent race conditions on monthlyXp (ISSUE-004).
 */
export async function awardXp(userId: string, amount: number) {
  return await prisma.$transaction(async (tx) => {
    // Read user inside the transaction for serializable isolation
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        monthlyXp: true,
        monthlyXpResetAt: true,
        streakCount: true,
        lastActiveDate: true,
        isPro: true,
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

    // --- Streak Logic with Pro Freeze Protection (ISSUE-003) ---
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
        } else if (user.isPro && diffDays === 2) {
          // ISSUE-003: Pro users get a 1-day streak freeze (max gap of 2 days).
          // If they miss more than 1 day, the streak resets like normal users.
          newStreak = user.streakCount + 1
        } else {
          newStreak = 1 // broke streak
        }
      }
    } else {
      newStreak = 1 // first ever activity
    }

    // ISSUE-004: Use atomic increment for monthlyXp to prevent race conditions.
    // If new month, reset to `amount`; otherwise use Prisma's atomic `increment`.
    if (isNewMonth) {
      await tx.user.update({
        where: { id: userId },
        data: {
          totalXp: { increment: amount },
          monthlyXp: amount,
          monthlyXpResetAt: now,
          streakCount: newStreak,
          lastActiveDate: now,
        },
      })
    } else {
      await tx.user.update({
        where: { id: userId },
        data: {
          totalXp: { increment: amount },
          monthlyXp: { increment: amount },
          streakCount: newStreak,
          lastActiveDate: now,
        },
      })
    }

    return { xpAwarded: amount, newStreak }
  })
}
