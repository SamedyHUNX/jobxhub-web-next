"use client";

import { OrgListWithTranslation } from "@/components/orgs/OrgListWithTranslation";
import { useOrgs } from "@/hooks/use-orgs";
import { useLocale } from "next-intl";
import { useEffect } from "react";

export default function OrganizationSelectPage() {
  const { clearSelectedOrganization } = useOrgs();
  const locale = useLocale();

  // Clear any previously selected org when landing here
  useEffect(() => {
    clearSelectedOrganization();
  }, [clearSelectedOrganization]);

  return (
    <OrgListWithTranslation
      hidePersonal
      afterCreateOrganizationUrl={`/${locale}/employer/orgs/select`}
    />
  );
}
