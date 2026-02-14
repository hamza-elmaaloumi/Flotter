import { prisma } from '../../../../lib/prisma'
import EditCardForm from './EditCardForm'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const card = await prisma.card.findUnique({
        where: { id },
        select: {
            id: true,
            userId: true,
            word: true,
            imageUrl: true,
            sentences: true,
            currentSentenceIndex: true,
            consecutiveCorrect: true,
            easeFactor: true,
            lastReviewedAt: true,
            nextReviewAt: true,
            currentIntervalMs: true,
        },
    })

    if (!card) return notFound()

    const serializable = {
        ...card,
        currentIntervalMs: Number(card.currentIntervalMs || 0),
    }

    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-6">
            <EditCardForm initialCard={serializable} />
        </div>
    )
}
