"use client";

import { ReactNode, useEffect } from "react";
import { useAppSelector } from "@/stores/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import PageLoader from "../PageLoader";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isInitialized } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitialized) return;

    // Define routes that should be accessible without authentication
    const publicAuthRoutes = [
      `/${locale}/sign-in`,
      `/${locale}/sign-up`,
      `/${locale}/verify-email`,
      `/${locale}/reset-password`,
      `/${locale}/forgot-password`,
    ];

    // Check if current path is a public auth route
    const isPublicAuthRoute = publicAuthRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Only redirect if user is not authenticated AND not on a public auth route
    if (!user && !isPublicAuthRoute) {
      router.replace(`/${locale}/sign-in`);
    }
  }, [user, isInitialized, router, locale, pathname]);

  // Show loader until auth state is resolved
  if (!isInitialized) {
    return <PageLoader />;
  }

  // If authenticated, render children
  return <>{children}</>;
}
