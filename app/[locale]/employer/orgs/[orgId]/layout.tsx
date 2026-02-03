"use client";

import PageLoader from "@/components/PageLoader";
import { AppSidebar } from "@/components/sidebar/client/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/client/SidebarNavMenuGroup";
import SidebarOrganizationButton from "@/components/sidebar/organization/SidebarOrganizationButton";
import { useOrgs } from "@/hooks/use-orgs";
import { useProfile } from "@/hooks/use-profile";
import {
  FilePlusIcon,
  ClipboardMinusIcon,
  SquareChartGanttIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ReactNode } from "react";

export default function EmployerOrgsDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const employerT = useTranslations("sidebar.jobs");
  const { user: currentUser } = useProfile();
  const { selectedOrgData, isLoading } = useOrgs();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <AppSidebar
      content={
        <>
          <SidebarNavMenuGroup
            className="mt-4"
            items={[
              {
                href: `/employer/orgs/${selectedOrgData?.id}`,
                icon: <SquareChartGanttIcon />,
                label: `${selectedOrgData?.orgName} ${employerT("overview")}`,
              },
              {
                href: `/employer/orgs/${selectedOrgData?.id}/jobs`,
                icon: <ClipboardMinusIcon />,
                label: employerT("allJobs"),
              },
              {
                href: `/employer/orgs/${selectedOrgData?.id}/new`,
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
          currentOrg={selectedOrgData}
        />
      }
    >
      {children}
    </AppSidebar>
  );
}
