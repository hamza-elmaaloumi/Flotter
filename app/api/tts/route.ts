import { NextResponse } from 'next/server';
import * as googleTTS from 'google-tts-api';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  const provider = searchParams.get('provider') || 'google'; 

  if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });

  try {
    let arrayBuffer: ArrayBuffer;

    if (provider === 'unreal' && process.env.UNREAL_SPEECH_KEY) {
      // --- OPTION A: UNREAL SPEECH (High Quality) ---
      // FIXED: Removed trailing space from the URL
      const response = await fetch('https://api.v6.unrealspeech.com/stream', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.UNREAL_SPEECH_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Text: text,
          VoiceId: 'Will', 
          Bitrate: '192k',
          Speed: '0',
          Pitch: '1.0',
          Codec: 'libmp3lame', 
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Unreal Speech Error Details:', errorText);
        throw new Error('Unreal Speech API error');
      }
      arrayBuffer = await response.arrayBuffer();

    } else {
      // --- OPTION B: GOOGLE TTS (Fallback) ---
      // FIXED: Removed trailing space from the host URL
      const url = googleTTS.getAudioUrl(text, {
        lang: 'en',
        slow: false,
        host: 'https://translate.google.com',
      });
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Google TTS error');
      arrayBuffer = await response.arrayBuffer();
    }

    // XP is no longer awarded here — it was exploitable via pre-fetching.
    // Audio XP should be awarded when the user completes a card review.

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error("TTS Route Error:", error);
    return NextResponse.json({ error: 'Failed to fetch audio' }, { status: 500 });
  }
}