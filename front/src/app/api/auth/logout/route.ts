import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST() {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
    });

    const response = NextResponse.json({
      message: 'Sesión cerrada exitosamente',
    });

    response.cookies.delete('token');

    return response;
  } catch (error) {
    console.error('Error en API proxy logout:', error);

    const response = NextResponse.json({
      message: 'Sesión cerrada localmente',
    });

    response.cookies.delete('token');

    return response;
  }
}
