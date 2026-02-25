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
        // ISSUE-007: Use atomic increment-and-check to prevent race conditions.
        // First, reset the day counter if needed, then atomically claim a slot.
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

        // If it's a new day, reset the counter first
        if (isNewDay) {
            await prisma.user.update({
                where: { id: userId },
                data: { aiGenerationsToday: 0, aiGenerationsResetAt: now },
            });
        }

        // For free users, atomically claim a generation slot before calling the AI API
        if (!user.isPro) {
            const claimResult = await prisma.user.updateMany({
                where: {
                    id: userId,
                    aiGenerationsToday: { lt: FREE_DAILY_LIMIT },
                },
                data: {
                    aiGenerationsToday: { increment: 1 },
                },
            });

            if (claimResult.count === 0) {
                return NextResponse.json({
                    error: 'daily_limit_reached',
                    message: `You've used all ${FREE_DAILY_LIMIT} free AI generations for today. Subscribe to Pro for unlimited generations!`,
                    limit: FREE_DAILY_LIMIT,
                    used: FREE_DAILY_LIMIT,
                }, { status: 429 });
            }
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
                        content: `Role: Expert Mnemonist, Neuro-Linguistic Architect & Master of Visceral Storytelling.

                        Output: Strict JSON matching this schema:
                        { 
                            "primaryDefinition": "string (the most common, single meaning of the word)",
                            "sentences": ["string", "string", "string"], 
                            "imageQuery": "string" 
                        }

                        CRITICAL CONSTRAINTS:
                        1. TARGET WORD: Every sentence MUST include the target word. All 3 sentences must use its one most common meaning.
                        2. A1-A2 VOCABULARY: Use ONLY ultra-simple, beginner-level words.
                        3. EXTREME EMOTION (CRITICAL): NEVER write weak, boring, or everyday sentences. Every sentence MUST be emotionally intense, shocking, or dramatic (e.g., sheer panic, heartbreak, fear, pain, extreme danger, hilarious embarrassment...). Make it feel like a high-stakes movie scene.
                        4. NEVER use explicit emotional labels, Instead, you must SHOW the intensity by describing what happens physically, mentally, or in the environment—how the target word triggers a dramatic effect on the scene, the body, or the situation.
                        5. LENGTH & DETAIL: Sentences MUST be fully detailed and exactly 15 to 20 words long. NEVER write short sentences. Use the simple words to paint a vivid, intense picture.
                        6. 100% VARIETY: The 3 sentences must be completely unrelated scenarios, each with a different extreme emotion.

                        IMAGE QUERY RULES (For Unsplash API):
                            - Unsplash requires broad, generic photography tags. It fails with specific actions.
                            - Look at the physical setting of Sentence 1. 
                            - Provide exactly 2 or 3 simple nouns/adjectives representing the setting or vibe.
                            - NEVER use pronouns ("you", "I").
                            - NEVER use verbs or actions.
                            - STRICTEST RULE: NEVER include the target word itself in the imageQuery. Translate the target word into a visual object or background.`
                    },
                    {
                        role: "user",
                        content: `Target Word: "${sanitizedWord}"`
                    },
                ],
                model: "moonshotai/kimi-k2-instruct-0905",
                temperature: 0.85,
                max_tokens: 300,
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

                // Generation slot already claimed atomically above for free users.
                // For Pro users, track usage for analytics.
                if (user.isPro) {
                    await prisma.user.update({
                        where: { id: userId },
                        data: {
                            aiGenerationsToday: { increment: 1 },
                        },
                    });
                }

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
                // Generation slot already claimed atomically above for free users.
                if (user.isPro) {
                    await prisma.user.update({
                        where: { id: userId },
                        data: {
                            aiGenerationsToday: { increment: 1 },
                        },
                    });
                }

                return NextResponse.json({
                    sentences: examples.slice(0, 3),
                    imageQuery: sanitizedWord,
                    fallback: true
                });
            }
        }

        // Generation slot already claimed atomically above for free users.
        if (user.isPro) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    aiGenerationsToday: { increment: 1 },
                },
            });
        }

        return NextResponse.json({
            sentences: [`You find yourself focusing deeply on the concept of ${sanitizedWord} until the meaning is etched into your mind.`],
            imageQuery: sanitizedWord
        });

    } catch (error: any) {
        console.error("General API Error:", error.message);
        return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
    }
}