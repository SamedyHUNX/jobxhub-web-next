"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function EmailSentPage() {
  // Translations
  const t = useTranslations();
  const authT = (key: string) => t(`auth.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);
  const successT = (key: string) => t(`apiSuccess.${key}`);
  const errorT = (key: string) => t(`apiError.${key}`);
  const router = useRouter();

  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const decodedEmail = email ? decodeURIComponent(email) : "";

  // Force return to the forgotPassword page
  if (!email) {
    router.push("/forgot-password");
  }

  return (
    <div className="space-y-8">
      {/* Success State */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-500/10 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {authT("emailSent")}
        </h2>
        <p className="mt-4 text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {authT("emailSentDesc1")}{" "}
          <h5 className="text-gray-900 dark:text-white">{decodedEmail}</h5>
          {authT("emailSentDesc2")}
        </p>
      </div>

      <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-8 shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {authT("emailSentWarning1")}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {authT("emailSentWarning2")}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {authT("emailSentWarning3")}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
          <button
            onClick={() => router.push("/forgot-password")}
            className="w-full text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
          >
            {authT("resend")}
          </button>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {authT("rememberPassword")}{" "}
            <Link
              href="/sign-in"
              className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
            >
              {authT("signIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
