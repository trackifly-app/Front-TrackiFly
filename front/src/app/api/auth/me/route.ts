import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    const backendResponse = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Cookie: `token=${token}`,
      },
      cache: 'no-store',
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('Error en API proxy me:', error);

    return NextResponse.json({ message: 'Error al obtener sesión' }, { status: 500 });
  }
}
