"use client";

import { ReactNode, useEffect } from "react";
import { useAppSelector } from "@/stores/hooks";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import PageLoader from "../PageLoader";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isInitialized } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      router.replace(`/${locale}/sign-in`);
    }
  }, [user, isInitialized, router, locale]);

  // Show loader until auth state is resolved
  if (!isInitialized) {
    return <PageLoader />;
  }

  // If authenticated, render children
  return <>{children}</>;
}
