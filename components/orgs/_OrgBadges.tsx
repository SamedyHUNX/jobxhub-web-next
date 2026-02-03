import type { Organization } from "@/types";
import { defaultTranslations } from "./_DefaultTranslation";

export default function OrgBadges({
  org,
  translations,
}: {
  org: Organization;
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
