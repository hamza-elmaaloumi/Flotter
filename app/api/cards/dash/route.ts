import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { getEffectiveStreak } from "@/lib/xp"

export async function GET(req: Request) {
    try {
        // 1. Get the secure session from the server
        const session = await getServerSession(authOptions)

        // 2. Reject the request if no valid session exists
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 3. Extract the User ID from the session (the single source of truth)
        // @ts-ignore
        const userId = session.user.id

        // 4. Perform database operations using the secure ID
        const totalCardsCount = await prisma.card.count({ where: { userId } })
        const dueCardsCount = await prisma.card.count({ 
            where: { userId, nextReviewAt: { lte: new Date() } } 
        })

        const sevenDaysLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        const learnedCardsCount = await prisma.card.count({ 
            where: { userId, nextReviewAt: { gt: sevenDaysLater } } 
        })

        const totalCards = await prisma.card.findMany({
            where: { userId },
            select: { id: true, imageUrl: true, word: true, sentences: true, nextReviewAt: true, createdAt: true, lastReviewedAt: true },
            orderBy: { nextReviewAt: 'asc' }
        })

        // Fetch user streak & XP & subscription
        const userXp = await prisma.user.findUnique({
            where: { id: userId },
            select: { totalXp: true, monthlyXp: true, monthlyXpResetAt: true, streakCount: true, lastActiveDate: true, isPro: true },
        })

        // Apply stale-month correction — same logic as the ranking API
        // so users see consistent XP on their own dashboard and the leaderboard.
        const now = new Date()
        let correctedMonthlyXp = userXp?.monthlyXp ?? 0
        if (userXp?.monthlyXpResetAt) {
            const resetMonth = userXp.monthlyXpResetAt.getUTCMonth()
            const resetYear = userXp.monthlyXpResetAt.getUTCFullYear()
            if (resetMonth !== now.getUTCMonth() || resetYear !== now.getUTCFullYear()) {
                correctedMonthlyXp = 0
            }
        }

        return NextResponse.json({ 
            totalCardsCount, 
            dueCardsCount, 
            learnedCardsCount, 
            cards: totalCards,
            streak: getEffectiveStreak(
                userXp?.streakCount ?? 0,
                userXp?.lastActiveDate ?? null,
                userXp?.isPro ?? false,
            ),
            lastActiveDate: userXp?.lastActiveDate,
            totalXp: userXp?.totalXp ?? 0,
            monthlyXp: correctedMonthlyXp,
            isPro: userXp?.isPro ?? false,
        })
    } catch (err) {
        console.error("Dashboard API Error:", err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}