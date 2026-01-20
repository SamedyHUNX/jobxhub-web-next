"use client";

import { useTranslations } from "next-intl";
import { ThemeToggle } from "../components/ThemeToggle";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <div>
      <ThemeToggle />
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
