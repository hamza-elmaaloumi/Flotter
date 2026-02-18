import { NextResponse } from 'next/server';
import * as googleTTS from 'google-tts-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  // We add a provider param to choose between 'high-quality' or 'fallback'
  const provider = searchParams.get('provider') || 'google'; 

  if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });

  try {
    let arrayBuffer: ArrayBuffer;

    if (provider === 'unreal') {
      // --- OPTION A: UNREAL SPEECH (High Quality) ---
      const response = await fetch('https://api.v6.unrealspeech.com/stream', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.UNREAL_SPEECH_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Text: text,
          VoiceId: 'Dan', // Options: 'Liv', 'Will', 'Scarlett', 'Dan', 'Amy'
          Bitrate: '192k',
          Speed: '0',
          Pitch: '1.0',
          Codec: 'libmp3lame', 
        }),
      });

      if (!response.ok) throw new Error('Unreal Speech API error');
      arrayBuffer = await response.arrayBuffer();

    } else {
      // --- OPTION B: GOOGLE TTS (Fallback) ---
      const url = googleTTS.getAudioUrl(text, {
        lang: 'en',
        slow: false,
        host: 'https://translate.google.com',
      });
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Google TTS error');
      arrayBuffer = await response.arrayBuffer();
    }

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        // Cache for 1 year to save your 250k credits on repeated cards!
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json({ error: 'Failed to fetch audio' }, { status: 500 });
  }
}