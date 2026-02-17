"use client";

import { AppSidebar } from "@/components/sidebar/client/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/client/SidebarNavMenuGroup";
import SidebarUserButton from "@/components/sidebar/client/SidebarUserButton";
import { useProfile } from "@/hooks/use-profile";
import { CheckIcon, FilePlusIcon, LayoutDashboardIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function EmployerOrgsDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user: currentUser, isLoading } = useProfile();
  const locale = useLocale();
  const employerT = useTranslations("employer.sidebar");
  const router = useRouter();

  if (!currentUser?.subscription) {
    router.push(`/${locale}/pricing`);
  }

  return (
    <AppSidebar
      content={
        <>
          <SidebarNavMenuGroup
            className="mt-auto"
            items={[
              {
                href: `/${locale}/employer`,
                icon: <LayoutDashboardIcon />,
                label: employerT("employerDashboard"),
              },
              {
                href: `/${locale}/employer/select`,
                icon: <CheckIcon />,
                label: employerT("selectOrganization"),
              },
              {
                href: `/${locale}/employer/new`,
                icon: <FilePlusIcon />,
                label: employerT("createOrganization"),
              },
            ]}
          />
        </>
      }
      footerButton={
        <>
          {isLoading ? (
            <div className="px-4 py-2">Loading...</div>
          ) : currentUser ? (
            <>
        
            </>
          ) : null}
        </>
      }
    >
      {children}
    </AppSidebar>
  );
}
