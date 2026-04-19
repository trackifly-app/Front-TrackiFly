import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";

const locales = ["es", "en"];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(locales, requested) ? requested : "es";

  const messages = locale === "en" 
    ? (await import("../../messages/en.json")).default
    : (await import("../../messages/es.json")).default;

  return {
    locale,
    messages,
  };
});