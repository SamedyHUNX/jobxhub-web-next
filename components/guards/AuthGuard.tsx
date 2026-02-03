"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { useAppSelector } from "@/stores/hooks";
import PageLoader from "../PageLoader";
export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isInitialized } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitialized) return;

    // Routes that should be accessible WITHOUT authentication
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

    // Redirect to sign-in if not authenticated AND not already on a public route
    if (!user && !isPublicAuthRoute) {
      router.replace(`/${locale}/sign-in`);
    }

    // Redirect authenticated users AWAY from auth pages to homepage
    if (user && isPublicAuthRoute) {
      router.replace(`/${locale}`);
    }
  }, [user, router, locale, pathname]);

  // Show loader until auth state is resolved
  if (!isInitialized) {
    return <PageLoader />;
  }

  // Render children (works for both authenticated and public routes)
  return <>{children}</>;
}
