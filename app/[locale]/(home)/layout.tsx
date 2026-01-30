"use client";

import { AppSidebar } from "@/components/sidebar/client/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/client/SidebarNavMenuGroup";
import { SidebarUserButton } from "@/components/sidebar/client/SidebarUserButton";
import { useProfile } from "@/hooks/use-profile";
import {
  BrainCircuitIcon,
  ClipboardListIcon,
  LayoutDashboard,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ReactNode } from "react";

export default function JobSeekerLayout({ children }: { children: ReactNode }) {
  const { profile: currentUser } = useProfile();
  const isSuperAdmin = currentUser?.userRole === "SUPER-ADMIN";
  const sidebarT = useTranslations("sidebar");
  const locale = useLocale();

  return (
    <AppSidebar
      content={
        <SidebarNavMenuGroup
          className="mt-auto"
          items={
            [
              {
                href: `/${locale}`,
                icon: <ClipboardListIcon />,
                label: sidebarT("findJobs"),
              },
              {
                href: `/${locale}/ai-search`,
                icon: <BrainCircuitIcon />,
                label: sidebarT("aiSearch"),
              },
              {
                href: `/${locale}/employer`,
                icon: <LayoutDashboard />,
                label: sidebarT("employerDashboard"),
                authStatus: currentUser ? "signedIn" : "signedOut",
              },
              isSuperAdmin && {
                href: `/${locale}/super-admin/dashboard`,
                icon: <LayoutDashboard />,
                label: sidebarT("superAdminDashboard"),
                authStatus: currentUser ? "signedIn" : "signedOut",
              },
            ].filter(Boolean) as any[]
          }
        />
      }
      footerButton={<SidebarUserButton />}
    >
      {children}
    </AppSidebar>
  );
}
