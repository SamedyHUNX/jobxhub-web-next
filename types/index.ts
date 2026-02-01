// Locale
export type LocaleType = "en" | "de" | "km";

// User
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  userRole: string;
  phoneNumber: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

// Axios APIs
export interface AuthRequest {
  email: string;
  password: string;
  name: string;
  firstName: string;
  lastName: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T | [];
}

export type SignInResponse = ApiResponse<[]>;
export type SignUpResponse = ApiResponse<[]>;
export type GetProfileResponse = ApiResponse<User[]>;
export type VerifyEmailResponse = ApiResponse<[]>;
export type ForgotPasswordResponse = ApiResponse<[]>;
export type ResetPasswordResponse = ApiResponse<[]>;
export type UpdateProfileResponse = ApiResponse<User[]>;

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  image: File | null;
}

export type ResetPasswordFormData = {
  newPassword: string;
  confirmNewPassword: string;
};

export interface ResetPasswordVariables extends ResetPasswordFormData {
  token: string;
}

// Organizations
export interface Organization {
  id: string;
  orgName: string;
  imageUrl: string;
  slug: string;
  isVerified: boolean;
  isBanned: boolean;
  membersCount: number;
  pendingInvitationsCount: number;
  adminDeleteEnabled: boolean;
  createdBy: string;
  jobsCount: number;
  createdAt: string;
  updatedAt: string;
}

export type FindAllOrgsResponse = ApiResponse<Organization[]>;
export type CreateOrgResponse = ApiResponse<[]>;

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
  postedAt?: string;
  createdAt: string;
  updatedAt: string;
}
