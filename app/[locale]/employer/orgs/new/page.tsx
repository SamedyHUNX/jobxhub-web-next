"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateNewOrgPage() {
  // Translations
  const t = useTranslations();
  const newOrgT = (key: string) => t(`employer.organizations.newPage.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);
  const successT = (key: string) => t(`apiSuccess.${key}`);
  const errorT = (key: string) => t(`apiError.${key}`);

  const router = useRouter();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  return null;
}
