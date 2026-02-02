"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import successImg from "@/public/assets/images/success.webp";
import Image from "next/image";

export default function EmailSentPage() {
  // Translations
  const t = useTranslations();
  const authT = (key: string) => t(`auth.${key}`);
  const router = useRouter();
  const locale = useLocale();

  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const decodedEmail = email ? decodeURIComponent(email) : "";

  // Force return to the forgotPassword page
  useEffect(() => {
    if (!email) {
      router.push(`/${locale}/forgot-password`);
    }
  }, [email, router]);

  if (!email) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <div className="space-y-8">
      {/* Success State */}
      <div className="text-center">
        <div className="mx-auto w-32 h-32 bg-green-500/10 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <Image
            src={successImg}
            alt="success"
            width={200}
            height={200}
            className="mix-blend-screen"
          />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {authT("emailSent")}
        </h2>{" "}
        <p className="mt-4 text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          <span className="font-semibold text-gray-900 dark:text-white">
            {decodedEmail}
          </span>
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
            onClick={() => router.push(`/${locale}/forgot-password`)}
            className="w-full text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
          >
            {authT("resend")}
          </button>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {authT("rememberPassword")}{" "}
            <Link
              href={`/${locale}/sign-in`}
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
