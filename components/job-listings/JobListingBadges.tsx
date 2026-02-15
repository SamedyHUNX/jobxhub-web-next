import type { JobListing } from "@/types";
import { ComponentProps } from "react";
import { Badge } from "../ui/badge";
import {
  formatExperienceLevel,
  formatJobListingLocation,
  formatJobType,
  formatLocationRequirement,
  formatWage,
} from "@/lib/formatter";
import {
  BanknoteIcon,
  BuildingIcon,
  GraduationCapIcon,
  HourglassIcon,
  MapPinIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function JobListingBadges({
  jobListing: {
    isFeatured,
    wage,
    wageInterval,
    stateAbbreviation,
    experienceLevel,
    locationRequirement,
    type,
    city,
  },
  className,
}: {
  jobListing: JobListing;
  className?: string;
}) {
  const badgeProps = {
    variant: "outline",
    className,
  } satisfies ComponentProps<typeof Badge>;

  return (
    <>
      {isFeatured && (
        <Badge
          {...badgeProps}
          className={cn(
            className,
            "border-featured text-featured-foreground bg-purple-800",
          )}
        >
          Featured
        </Badge>
      )}
      {wage != null && wageInterval != null && (
        <Badge {...badgeProps}>
          <BanknoteIcon className="w-3 h-3 mr-1" />{" "}
          {formatWage(wage, wageInterval)}
        </Badge>
      )}
      {stateAbbreviation != null ||
        (city != null && (
          <Badge {...badgeProps}>
            <MapPinIcon className="size-10 mr-1" />{" "}
            {formatJobListingLocation(stateAbbreviation, city)}
          </Badge>
        ))}
      <Badge {...badgeProps}>
        <BuildingIcon className="size-10 mr-1" />{" "}
        {formatLocationRequirement(locationRequirement)}
      </Badge>
      <Badge {...badgeProps}>
        <HourglassIcon className="size-10 mr-1" /> {formatJobType(type)}
      </Badge>
      <Badge {...badgeProps}>
        <GraduationCapIcon className="size-10 mr-1" />{" "}
        {formatExperienceLevel(experienceLevel)}
      </Badge>
    </>
  );
}
