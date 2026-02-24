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
                        content: `Role: Expert Mnemonist & Language Architect.
            
                        Output: Strict JSON { "sentences": [string, string, string], "imageQuery": "string" }

                        CRITICAL CONSTRAINT: The three sentences are INDEPENDENT. They appear to the user on DIFFERENT DAYS as part of spaced repetition. They NEVER appear together. Each sentence must create a complete, standalone memory.

                        TASK: Create 3 parallel "Memory Tetrad" contexts for the target word. Each sentence is a self-contained world.

                        METHODOLOGY PER SENTENCE (Atomic Unit):
                        Each sentence MUST independently contain:
                            1. Instant Visual Anchor: Concrete physical scene (user can picture it immediately)
                            2. Sensory/Motor Grounding: Tactile sensation, physical effort, or body movement
                            3. Target Word Climax: The word appears as the emotional or logical peak
                            4. Second-Person Immersion: "You" experiencing it directly

                        STRICT RULES:
                            - INDEPENDENCE: Sentences share NO characters, objects, or scenes. Different contexts entirely.
                            - LENGTH: Exactly 12-18 words per sentence.
                            - VOCABULARY: Ultra-simple English (A1-A2) except target word.
                            - TARGET WORD HANDLING:
                                • If "to [verb]" → use natural conjugation (bow/bows/bowing/bowed)
                                • Must appear grammatically in each sentence as the climax
                            - VARIETY: Each sentence should explore a DIFFERENT facet/usage of the word (physical, emotional, metaphorical)
                            - VIBE: Each standalone scene should be surprising, slightly absurd, or emotionally jarring.

                        IMAGE QUERY RULES:
                            - Describe the specific visual scene from Sentence 1 ONLY (the first review context).
                            - 3-5 concrete words: [Subject] + [Action] + [Setting/Detail]
                            - Must work as an Unsplash search term.`
                    },
                    {
                        role: "user",
                        content: `Target Word: "${sanitizedWord}"`
                    },
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.85,
                max_tokens: 200, // Slight buffer for JSON formatting
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