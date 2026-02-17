import { NextResponse } from 'next/server';
import * as googleTTS from 'google-tts-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');

  if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });

  try {
    const url = googleTTS.getAudioUrl(text, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
    });

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch audio' }, { status: 500 });
  }
}