import { useOrgs } from "@/hooks/use-orgs";
import { useProfile } from "@/hooks/use-profile";
import { useRouter } from "next/navigation";
import OrgsList from "./OrgList";
import type { Organization, User } from "@/types";
import { ReactNode, useState } from "react";
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
    useOrgs();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Handlers
  const handleSelectOrganization = (org: Organization) => {
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
      organizations={allOrgs}
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
