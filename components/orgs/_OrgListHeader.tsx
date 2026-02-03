import BrandLogo from "../BrandLogo";
import { defaultTranslations } from "./_DefaultTranslation";

export default function OrgListHeader({
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
