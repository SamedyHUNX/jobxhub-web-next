import type { User } from "@/types";
import { ArrowRight } from "lucide-react";

export default function OrgPersonalAccountItem({
  user,
  onClick,
}: {
  user: User;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-8 py-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
    >
      <div className="shrink-0">
        <img
          src={user.imageUrl}
          alt={user.username}
          className="w-14 h-14 rounded-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-lg font-semibold text-black dark:text-white tracking-tighter">
          {user.username}
        </div>
      </div>
      <div className="shrink-0">
        <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
      </div>
    </div>
  );
}
