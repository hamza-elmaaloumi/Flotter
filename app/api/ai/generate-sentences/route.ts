import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { word } = await req.json();

        if (!word) {
            return NextResponse.json({ error: "Word is required" }, { status: 400 });
        }

        try {
            // 1. Primary Method: Call Groq (Llama 3)
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are an elite cognitive scientist specializing in memory encoding. 
                        Your mission: Generate "Neural Anchor" sentences that maximize vocabulary retention through proven mechanisms:
                        - Self-Reference Effect (self-relevant processing)
                        - Multi-sensory binding (visual + tactile + auditory)
                        - Emotional Salience (surprise, mild embarrassment, or humor)
                        - Production Effect (rhythm and mouth-feel for speaking aloud)
                        - Elaborative Encoding (connecting to existing self-knowledge)

                        CRITICAL RULES:
                        1. EXACTLY 12-18 words per sentence (optimal for working memory)
                        2. ALWAYS use second-person "You" to trigger self-referential processing
                        3. Include at least ONE concrete sensory detail (texture, temperature, sound)
                        4. Create mild emotional dissonance (awkward, funny, or slightly shocking)
                        5. Ensure the target word feels like the "punchline" or climax of the sentence
                        6. Use present tense for immediacy
                        7. Avoid abstract concepts; ground everything in physical reality

                        Return ONLY a JSON array of 3 strings. No markdown, no explanation.`
                    },
                    {
                        role: "user",
                        content: `Create 3 Neural Anchor sentences for: "${word}"

                        Encoding Requirements:
                        - SENSORY: Include vivid visual + one other sense (touch/taste/sound)
                        - EMOTIONAL: Make it slightly absurd, embarrassing, or surprisingly poignant
                        - SELF-REFERENCE: Force the reader to mentally simulate the scenario as themselves
                        - RHYTHM: Write for speaking aloud—cadence matters
                        - CONTEXT: Show the word's meaning through concrete situation, not definition

                        Examples of quality:
                        Word: "serendipity"
                        Good: "You find a love letter meant for a stranger tucked in your library book, and your heart flutters with serendipity."
                        Bad: "Serendipity is when good things happen by accident."

                        Format: ["sentence 1", "sentence 2", "sentence 3"]`
                    },
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.85, // Higher for creative emotional combinations
                max_tokens: 250,
                response_format: { type: "json_object" },
            });

            const responseContent = completion.choices[0]?.message?.content;

            if (responseContent) {
                const parsed = JSON.parse(responseContent);
                // Handle cases where the AI wraps it in an object like { "sentences": [...] }
                const sentences = Array.isArray(parsed) ? parsed : (parsed.sentences || Object.values(parsed)[0]);
                return NextResponse.json({ sentences: sentences.slice(0, 3) });
            }
        } catch (aiError) {
            console.error("Groq AI failed, trying Dictionary Fallback:", aiError);
        }

        // 2. Fallback Method: Free Dictionary API (No Key Needed)
        const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const dictData = await dictRes.json();

        if (Array.isArray(dictData)) {
            const examples: string[] = [];
            // Drill down into the dictionary data to find example sentences
            dictData[0].meanings.forEach((m: any) => {
                m.definitions.forEach((d: any) => {
                    if (d.example) examples.push(d.example);
                });
            });

            if (examples.length > 0) {
                return NextResponse.json({ sentences: examples.slice(0, 3), fallback: true });
            }
        }

        // 3. Last Resort: Generic sentence
        return NextResponse.json({
            sentences: [`This is an example sentence using the word ${word}.`]
        });

    } catch (error: any) {
        console.error("General API Error:", error.message);
        return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
    }
}