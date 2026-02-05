import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.BACKEND_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'http://backend:8000'
    : 'http://localhost:8000');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.text || !body.source_lang || !body.target_lang) {
      return NextResponse.json(
        { error: 'Missing required fields: text, source_lang, target_lang' },
        { status: 400 }
      );
    }

    // Forward request to Python backend
    const response = await fetch(`${BACKEND_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: body.text,
        source_lang: body.source_lang,
        target_lang: body.target_lang,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || 'Translation failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Translation API error:', error);
    
    // Check if backend is unreachable
    if (error.code === 'ECONNREFUSED' || error.message?.includes('fetch failed')) {
      return NextResponse.json(
        { error: 'Translation service is unavailable. Please ensure the backend is running.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Translation API endpoint. Use POST method.',
    backend_url: BACKEND_URL,
  });
}
