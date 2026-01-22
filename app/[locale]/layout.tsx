import { routing } from "@/i18n/routing";
import { LocaleType } from "@/types";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import { Inter, Geist } from "next/font/google";
import { ReduxProvider } from "@/providers/ReduxProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as LocaleType)) notFound();

  // Load messages for this locale
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${geist.variable}`}
    >
      <body className="font-sans">
        <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
          <ReduxProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              {children}
            </NextIntlClientProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
