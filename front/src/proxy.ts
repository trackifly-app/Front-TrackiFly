import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const locales = ['es', 'en'];
const defaultLocale = 'es';

const AUTH_COOKIE_NAME = 'token';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
});

const authRoutes = ['/login', '/register', '/registercompany'];
const privateRoutes = ['/dashboard', '/orders'];

function getLocaleFromPathname(pathname: string) {
  const segments = pathname.split('/');
  const possibleLocale = segments[1];

  return locales.includes(possibleLocale) ? possibleLocale : defaultLocale;
}

function removeLocaleFromPathname(pathname: string) {
  const segments = pathname.split('/');
  const possibleLocale = segments[1];

  if (locales.includes(possibleLocale)) {
    const pathWithoutLocale = '/' + segments.slice(2).join('/');
    return pathWithoutLocale === '/' ? '/' : pathWithoutLocale.replace(/\/$/, '');
  }

  return pathname === '/' ? '/' : pathname.replace(/\/$/, '');
}

function isPathMatching(pathname: string, routes: string[]) {
  return routes.some((route) => {
    if (route === '/') return pathname === '/';
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const locale = getLocaleFromPathname(pathname);
  const cleanPathname = removeLocaleFromPathname(pathname);

  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = Boolean(sessionCookie);

  const isPrivateRoute = isPathMatching(cleanPathname, privateRoutes);
  const isAuthRoute = isPathMatching(cleanPathname, authRoutes);

  if (!isAuthenticated && isPrivateRoute) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
