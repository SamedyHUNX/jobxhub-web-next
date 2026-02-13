import { Button } from "./ui/button";
import { Popover, PopoverTrigger } from "./ui/popover";

export default function PopoverComponent({ status }: { status: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"}>{statusToggleButtonText(status)}</Button>
      </PopoverTrigger>
    </Popover>
  );
}

function statusToggleButtonText(status: string) {
  return status === "published" ? "Unpublish" : "Publish";
}
