import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { LocaleType } from "@/types";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !routing.locales.includes(locale as LocaleType)) {
    locale = routing.defaultLocale;
  }

  return {
    locale: locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
