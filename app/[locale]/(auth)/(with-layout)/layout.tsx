"use client";

import BrandLogo from "@/components/BrandLogo";
import { ReactNode } from "react";
import Testimonial from "@/components/Testimonial";
import DashboardPreview from "./_DashboardPreview";
import { useAppSelector } from "@/stores/hooks";
import { redirect } from "next/navigation";
import { NavBar } from "@/components/Navbar";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { token } = useAppSelector((state) => state.auth);

  if (token) redirect("/");

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
