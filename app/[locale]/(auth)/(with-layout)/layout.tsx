"use client";

import BrandLogo from "@/components/BrandLogo";
import { ReactNode } from "react";
import Testimonial from "@/components/Testimonial";
import { useAppSelector } from "@/stores/hooks";
import DashboardPreview from "./_DashboardPreview";
import ThemeToggle from "@/components/ThemeToggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="auth-layout">
      {/* Left side - Form Content */}
      <section className="auth-left-section">
        <BrandLogo className="auth-logo" />

        <div className="flex-1 w-full">{children}</div>
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
