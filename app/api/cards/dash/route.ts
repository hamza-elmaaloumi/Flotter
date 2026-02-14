import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"




export async function GET(req: Request) {
    try {
        const url = new URL(req.url)
        let userId = url.searchParams.get('userId')

        if (!userId) {
            try {
                const body = await req.json()
                userId = body?.userId
            } catch (e) {
            }
        }

        if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

        const totalCardsCount = await prisma.card.count({ where: { userId } })
        const dueCardsCount = await prisma.card.count({ where: { userId, nextReviewAt: { lte: new Date() } } })

        const sevenDaysLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        const learnedCardsCount = await prisma.card.count({ where: { userId, nextReviewAt: { gt: sevenDaysLater } } })

        const totalCards = await prisma.card.findMany({
            where: { userId },
            select: { id: true, imageUrl: true, sentences: true, nextReviewAt: true },
            orderBy: { nextReviewAt: 'asc' }
        })

        return NextResponse.json({ totalCardsCount, dueCardsCount, learnedCardsCount, cards: totalCards })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}