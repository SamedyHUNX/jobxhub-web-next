import {
  ExperienceLevel,
  JobListingStatus,
  JobListingType,
  LocationRequirement,
  WageInterval,
} from "@/schemas";
import { ApiResponse } from "./api.types";
import { Organization } from "./organization.types";

export type JobListingFormResponse = ApiResponse<[]>;
export const locationRequirements = ["in-office", "hybrid", "remote"] as const;

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
