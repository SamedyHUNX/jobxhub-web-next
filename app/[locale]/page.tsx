"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { useAppSelector } from "@/stores/hooks";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const t = useTranslations("home");
  const { token } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!token) {
      router.push(`/${locale}/sign-in`);
    }
  }, [token, router, locale]);

  if (!token) return null;

  return (
    <div>
      <ThemeToggle />
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
