"use client";

import { BackHomeButton } from "@/components/BackHomeButton";
import { SidebarOrganizationButtonClient } from "./_SidebarOrganizationButtonClient";
import { Organization, User } from "@/types";

export default function SidebarOrganizationButton({
  currentOrg,
  currentUser,
}: {
  currentOrg: Organization | null;
  currentUser: User | undefined;
}) {
  console.log("org", currentOrg);
  console.log(currentUser);
  // Handle no selected organization
  if (!currentUser || !currentOrg) {
    return <BackHomeButton variant="destructive" />;
  }

  return (
    <SidebarOrganizationButtonClient
      orgName={currentOrg?.orgName ?? null}
      imageUrl={currentOrg?.imageUrl ?? null}
      slug={currentOrg?.slug ?? null}
    />
  );
}
