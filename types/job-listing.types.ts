import { ApiResponse } from "./api.types";
import { Organization } from "./organization.types";

export type JobListingFormResponse = ApiResponse<[]>;
// Create Job
export type LocationRequirement = "in-office" | "hybrid" | "remote";
export const locationRequirements = ["in-office", "hybrid", "remote"] as const;

export type ExperienceLevel =
  | "junior"
  | "mid"
  | "senior"
  | "lead"
  | "manager"
  | "ceo"
  | "director";
export type JobListingStatus = "draft" | "published" | "delisted";
export type JobListingType =
  | "internship"
  | "part-time"
  | "full-time"
  | "contract"
  | "freelance";
export type WageInterval = "weekly" | "hourly" | "yearly" | "monthly";

// Job Listings
export interface JobListing {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  wage?: number;
  wageInterval?: WageInterval;
  stateAbbreviation?: string;
  city?: string;
  isFeatured: boolean;
  locationRequirement: LocationRequirement;
  experienceLevel: ExperienceLevel;
  status: JobListingStatus;
  type: JobListingType;
  applicationCount: number;
  postedAt?: string;
  createdAt: string;
  updatedAt: string;
  organization: Organization;
}
