"use client";

import { AppSidebar } from "@/components/sidebar/client/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/client/SidebarNavMenuGroup";
import SidebarOrganizationButton from "@/components/sidebar/organization/SidebarOrganizationButton";
import { useOrgs } from "@/hooks/use-orgs";
import { useProfile } from "@/hooks/use-profile";
import { FilePlusIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ReactNode } from "react";

export default function EmployerOrgsDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = useLocale();
  const employerT = useTranslations("sidebar.jobs");
  const { selectedOrganization } = useOrgs();
  const { profile: currentUser } = useProfile();

  return (
    <AppSidebar
      content={
        <>
          <SidebarNavMenuGroup
            className="mt-4"
            items={[
              {
                href: `/${locale}/employer/orgs/${selectedOrganization?.id}/new`,
                icon: <FilePlusIcon />,
                label: employerT("createJob"),
              },
            ]}
          />
        </>
      }
      footerButton={
        <SidebarOrganizationButton
          currentUser={currentUser}
          currentOrg={selectedOrganization}
        />
      }
    >
      {children}
    </AppSidebar>
  );
}
