"use client";

import { AppSidebar } from "@/components/sidebar/client/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/client/SidebarNavMenuGroup";
import SidebarOrganizationButton from "@/components/sidebar/organization/SidebarOrganizationButton";
import { useOrgs } from "@/hooks/use-orgs";
import { useProfile } from "@/hooks/use-profile";
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
  const { selectedOrganization } = useOrgs();
  const { profile: currentUser } = useProfile();

  console.log("selectedOrganization:", selectedOrganization);

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
