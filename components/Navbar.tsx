import { LanguageSwitcher } from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export const NavBar = () => {
  return (
    <div className="sticky top-0 right-0 h-12 z-50 md:flex items-center justify-end pl-6 pr-3">
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </div>
  );
};
