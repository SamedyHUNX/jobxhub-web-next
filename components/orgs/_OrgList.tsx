import { useOrgs } from "@/hooks/use-orgs";
import { useProfile } from "@/hooks/use-profile";
import { Organization } from "@/types";
import { ArrowRight, Plus } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { CustomDialog } from "../CustomDialog";
import BrandLogo from "../BrandLogo";
import FormFooter from "../FormFooter";
import { useOrgsByUserId } from "@/hooks/use-orgs-by-id";

export interface OrgListProps {
  afterCreateOrganizationUrl?: ((org: Organization) => string) | string;
  afterSelectOrganizationUrl?: ((org: Organization) => string) | string;
  afterSelectPersonalUrl?: ((org: Organization) => string) | string;
  appearance?: {
    elements?: Record<string, string>;
    variables?: Record<string, string>;
  };
  fallback?: ReactNode;
  hidePersonal?: boolean;
  hideSlug?: boolean;
  skipInvitationScreen?: boolean;
  translations?: OrgListTranslations;
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

const defaultTranslations: OrgListTranslations = {
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

export default function OrgsList({
  afterSelectOrganizationUrl,
  afterSelectPersonalUrl,
  fallback,
  hidePersonal = false,
  hideSlug = false,
  skipInvitationScreen = false,
  translations = defaultTranslations,
}: OrgListProps) {
  const { profile: currentUser } = useProfile();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });
  const router = useRouter();
  const locale = useLocale();
  const { selectOrganization } = useOrgs();
  // Use the hook to fetch organizations for the current user
  const { data: organizations = [], isLoading: isLoadingOrganizations } =
    useOrgsByUserId(currentUser?.id || "");

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

    // Save selected organization to Redux
    selectOrganization(org);

    if (afterSelectOrganizationUrl) {
      const url =
        typeof afterSelectOrganizationUrl === "function"
          ? afterSelectOrganizationUrl(org)
          : afterSelectOrganizationUrl;
      router.push(url);
    } else {
      router.push(`/${locale}/employer/orgs/${org.id}`);
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: "", message: "" });
  };

  const handleSelectPersonal = () => {
    if (afterSelectPersonalUrl && currentUser) {
      const url =
        typeof afterSelectPersonalUrl === "function"
          ? afterSelectPersonalUrl(currentUser as any)
          : afterSelectPersonalUrl;
      router.push(url);
    } else {
      router.push("/");
    }
  };

  const handleCreateOrganization = () => {
    const baseUrl = `/${locale}/employer/orgs/new`;
    const params = new URLSearchParams();

    if (hideSlug) {
      params.append("hideSlug", "true");
    }

    if (skipInvitationScreen !== undefined) {
      params.append("skipInvitationScreen", String(skipInvitationScreen));
    }

    const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    router.push(url);
  };

  const getOrgInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getOrgColor = (index: number) => {
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-pink-500",
    ];
    return colors[index % colors.length];
  };

  if (isLoadingOrganizations && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#fdfbf7] dark:bg-black flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-[95%] max-w-2xl border border-gray-300 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center px-8 py-12 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <BrandLogo />
          <h1 className="text-4xl font-bold text-black dark:text-white my-3 tracking-tighter">
            {translations.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {translations.subTitle}
          </p>
        </div>

        {/* Account List - Scrollable */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto flex-1 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Modal with Transparent Background */}
          {modalState.isOpen && (
            <CustomDialog
              title={modalState.title}
              description={modalState.message}
              open={modalState.isOpen}
              onOpenChange={(open) =>
                setModalState({ ...modalState, isOpen: open })
              }
              onCancel={closeModal}
              cancelButtonText={translations.nevermind}
              href={"/support"}
              buttonText={translations.contactSupport}
            />
          )}

          {/* Personal Account */}
          {!hidePersonal && currentUser && (
            <div
              onClick={handleSelectPersonal}
              className="flex items-center gap-4 px-8 py-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
            >
              <div className="shrink-0">
                <img
                  src={currentUser.imageUrl}
                  alt={currentUser.username}
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-semibold text-black dark:text-white tracking-tighter">
                  {currentUser.username}
                </div>
              </div>
              <div className="shrink-0">
                <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </div>
            </div>
          )}

          {/* Organizations */}
          {organizations.map((org: Organization, index: number) => (
            <div
              key={org.id}
              onClick={() => handleSelectOrganization(org)}
              className={`flex items-center gap-4 px-8 py-6 transition-colors cursor-pointer group ${
                org.isBanned || !org.isVerified
                  ? "opacity-50 cursor-not-allowed hover:bg-red-50 dark:hover:bg-red-950"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {/* Avatar/Icon */}
              <div className="shrink-0 relative">
                {org.imageUrl ? (
                  <img
                    src={org.imageUrl}
                    alt={org.orgName}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-14 h-14 ${getOrgColor(
                      index
                    )} rounded-full flex items-center justify-center text-2xl text-white font-bold`}
                  >
                    {getOrgInitial(org.orgName)}
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

              {/* Organization Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold text-black dark:text-white tracking-tighter">
                    {org.orgName}
                  </div>
                  {org.isBanned && (
                    <span className="px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900 rounded">
                      {translations.badges.banned}
                    </span>
                  )}
                  {!org.isVerified && !org.isBanned && (
                    <span className="px-2 py-0.5 text-xs font-medium text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-900 rounded">
                      {translations.badges.unverified}
                    </span>
                  )}
                </div>
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
              </div>

              {/* Action */}
              <div className="shrink-0">
                {!org.isBanned && org.isVerified && (
                  <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                )}
              </div>
            </div>
          ))}

          {/* Create Organization */}
          <div
            onClick={handleCreateOrganization}
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
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <FormFooter />
        </div>
      </div>
    </div>
  );
}
