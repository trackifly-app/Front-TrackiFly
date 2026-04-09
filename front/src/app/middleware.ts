import createMidleware from 'next-intl/middleware';

export default createMidleware({
  locales: ['es', 'en'],
  defaultLocale: 'es'
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};