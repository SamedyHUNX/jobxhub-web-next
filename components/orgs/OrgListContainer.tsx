import { useOrgs } from "@/hooks/use-orgs";
import { useProfile } from "@/hooks/use-profile";
import OrgsList from "./OrgList";
import type { Organization, User } from "@/types";
import { ReactNode } from "react";
import { OrgListTranslations } from "./_DefaultTranslation";

interface OrgListContainerProps {
  // Navigation callbacks (optional)
  afterSelectOrganizationUrl?:
    | string
    | ((org: Organization) => string)
    | undefined;
  afterSelectPersonalUrl?: string | ((user: User) => string);

  // Query params for create org flow
  hideSlug?: boolean;
  skipInvitationScreen?: boolean;

  // UI options (passed through to OrgsList)
  fallback?: ReactNode;
  translations?: OrgListTranslations;
}

export default function OrgsListContainer({
  afterSelectOrganizationUrl,
  hideSlug = false,
  skipInvitationScreen = false,
  fallback,
  translations,
}: OrgListContainerProps) {
  const { user: currentUser } = useProfile();
  const { selectOrganization, navigateToCreateOrg, allOrgs, isLoading } =
    useOrgs();

  // Handlers
  const handleSelectOrganization = (org: Organization) => {
    // Use the hook's navigation logic
    selectOrganization(org.id, {
      redirectUrl: afterSelectOrganizationUrl,
    });
  };

  const handleCreateOrganization = () => {
    // Use the hook's navigation logic
    navigateToCreateOrg({
      hideSlug,
      skipInvitationScreen,
    });
  };

  return (
    <OrgsList
      organizations={allOrgs}
      currentUser={currentUser}
      isLoading={isLoading}
      onSelectOrganization={handleSelectOrganization}
      onCreateOrganization={handleCreateOrganization}
      fallback={fallback}
      translations={translations}
    />
  );
}
