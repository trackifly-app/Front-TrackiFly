import createMiddleware from "next-intl/middleware";
import { defineRouting } from "next-intl/routing";

export default createMiddleware(
  defineRouting({
    locales: ["es", "en"],
    defaultLocale: "es",
  })
);

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};