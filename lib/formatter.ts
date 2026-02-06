import {
  ExperienceLevel,
  JobListing,
  JobListingStatus,
  JobListingType,
  LocationRequirement,
  WageInterval,
} from "@/types";

export function formatWageInterval(interval: WageInterval) {
  switch (interval) {
    case "hourly":
      return "Hourly";
    case "yearly":
      return "Yearly";
    case "monthly":
      return "Monthly";
    case "weekly":
      return "Weekly";
    default:
      throw new Error(`Invalid wage interval: ${interval satisfies never}`);
  }
}

export function formatLocationRequirement(
  locationRequirement: LocationRequirement,
) {
  switch (locationRequirement) {
    case "remote":
      return "Remote";
    case "in-office":
      return "In Office";
    case "hybrid":
      return "Hybrid";
    default:
      throw new Error(
        `Unknown location requirement: ${locationRequirement satisfies never}`,
      );
  }
}

export function formatExperienceLevel(experienceLevel: ExperienceLevel) {
  switch (experienceLevel) {
    case "junior":
      return "Junior";
    case "mid":
      return "Mid-Level";
    case "senior":
      return "Senior";
    case "lead":
      return "Lead";
    case "manager":
      return "Manager";
    case "ceo":
      return "CEO";
    case "director":
      return "Director";
    default:
      throw new Error(
        `Unknown experience level: ${experienceLevel satisfies never}`,
      );
  }
}

export function formatJobType(type: JobListingType) {
  switch (type) {
    case "internship":
      return "Internship";
    case "part-time":
      return "Part-Time";
    case "full-time":
      return "Full-Time";
    case "contract":
      return "Contract";
    case "freelance":
      return "Freelance";
    default:
      throw new Error(`Unknown job type: ${type satisfies never}`);
  }
}

export function formatJobListingStatus(status?: JobListingStatus) {
  switch (status) {
    case "draft":
      return "Draft";
    case "published":
      return "Active";
    case "delisted":
      return "Delisted";
    default:
      return "Unknown";
  }
}

export function formatWage(
  wage: number | null | undefined,
  wageInterval?: WageInterval | null,
) {
  if (wage == null || isNaN(wage) || !wageInterval) {
    return "N/A";
  }

  const wageFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  switch (wageInterval) {
    case "hourly":
      return `${wageFormatter.format(wage)} / hr`;
    case "yearly":
      return `${wageFormatter.format(wage)} / yr`;
    case "monthly":
      return `${wageFormatter.format(wage)} / mo`;
    case "weekly":
      return `${wageFormatter.format(wage)} / wk`;
    default:
      return "N/A";
  }
}

export function formatJobListingLocation(
  stateAbbreviation?: string,
  city?: string,
) {
  if (stateAbbreviation == null && city == null) {
    return "None";
  }

  const locationParts: string[] = [];

  if (city) {
    locationParts.push(city);
  }

  if (stateAbbreviation) {
    locationParts.push(stateAbbreviation.toUpperCase());
  }

  return locationParts.join(", ");
}

export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const sortJobs = (jobs: JobListing[], sortBy: string): JobListing[] => {
  return [...jobs].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "wage-high":
        return (Number(b.wage) || 0) - (Number(a.wage) || 0);
      case "wage-low":
        return (Number(a.wage) || 0) - (Number(b.wage) || 0);
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
};
