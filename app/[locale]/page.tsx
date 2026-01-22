"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { useAppSelector } from "@/stores/hooks";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";

export default function HomePage() {
  const t = useTranslations("HomePage");

  const { token } = useAppSelector((state) => state.auth);

  if (!token) redirect("/sign-in");

  return (
    <div>
      <ThemeToggle />
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
