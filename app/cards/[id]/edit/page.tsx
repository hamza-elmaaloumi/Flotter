import { prisma } from '@/lib/prisma'
import EditCardForm from './EditCardForm'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../api/auth/[...nextauth]/route"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/login')
    
    const { id } = await params
    const card = await prisma.card.findUnique({ where: { id } })

    // SECURITY: Ensure card exists AND belongs to the user
    if (!card) return notFound()
    // @ts-ignore
    if (card.userId !== session.user.id) return redirect('/')

    const serializable = {
        ...card,
        currentIntervalMs: Number(card.currentIntervalMs || 0),
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <EditCardForm initialCard={serializable} />
        </div>
    )
}