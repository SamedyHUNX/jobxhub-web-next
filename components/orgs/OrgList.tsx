import { useState } from "react";
import FormFooter from "../FormFooter";
import { ArrowRight, Plus } from "lucide-react";
import { CustomDialog } from "../CustomDialog";
import BrandLogo from "../BrandLogo";

export default function OrgsList({
  organizations,
  currentUser,
  isLoading = false,
  onSelectOrganization,
  onSelectPersonal,
  onCreateOrganization,
  hidePersonal = false,
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

  const handleSelectOrganization = (org: OrgListItemData) => {
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
    <div className="min-h-[calc(100vh-68px)] bg-[#fdfbf7] dark:bg-black flex items-center justify-center p-4">
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

          {/* Personal Account */}
          {!hidePersonal && currentUser && onSelectPersonal && (
            <PersonalAccountItem
              user={currentUser}
              onClick={onSelectPersonal}
            />
          )}

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

export interface OrgListTranslations {
  title: string;
  subTitle: string;
  loadingText: string;
  createOrganization: string;
  securedBy: string;
  contactSupport: string;
  nevermind: string;
  organizationBanned: {
    title: string;
    message: string;
  };
  verificationRequired: {
    title: string;
    message: string;
  };
  badges: {
    banned: string;
    unverified: string;
    verified: string;
  };
  memberCount: {
    singular: string;
    plural: string;
  };
  jobCount: {
    singular: string;
    plural: string;
  };
}

export const defaultTranslations: OrgListTranslations = {
  title: "Choose an account",
  subTitle: "Select the account with which you wish to continue.",
  loadingText: "Loading organizations...",
  createOrganization: "Create organization",
  securedBy: "Secured by",
  contactSupport: "Contact Support",
  nevermind: "Nevermind",
  organizationBanned: {
    title: "Organization Banned",
    message:
      "This organization has been banned. Please contact the support team for further action",
  },
  verificationRequired: {
    title: "Verification Required",
    message:
      "This organization is not yet verified. Please contact the support team for verification",
  },
  badges: {
    banned: "Banned",
    unverified: "Unverified",
    verified: "Verified",
  },
  memberCount: {
    singular: "member",
    plural: "members",
  },
  jobCount: {
    singular: "job",
    plural: "jobs",
  },
};

// ===== Types =====
export interface OrgListItemData {
  id: string;
  name: string;
  imageUrl?: string;
  isVerified: boolean;
  isBanned: boolean;
  membersCount: number;
  jobsCount: number;
}

interface PersonalAccountData {
  id: string;
  username: string;
  imageUrl: string;
}

export interface OrgListProps {
  // Required data - passed from parent
  organizations: OrgListItemData[];
  currentUser?: PersonalAccountData;
  isLoading?: boolean;

  // Callbacks
  onSelectOrganization: (org: OrgListItemData) => void;
  onSelectPersonal?: () => void;
  onCreateOrganization: () => void;

  // UI options
  hidePersonal?: boolean;
  fallback?: React.ReactNode;
  translations?: typeof defaultTranslations;
}

// ===== Sub-components =====

export function OrgListHeader({
  translations,
}: {
  translations: typeof defaultTranslations;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-12 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <BrandLogo />
      <h1 className="text-4xl font-bold text-black dark:text-white my-3 tracking-tighter">
        {translations.title}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-lg">
        {translations.subTitle}
      </p>
    </div>
  );
}

export function OrgListModal({
  modalState,
  onClose,
  translations,
}: {
  modalState: { isOpen: boolean; title: string; message: string };
  onClose: () => void;
  translations: typeof defaultTranslations;
}) {
  if (!modalState.isOpen) return null;

  return (
    <CustomDialog
      title={modalState.title}
      description={modalState.message}
      open={modalState.isOpen}
      onOpenChange={(open) => !open && onClose()}
      onCancel={onClose}
      cancelButtonText={translations.nevermind}
      href="/support"
      buttonText={translations.contactSupport}
    />
  );
}

export function PersonalAccountItem({
  user,
  onClick,
}: {
  user: PersonalAccountData;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-8 py-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
    >
      <div className="shrink-0">
        <img
          src={user.imageUrl}
          alt={user.username}
          className="w-14 h-14 rounded-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-lg font-semibold text-black dark:text-white tracking-tighter">
          {user.username}
        </div>
      </div>
      <div className="shrink-0">
        <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
      </div>
    </div>
  );
}

export function OrganizationItem({
  org,
  index,
  onClick,
  translations,
}: {
  org: OrgListItemData;
  index: number;
  onClick: () => void;
  translations: typeof defaultTranslations;
}) {
  const isDisabled = org.isBanned || !org.isVerified;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-8 py-6 transition-colors cursor-pointer group ${
        isDisabled
          ? "opacity-50 cursor-not-allowed hover:bg-red-50 dark:hover:bg-red-950"
          : "hover:bg-gray-50 dark:hover:bg-gray-700"
      }`}
    >
      {/* Avatar */}
      <OrgAvatar org={org} index={index} />

      {/* Organization Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold text-black dark:text-white tracking-tighter">
            {org.name}
          </div>
          <OrgBadges org={org} translations={translations} />
        </div>
        <OrgStats org={org} translations={translations} />
      </div>

      {/* Arrow */}
      {!org.isBanned && org.isVerified && (
        <div className="shrink-0">
          <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
        </div>
      )}
    </div>
  );
}

export function OrgAvatar({
  org,
  index,
}: {
  org: OrgListItemData;
  index: number;
}) {
  const getOrgColor = (idx: number) => {
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-pink-500",
    ];
    return colors[idx % colors.length];
  };

  const getOrgInitial = (name: string) => {
    return name?.charAt(0).toUpperCase() || "?";
  };

  return (
    <div className="shrink-0 relative">
      {org.imageUrl ? (
        <img
          src={org.imageUrl}
          alt={org.name}
          className="w-14 h-14 rounded-full object-cover"
        />
      ) : (
        <div
          className={`w-14 h-14 ${getOrgColor(
            index
          )} rounded-full flex items-center justify-center text-2xl text-white font-bold`}
        >
          {getOrgInitial(org.name)}
        </div>
      )}
      {org.isVerified && (
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export function OrgBadges({
  org,
  translations,
}: {
  org: OrgListItemData;
  translations: typeof defaultTranslations;
}) {
  if (org.isBanned) {
    return (
      <span className="px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900 rounded">
        {translations.badges.banned}
      </span>
    );
  }

  if (!org.isVerified) {
    return (
      <span className="px-2 py-0.5 text-xs font-medium text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-900 rounded">
        {translations.badges.unverified}
      </span>
    );
  }

  return null;
}

export function OrgStats({
  org,
  translations,
}: {
  org: OrgListItemData;
  translations: typeof defaultTranslations;
}) {
  return (
    <div className="flex items-center gap-3 mt-1">
      <span className="text-sm text-gray-400 dark:text-gray-500">
        {org.membersCount}{" "}
        {org.membersCount === 1
          ? translations.memberCount.singular
          : translations.memberCount.plural}
      </span>
      {org.jobsCount > 0 && (
        <span className="text-sm text-gray-400 dark:text-gray-500">
          {org.jobsCount}{" "}
          {org.jobsCount === 1
            ? translations.jobCount.singular
            : translations.jobCount.plural}
        </span>
      )}
    </div>
  );
}

export function CreateOrgButton({
  onClick,
  translations,
}: {
  onClick: () => void;
  translations: typeof defaultTranslations;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-8 py-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
    >
      <div className="shrink-0">
        <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors">
          <Plus className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-lg font-semibold text-black dark:text-white tracking-tighter">
          {translations.createOrganization}
        </div>
      </div>
    </div>
  );
}
