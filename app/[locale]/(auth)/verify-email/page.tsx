"use client";

import { useAuth } from "@/hooks/use-auth";
import { extractErrorMessage } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  // Translations
  const t = useTranslations();
  const authT = (key: string) => t(`auth.${key}`);
  const successT = (key: string) => t(`apiSuccess.${key}`);
  const errorT = (key: string) => t(`apiError.${key}`);
  const locale = useLocale();

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { verifyEmail, verifyEmailError, verifyEmailSuccess } = useAuth();

  // Trigger verification on mount
  useEffect(() => {
    if (!token) {
      // Force navigate to signin
      router.push(`/${locale}/sign-in`);
      return;
    }

    verifyEmail(token);
  }, [token, verifyEmail, router, locale]);

  // Handle error with toast
  useEffect(() => {
    if (verifyEmailError) {
      toast.error(extractErrorMessage(verifyEmailError, errorT));
    } else if (verifyEmailSuccess) {
      toast.success(successT("verifyEmailSuccess"));
    }
  }, [verifyEmailError, verifyEmailSuccess]);

  if (verifyEmailSuccess) {
    return (
      <div className="space-y-8 max-w-lg mx-auto mt-[15%] min-h-screen text-center">
        <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          {/* Success checkmark icon */}
        </div>
        <h2 className="text-3xl font-bold">
          {authT("verifyEmailSuccessTitle")}
        </h2>
        <Link href={`/${locale}/sign-in`}>{authT("signIn")}</Link>
      </div>
    );
  }

  if (verifyEmailError) {
    return (
      <div className="space-y-8 max-w-lg mx-auto mt-[15%] min-h-screen text-center">
        <h2 className="text-3xl font-bold">
          {authT("verifyEmailFailedTitle")}
        </h2>
        {/* Error message and retry option */}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-lg mx-auto mt-[15%] min-h-screen">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-500/10 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
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
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {authT("verifyEmailTitle")}
        </h2>
        <p className="mt-4 text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {authT("verifyEmailDescription")}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {authT("havingTrouble")}{" "}
          <Link
            href={`/${locale}/support`}
            className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
          >
            {authT("contactSupport")}
          </Link>
        </p>
      </div>
    </div>
  );
}
