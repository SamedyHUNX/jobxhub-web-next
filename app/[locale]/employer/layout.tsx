"use client";

import { AppSidebar } from "@/components/sidebar/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/SidebarNavMenuGroup";
import { SidebarUserButton } from "@/components/sidebar/SidebarUserButton";
import { CheckIcon, FilePlusIcon, LayoutDashboardIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ReactNode } from "react";

export default function EmployerOrgsDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = useLocale();
  const employerT = useTranslations("employer.sidebar");

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
                href: `/${locale}/employer/orgs/select`,
                icon: <CheckIcon />,
                label: employerT("selectOrganization"),
              },
              {
                href: `/${locale}/employer/orgs/new`,
                icon: <FilePlusIcon />,
                label: employerT("createOrganization"),
              },
            ]}
          />
        </>
      }
      footerButton={<SidebarUserButton />}
    >
      {children}
    </AppSidebar>
  );
}
