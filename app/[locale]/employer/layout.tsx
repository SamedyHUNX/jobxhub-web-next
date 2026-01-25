"use client";

import { AppSidebar } from "@/components/sidebar/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/SidebarNavMenuGroup";
import { SidebarUserButton } from "@/components/sidebar/SidebarUserButton";
import { ClipboardListIcon } from "lucide-react";
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
                href: `/${locale}/`,
                icon: <ClipboardListIcon />,
                label: "Homepage",
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
