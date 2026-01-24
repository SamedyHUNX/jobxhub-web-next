"use client";

import BrandLogo from "@/components/BrandLogo";
import { ReactNode, useEffect } from "react";
import Testimonial from "@/components/Testimonial";
import DashboardPreview from "./_DashboardPreview";
import { useAppSelector } from "@/stores/hooks";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/Navbar";
import { useLocale } from "next-intl";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (user) {
      router.replace(`/${locale}/`);
    }
  }, [user, router]);

  return (
    <main className="auth-layout">
      {/* Left side - Form Content */}
      <section className="auth-left-section [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="w-full max-w-3xl mx-auto py-10 flex flex-col min-h-full">
          <BrandLogo className="mb-8" />
          <div className="flex-1 flex items-center">
            <div className="w-full">{children}</div>
          </div>
        </div>
      </section>

      <section className="auth-right-section">
        <NavBar />
        <Testimonial
          quote="JobXHub’s AI analyzed my resume and instantly connected me with roles that actually matched my skills. The platform feels smart, intuitive, and incredibly efficient job searching finally felt tailored to me."
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
