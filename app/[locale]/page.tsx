"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { useAppSelector } from "@/stores/hooks";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const t = useTranslations("home");
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/sign-in`);
    }
  }, [user, router, locale]);

  if (!user) return null;

  return (
    <div>
      <ThemeToggle />
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
