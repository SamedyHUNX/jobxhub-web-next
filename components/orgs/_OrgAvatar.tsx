import type { Organization } from "@/types";

export function OrgAvatar({
  org,
  index,
}: {
  org: Organization;
  index: number;
}) {
  const getOrgColor = (idx: number) => {
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-pink-500",
    ];
    return colors[idx % colors.length];
  };

  const getOrgInitial = (name: string) => {
    return name?.charAt(0).toUpperCase() || "?";
  };

  return (
    <div className="shrink-0 relative">
      {org.imageUrl ? (
        <img
          src={org.imageUrl}
          alt={org.orgName}
          className="w-14 h-14 rounded-full object-cover"
        />
      ) : (
        <div
          className={`w-14 h-14 ${getOrgColor(
            index
          )} rounded-full flex items-center justify-center text-2xl text-white font-bold`}
        >
          {getOrgInitial(org.orgName)}
        </div>
      )}
      {org.isVerified && (
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
