import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function POST(request: NextRequest) {
  console.log('API_URL:', process.env.API_URL);
  try {
    const body = await request.json();
    console.log('Body recibido:', body); 

    const backendResponse = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    const setCookieHeader = backendResponse.headers.get('set-cookie');
    const response = NextResponse.json(data, { status: backendResponse.status });

    if (setCookieHeader) {
      const tokenMatch = setCookieHeader.match(/token=([^;]+)/);
      if (tokenMatch?.[1]) {
        response.cookies.set('token', tokenMatch[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });
      }
    }

    return response;
  } catch (error) {
    console.error('Error en API proxy google:', error);
    return NextResponse.json({ message: 'Error interno' }, { status: 500 });
  }
}