import { cn } from "@/lib/utils";
import { LoadingSwap } from "./LoadingSwap";
import { Button } from "./ui/button";

export default function SubmitButton({
  isCreating,
  buttonText = "Submit",
  buttonClassname,
}: {
  isCreating: boolean;
  buttonText?: string;
  buttonClassname?: string;
}) {
  return (
    <Button
      type="submit"
      disabled={isCreating}
      className={cn(
        "yellow-btn w-full font-semibold py-3 px-4 rounded-xl",
        buttonClassname
      )}
    >
      <LoadingSwap isLoading={isCreating}>{buttonText}</LoadingSwap>
    </Button>
  );
}
