import { formatDate } from "@/lib/formatter";
import { Calendar } from "lucide-react";

export default function DateComponent({
  postedAt,
}: {
  postedAt: string | undefined | null;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Calendar className="w-4 h-4" />
      <span>Posted on {postedAt ? formatDate(postedAt) : "N/A"}</span>
    </div>
  );
}
