"use client";

import BrandLogo from "@/components/BrandLogo";
import { ReactNode } from "react";
import Testimonial from "@/components/Testimonial";
import { useAppSelector } from "@/stores/hooks";
import DashboardPreview from "./_DashboardPreview";
import ThemeToggle from "@/components/ThemeToggle";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="auth-layout">
      <section className="auth-left-section scrollbar-hide-default">
        <BrandLogo className="auth-logo" />

        <div className="pb-6 lg:pb-8 flex-1">{children}</div>
      </section>

      <section className="auth-right-section">
        <ThemeToggle />
        <Testimonial
          quote="JobXHub made connecting with the right opportunities effortless. The platform is intuitive and efficient, helping me find roles that truly match my skills."
          author="Samedy H"
          occupation="Software Developer"
        />

        <div className="flex-1 relative rounded-4xl">
          <DashboardPreview />
        </div>
      </section>
    </main>
  );
}
