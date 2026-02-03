import type { Organization } from "@/types";
import { defaultTranslations } from "./_DefaultTranslation";

export default function OrgStats({
  org,
  translations,
}: {
  org: Organization;
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
