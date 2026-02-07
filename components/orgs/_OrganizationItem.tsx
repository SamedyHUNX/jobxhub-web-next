import type { Organization } from "@/types";
import { defaultTranslations } from "./_DefaultTranslation";
import OrgBadges from "./_OrgBadges";
import OrgStats from "./_OrgStats";
import { ArrowRight } from "lucide-react";
import { OrgAvatar } from "./_OrgAvatar";

export default function OrganizationItem({
  org,
  index,
  onClick,
  translations,
}: {
  org: Organization;
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
            {org.orgName}
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
