import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

type CustomButtonProps = {
  className?: string;
  variant?:
    | "link"
    | "ghost"
    | "default"
    | "outline"
    | "secondary"
    | "destructive";
  buttonText?: string;
  locale?: string;
};

const translations: Record<string, string> = {
  en: "Back Home",
  de: "Zurück",
  kh: "ត្រឡប់ទៅផ្ទះ",
};

export const BackHomeButton = ({
  className,
  variant,
  buttonText,
  locale,
}: CustomButtonProps) => {
  const router = useRouter();
  return (
    <Button
      variant={variant}
      className={`${className} w-full`}
      onClick={() => {
        router.push("/");
      }}
    >
      {buttonText ? buttonText : translations[locale || "en"] || "Back Home"}
    </Button>
  );
};
