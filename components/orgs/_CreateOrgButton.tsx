import { Plus } from "lucide-react";
import { defaultTranslations } from "./_DefaultTranslation";

export default function CreateOrgButton({
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
