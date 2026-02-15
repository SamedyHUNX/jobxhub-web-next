import { cn } from "@/lib/utils";
import { LoadingSwap } from "./LoadingSwap";
import { Button } from "./ui/button";

export default function SubmitButton({
  isSubmitting,
  buttonText,
  buttonClassname,
  onClick,
}: {
  isSubmitting: boolean;
  buttonText?: string;
  buttonClassname?: string;
  hasActiveSubscription?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      type="submit"
      disabled={isSubmitting}
      className={cn(
        "yellow-btn w-full font-semibold py-3 px-4 rounded-xl",
        buttonClassname,
      )}
    >
      <LoadingSwap isLoading={isSubmitting}>{buttonText}</LoadingSwap>
    </Button>
  );
}
