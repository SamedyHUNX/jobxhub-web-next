"use client";

import BrandLogo from "@/components/BrandLogo";
import { ReactNode } from "react";
import Testimonial from "@/components/Testimonial";
import DashboardPreview from "./_DashboardPreview";
import { NavBar } from "@/components/Navbar";

export default function AuthLayout({ children }: { children: ReactNode }) {
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
          quote="JobXHubs AI analyzed my resume and instantly connected me with roles that actually matched my skills. The platform feels smart, intuitive, and incredibly efficient job searching finally felt tailored to me."
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
