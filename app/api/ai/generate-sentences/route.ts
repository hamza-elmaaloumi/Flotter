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
                        content: `Target Word: "${word}"`
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

                return NextResponse.json({
                    sentences: sentences.slice(0, 3),
                    imageQuery
                });
            }
        } catch (aiError) {
            console.error("Groq AI failed, trying Dictionary Fallback:", aiError);
        }

        // 2. Fallback Method: Free Dictionary API
        const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const dictData = await dictRes.json();

        if (Array.isArray(dictData)) {
            const examples: string[] = [];
            dictData[0].meanings.forEach((m: any) => {
                m.definitions.forEach((d: any) => {
                    if (d.example) examples.push(d.example);
                });
            });

            if (examples.length > 0) {
                return NextResponse.json({
                    sentences: examples.slice(0, 3),
                    imageQuery: word,
                    fallback: true
                });
            }
        }

        return NextResponse.json({
            sentences: [`You find yourself focusing deeply on the concept of ${word} until the meaning is etched into your mind.`],
            imageQuery: word
        });

    } catch (error: any) {
        console.error("General API Error:", error.message);
        return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
    }
}