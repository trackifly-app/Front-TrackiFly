import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    if (!API_URL) {
      console.error('Error en API proxy google: API_URL no configurada');
      return NextResponse.json({ message: 'API_URL no configurada' }, { status: 500 });
    }

    const body = await request.json();

    const backendResponse = await fetch(`${API_URL.replace(/\/$/, '')}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json().catch(() => ({
      message: 'Respuesta invalida del backend',
    }));

    if (!backendResponse.ok) {
      console.error('Error backend google:', backendResponse.status, data);
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
