import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const FREE_DAILY_LIMIT = 3;

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // @ts-ignore
        const userId = session.user.id;

        // Rate limit: 10 AI generation requests per minute per user
        const rateLimitResult = checkRateLimit(`ai:${userId}`, { maxRequests: 10, windowMs: 60 * 1000 });
        if (!rateLimitResult.success) {
            return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }

        // Check subscription & daily limit for free users
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isPro: true, aiGenerationsToday: true, aiGenerationsResetAt: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Reset daily counter if it's a new day
        const now = new Date();
        const lastReset = new Date(user.aiGenerationsResetAt);
        const isNewDay = now.toISOString().slice(0, 10) !== lastReset.toISOString().slice(0, 10);

        let currentGenerations = isNewDay ? 0 : user.aiGenerationsToday;

        if (!user.isPro && currentGenerations >= FREE_DAILY_LIMIT) {
            return NextResponse.json({
                error: 'daily_limit_reached',
                message: `You've used all ${FREE_DAILY_LIMIT} free AI generations for today. Subscribe to Pro for unlimited generations!`,
                limit: FREE_DAILY_LIMIT,
                used: currentGenerations,
            }, { status: 429 });
        }

        const { word } = await req.json();

        if (!word) {
            return NextResponse.json({ error: "Word is required" }, { status: 400 });
        }

        // VUL-009: Sanitize input to prevent prompt injection
        // Only allow alphabetic characters, hyphens, and spaces (valid for English words)
        const sanitizedWord = String(word).trim().slice(0, 50)
        if (!/^[a-zA-Z\s-]+$/.test(sanitizedWord)) {
            return NextResponse.json({ error: "Invalid word format. Only letters, spaces, and hyphens are allowed." }, { status: 400 });
        }

        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `Role: Expert Mnemonist.
                            Task: Create a visual memory anchor.
                            Return JSON: { "sentences": [3 strings], "imageQuery": "string" }

                            RULES for Sentences:
                            1. Count: Exactly 3. Length: 14-18 words.
                            2. Structure: Start with "You". Use high-contrast sensory imagery (touch, sight, sound).
                            3. Context: The scenario must force the word's meaning.
                            4. Vibe: Cinematic, emotional, humor, or visceral.
                            5. The word must appear in each sentence
                            6. Ensure the target word feels like the "punchline" or climax of the sentence

                            RULES for ImageQuery:
                            1. Create a concrete search term (2-4 words) for Unsplash.
                            2. Must describe the PHYSICAL SCENE in the sentences, NOT the abstract word.
                            3. Example: If word is "ephemeral" & sentence is about a wilting flower, query is "wilted rose", NOT "ephemeral".`
                    },
                    {
                        role: "user",
                        content: `Target Word: "${sanitizedWord}"`
                    },
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.85,
                max_tokens: 200, // Reduced max_tokens since we want short sentences
                response_format: { type: "json_object" },
            });

            const responseContent = completion.choices[0]?.message?.content;

            if (responseContent) {
                const parsed = JSON.parse(responseContent);

                // Bulletproof extraction for JSON Object mode
                let sentences = [];
                let imageQuery = word;

                if (Array.isArray(parsed.sentences)) {
                    sentences = parsed.sentences;
                }

                if (parsed.imageQuery) {
                    imageQuery = parsed.imageQuery;
                }

                // Increment generation counter
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        aiGenerationsToday: isNewDay ? 1 : { increment: 1 },
                        aiGenerationsResetAt: isNewDay ? now : undefined,
                    },
                });

                return NextResponse.json({
                    sentences: sentences.slice(0, 3),
                    imageQuery
                });
            }
        } catch (aiError) {
            console.error("Groq AI failed, trying Dictionary Fallback:", aiError);
        }

        // 2. Fallback Method: Free Dictionary API
        const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(sanitizedWord)}`);
        const dictData = await dictRes.json();

        if (Array.isArray(dictData)) {
            const examples: string[] = [];
            dictData[0].meanings.forEach((m: any) => {
                m.definitions.forEach((d: any) => {
                    if (d.example) examples.push(d.example);
                });
            });

            if (examples.length > 0) {
                // Increment generation counter
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        aiGenerationsToday: isNewDay ? 1 : { increment: 1 },
                        aiGenerationsResetAt: isNewDay ? now : undefined,
                    },
                });

                return NextResponse.json({
                    sentences: examples.slice(0, 3),
                    imageQuery: sanitizedWord,
                    fallback: true
                });
            }
        }

        // Increment generation counter
        await prisma.user.update({
            where: { id: userId },
            data: {
                aiGenerationsToday: isNewDay ? 1 : { increment: 1 },
                aiGenerationsResetAt: isNewDay ? now : undefined,
            },
        });

        return NextResponse.json({
            sentences: [`You find yourself focusing deeply on the concept of ${sanitizedWord} until the meaning is etched into your mind.`],
            imageQuery: sanitizedWord
        });

    } catch (error: any) {
        console.error("General API Error:", error.message);
        return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
    }
}