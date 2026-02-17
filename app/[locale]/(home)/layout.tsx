"use client";

import { AppSidebar } from "@/components/sidebar/client/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/client/SidebarNavMenuGroup";
import SidebarUserButton from "@/components/sidebar/client/SidebarUserButton";
import { useProfile } from "@/hooks/use-profile";
import {
  BrainCircuitIcon,
  ClipboardListIcon,
  LayoutDashboard,
  BanknoteIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

export default function JobSeekerLayout({
  children,
  sidebar,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  const { user: currentUser, isLoading } = useProfile();
  const isSuperAdmin = currentUser?.userRole === "SUPER-ADMIN";
  const sidebarT = useTranslations("sidebar");

  return (
    <AppSidebar
      content={
        <>
          {sidebar}
          <SidebarNavMenuGroup
            className="mt-auto"
            items={
              [
                {
                  href: `/`,
                  icon: <ClipboardListIcon />,
                  label: sidebarT("findJobs"),
                },
                {
                  href: `/ai-search`,
                  icon: <BrainCircuitIcon />,
                  label: sidebarT("aiSearch"),
                },
                {
                  href: `/employer`,
                  icon: <LayoutDashboard />,
                  label: sidebarT("employerDashboard"),
                  authStatus: currentUser ? "signedIn" : "signedOut",
                },
                {
                  href: "/subscription/manage",
                  icon: <BanknoteIcon />,
                  label: sidebarT("manageSubscription"),
                  authStatus: currentUser ? "signedIn" : "signedOut",
                },
                isSuperAdmin && {
                  href: `/super-admin/dashboard`,
                  icon: <LayoutDashboard />,
                  label: sidebarT("superAdminDashboard"),
                  authStatus: currentUser ? "signedIn" : "signedOut",
                },
              ].filter(Boolean) as any[]
            }
          />
        </>
      }
      footerButton={
        <>
          {isLoading ? (
            <div className="px-4 py-2">Loading...</div>
          ) : currentUser ? (
            <>
              <SidebarUserButton currentUser={currentUser} />
            </>
          ) : null}
        </>
      }
    >
      {children}
    </AppSidebar>
  );
}
