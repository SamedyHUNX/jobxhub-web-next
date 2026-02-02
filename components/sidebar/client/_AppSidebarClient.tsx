"use client";

import { ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeToggle from "../../ThemeToggle";
import { LanguageSwitcher } from "../../LanguageSwitcher";
import BrandLogo from "../../BrandLogo";

export default function AppSidebarClient({
  children,
}: {
  children: ReactNode;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col w-full">
        <div className="p-2 border-b flex items-center gap-2 h-17">
          <SidebarTrigger />
          <BrandLogo />
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
        <div className="flex-1 flex">{children}</div>
      </div>
    );
  }

  return children;
}
