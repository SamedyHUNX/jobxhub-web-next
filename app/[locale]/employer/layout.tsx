"use client";

import { AppSidebar } from "@/components/sidebar/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/SidebarNavMenuGroup";
import { SidebarUserButton } from "@/components/sidebar/SidebarUserButton";
import { ClipboardListIcon, CheckIcon, FilePlusIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { ReactNode } from "react";

export default function EmployerOrgsDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = useLocale();

  return (
    <AppSidebar
      content={
        <>
          <SidebarNavMenuGroup
            className="mt-auto"
            items={[
              {
                href: `/${locale}/employer/orgs/select`,
                icon: <CheckIcon />,
                label: "Organization Selection",
              },
              {
                href: `/${locale}/employer/orgs/new`,
                icon: <FilePlusIcon />,
                label: "Create Organization",
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
