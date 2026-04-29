import createMiddleware from "next-intl/middleware";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Configuración de idiomas
const intlMiddleware = createMiddleware({
  locales: ["es", "en"],
  defaultLocale: "es",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userSession = request.cookies.get("token")?.value;

  /**
   * 2. Rutas protegidas REALES según tu navegación:
   * Agregamos '/orders' que es la que se ve en tu captura de pantalla.
   */
  const protectedRoutes = [
    "/orders",                  // La página de creación de envío (tu captura)
    "/dashboard/admin", // El monitoreo de pedidos de empresa
    "/dashboard/company",        // Dashboard general de empresa
    "/dashboard/user"                     // Carrito de compras
  ];
  
  // Verificamos si la ruta actual coincide con alguna protegida
  const isProtected = protectedRoutes.some(route => pathname.includes(route));

  // 3. Bloqueo si no hay sesión
  if (isProtected && !userSession) {
    // Detectamos el locale para redirigir a /es/login o /en/login
    const locale = pathname.split('/')[1] || 'es';
    const isLocaleValid = ["es", "en"].includes(locale);
    
    const loginPath = isLocaleValid ? `/${locale}/login` : '/login';
    const loginUrl = new URL(loginPath, request.url);
    
    // IMPORTANTE: Puedes añadir el callbackUrl para que después de loguearse vuelva a orders
    loginUrl.searchParams.set('callbackUrl', pathname);
    
    return NextResponse.redirect(loginUrl);
  }

  // 4. Si todo está bien, aplicar traducción
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};