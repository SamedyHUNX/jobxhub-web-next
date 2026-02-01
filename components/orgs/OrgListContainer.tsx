import { useOrgs } from "@/hooks/use-orgs";
import { useProfile } from "@/hooks/use-profile";
import { useRouter } from "next/navigation";
import OrgsList, { OrgListItemData, OrgListTranslations } from "./OrgList";
import type { Organization, User } from "@/types";
import { ReactNode } from "react";

interface OrgListContainerProps {
  // Navigation callbacks (optional)
  afterSelectOrganizationUrl?: string | ((org: OrgListItemData) => string);
  afterSelectPersonalUrl?: string | ((user: User) => string);

  // Query params for create org flow
  hideSlug?: boolean;
  skipInvitationScreen?: boolean;

  // UI options (passed through to OrgsList)
  hidePersonal?: boolean;
  fallback?: ReactNode;
  translations?: OrgListTranslations;
}

export default function OrgsListContainer({
  afterSelectOrganizationUrl,
  afterSelectPersonalUrl,
  hideSlug = false,
  skipInvitationScreen = false,
  hidePersonal = false,
  fallback,
  translations,
}: OrgListContainerProps) {
  const { user: currentUser } = useProfile();
  const { selectOrganization, navigateToCreateOrg, allOrgs, isLoading } =
    useOrgs({
      userId: currentUser?.id,
    });
  const router = useRouter();

  console.log("hi", allOrgs);

  // Map to display format
  const mappedOrganizations: OrgListItemData[] = allOrgs.map(
    (org: Organization) => ({
      id: org.id,
      name: org.orgName,
      imageUrl: org.imageUrl,
      isVerified: org.isVerified,
      isBanned: org.isBanned,
      membersCount: org.membersCount,
      jobsCount: org.jobsCount,
    })
  );

  // Handlers
  const handleSelectOrganization = (org: OrgListItemData) => {
    // Use the hook's navigation logic
    selectOrganization(org.id, {
      redirectUrl: afterSelectOrganizationUrl,
    });
  };

  const handleSelectPersonal = () => {
    if (!currentUser) return;

    const url =
      typeof afterSelectPersonalUrl === "function"
        ? afterSelectPersonalUrl(currentUser)
        : afterSelectPersonalUrl || "/";

    router.push(url);
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
      organizations={mappedOrganizations}
      currentUser={currentUser}
      isLoading={isLoading}
      onSelectOrganization={handleSelectOrganization}
      onSelectPersonal={handleSelectPersonal}
      onCreateOrganization={handleCreateOrganization}
      hidePersonal={hidePersonal}
      fallback={fallback}
      translations={translations}
    />
  );
}
