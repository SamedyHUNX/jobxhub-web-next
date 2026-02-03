import { LoadingSwap } from "./LoadingSwap";
import { Button } from "./ui/button";

export default function SubmitButton({
  isCreating,
  buttonText = "Submit",
}: {
  isCreating: boolean;
  buttonText?: string;
}) {
  return (
    <Button
      type="submit"
      disabled={isCreating}
      className="yellow-btn w-full font-semibold py-3 px-4 rounded-xl"
    >
      <LoadingSwap isLoading={isCreating}>{buttonText}</LoadingSwap>
    </Button>
  );
}
