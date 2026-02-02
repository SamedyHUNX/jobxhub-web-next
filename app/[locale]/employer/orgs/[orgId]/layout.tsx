"use client";

import PageLoader from "@/components/PageLoader";
import { AppSidebar } from "@/components/sidebar/client/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/client/SidebarNavMenuGroup";
import SidebarOrganizationButton from "@/components/sidebar/organization/SidebarOrganizationButton";
import { useOrgs } from "@/hooks/use-orgs";
import { useProfile } from "@/hooks/use-profile";
import { FilePlusIcon, ClipboardMinusIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ReactNode } from "react";

export default function EmployerOrgsDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = useLocale();
  const employerT = useTranslations("sidebar.jobs");
  const { user: currentUser } = useProfile();
  const { selectedOrgData, isLoading } = useOrgs({ userId: currentUser?.id });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!currentUser) {
    return undefined;
  }

  console.log(selectedOrgData);

  return (
    <AppSidebar
      content={
        <>
          <SidebarNavMenuGroup
            className="mt-4"
            items={[
              {
                href: `/${locale}/employer/orgs/${selectedOrgData?.id}/new`,
                icon: <FilePlusIcon />,
                label: employerT("createJob"),
              },
              {
                href: `/${locale}/employer/orgs/${selectedOrgData?.id}/jobs`,
                icon: <ClipboardMinusIcon />,
                label: employerT("allJobs"),
              },
            ]}
          />
        </>
      }
      footerButton={
        <SidebarOrganizationButton
          currentUser={currentUser}
          currentOrg={selectedOrgData}
        />
      }
    >
      {children}
    </AppSidebar>
  );
}
