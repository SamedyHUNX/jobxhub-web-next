"use client";

import { useAuth } from "@/hooks/use-auth";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import failedImg from "@/public/assets/images/failed.webp";
import successImg from "@/public/assets/images/success.webp";
import BrandLogo from "@/components/BrandLogo";
import { extractErrorMessage } from "@/lib/utils";

export default function VerifyEmailPage() {
  // Translations
  const t = useTranslations();
  const authT = (key: string) => t(`auth.${key}`);
  const errorT = (key: string) => t(`apiErrors.${key}`);
  const locale = useLocale();

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { verifyEmail, verifyEmailError, verifyEmailSuccess } = useAuth();

  // Trigger verification on mount
  useEffect(() => {
    if (!token) {
      // Force navigate to signin
      router.push(`/auth/sign-in`);
      return;
    }

    verifyEmail(token);
  }, [token, verifyEmail, router, locale]);

  if (verifyEmailSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <BrandLogo />
        <div className="space-y-6 max-w-md text-center mt-4">
          <div className="mx-auto w-50 h-50 bg-gray-900 rounded-full flex items-center justify-center p-4">
            <Image
              src={successImg}
              alt="success"
              width={200}
              height={200}
              className="mix-blend-screen"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {authT("verifyEmailSuccessTitle")}
          </h2>
          <Link
            href={`/${locale}/sign-in`}
            className="inline-block mt-4 px-6 py-3 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-600 transition-colors"
          >
            {authT("signIn")}
          </Link>
        </div>
      </div>
    );
  }

  if (verifyEmailError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <BrandLogo />
        <div className="space-y-6 max-w-md text-center mt-4">
          <div className="mx-auto w-50 h-50 bg-gray-900 rounded-full flex items-center justify-center p-4">
            <Image
              src={failedImg}
              alt="failed"
              width={200}
              height={200}
              className="mix-blend-screen"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {authT("verifyEmailFailedTitle")}
          </h2>
          <p className="text-red-600 text-base p-4">
            {extractErrorMessage(verifyEmailError, errorT)}
          </p>
          <Link
            href={`/${locale}/support`}
            className="inline-block mt-4 px-6 py-3 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-600 transition-colors"
          >
            {authT("contactSupport")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <BrandLogo />
      <div className="space-y-6 max-w-md text-center mt-4">
        <div className="mx-auto w-16 h-16 bg-blue-500/10 dark:bg-blue-500/10 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-600 dark:text-blue-500 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {authT("verifyEmailTitle")}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400">
          {authT("verifyEmailDescription")}
        </p>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {authT("havingTrouble")}{" "}
            <Link
              href={`/support`}
              className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
            >
              {authT("contactSupport")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
