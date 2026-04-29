import createMiddleware from "next-intl/middleware";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose'; // Librería ligera compatible con Middleware

const intlMiddleware = createMiddleware({
  locales: ["es", "en"],
  defaultLocale: "es",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Obtenemos el token de la cookie (ajusta el nombre si es distinto a 'token')
  const token = request.cookies.get("token")?.value;

  // 2. Lógica para restringir /orders
  // Buscamos si la ruta actual es la de órdenes (manejando el prefijo de idioma)
  const isOrderPage = pathname.match(/\/(es|en)\/orders/) || pathname === '/orders';

  if (isOrderPage) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Decodificamos el JWT para obtener el payload
      const payload = decodeJwt(token);
      
      // Accedemos a la estructura que mencionaste: role.name
      // Nota: Asegúrate de que el payload tenga esta estructura exacta
      const userRole = (payload.role as { name: string })?.name;

      // Si el rol no tiene permiso (ejemplo: solo admins entran a orders)
      // O si quieres restringir a un rol específico:
      if (userRole === "user") { 
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // Si el token es inválido o está mal formado
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. Lógica para otras rutas protegidas
  const protectedRoutes = ["/dashboard", "/cart"];
  const isProtected = protectedRoutes.some(route => pathname.includes(route));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};