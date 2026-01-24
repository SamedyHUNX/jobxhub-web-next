"use client";

import { AppSidebar } from "@/components/sidebar/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/SidebarNavMenuGroup";
import { SidebarUserButton } from "@/components/sidebar/SidebarUserButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfile } from "@/hooks/use-profile";
import {
  BrainCircuitIcon,
  ClipboardListIcon,
  LayoutDashboard,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

export default function JobSeekerLayout({ children }: { children: ReactNode }) {
  const { profile: currentUser } = useProfile();
  const isSuperAdmin = currentUser?.userRole === "SUPER-ADMIN";
  const sidebarT = useTranslations("sidebar");
  const isMobile = useIsMobile();

  return (
    <AppSidebar
      showNavBar={!isMobile}
      content={
        <SidebarNavMenuGroup
          className="mt-auto"
          items={
            [
              {
                href: "/",
                icon: <ClipboardListIcon />,
                label: sidebarT("findJobs"),
              },
              {
                href: "/ai-search",
                icon: <BrainCircuitIcon />,
                label: sidebarT("aiSearch"),
              },
              {
                href: "",
                icon: <LayoutDashboard />,
                label: sidebarT("employerDashboard"),
                authStatus: currentUser ? "signedIn" : "signedOut",
              },
              isSuperAdmin && {
                href: "/super-admin/dashboard",
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
