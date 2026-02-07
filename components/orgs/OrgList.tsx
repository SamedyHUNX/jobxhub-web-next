import { useState } from "react";
import FormFooter from "../FormFooter";
import type { Organization, User } from "@/types";
import { defaultTranslations } from "./_DefaultTranslation";
import OrgListHeader from "./_OrgListHeader";
import { OrgListModal } from "./_OrgListModal";
import CreateOrgButton from "./_CreateOrgButton";
import OrganizationItem from "./_OrganizationItem";

export interface OrgListProps {
  // Required data - passed from parent
  organizations: Organization[];
  currentUser: User | undefined;
  isLoading?: boolean;

  // Callbacks
  onSelectOrganization: (org: Organization) => void;
  onCreateOrganization: () => void;

  // UI options
  fallback?: React.ReactNode;
  translations?: typeof defaultTranslations;
}

export default function OrgsList({
  organizations,
  isLoading = false,
  onSelectOrganization,
  onCreateOrganization,
  fallback,
  translations = defaultTranslations,
}: OrgListProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleSelectOrganization = (org: Organization) => {
    if (org.isBanned) {
      setModalState({
        isOpen: true,
        title: translations.organizationBanned.title,
        message: translations.organizationBanned.message,
      });
      return;
    }

    if (!org.isVerified) {
      setModalState({
        isOpen: true,
        title: translations.verificationRequired.title,
        message: translations.verificationRequired.message,
      });
      return;
    }

    onSelectOrganization(org);
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: "", message: "" });
  };

  if (isLoading && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-[95%] max-w-2xl border border-gray-300 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <OrgListHeader translations={translations} />

        {/* Account List - Scrollable */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto flex-1 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Modal */}
          <OrgListModal
            modalState={modalState}
            onClose={closeModal}
            translations={translations}
          />

          {/* Organizations */}
          {organizations.map((org, index) => (
            <OrganizationItem
              key={org.id}
              org={org}
              index={index}
              onClick={() => handleSelectOrganization(org)}
              translations={translations}
            />
          ))}

          {/* Create Organization */}
          <CreateOrgButton
            onClick={onCreateOrganization}
            translations={translations}
          />
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <FormFooter />
        </div>
      </div>
    </div>
  );
}
