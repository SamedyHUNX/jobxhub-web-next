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
  hasActiveSubscription: boolean;
  subscription?: Subscription;
}

export interface Subscription {
  id: string;
  userId: string;
  planName: "basic" | "growth" | "enterprise";
  status: "active" | "canceled" | "past_due" | "trialing" | "unpaid";
  interval: "month" | "year";
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  trialStart: string | null;
  trialEnd: string | null;
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
  username: string;
  phoneNumber: string;
  dateOfBirth: string;
  image: File | null;
  newPassword: string;
  confirmPassword: string;
  countryCode: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T | [];
}

export type AuthResponse = ApiResponse<[]>;

export type ProfileResponse = ApiResponse<User[]>;
export type JobListingFormResponse = ApiResponse<[]>;

export type SignInFormData = Pick<AuthRequest, "email" | "password">;
export type SignUpFormData = Pick<
  AuthRequest,
  | "username"
  | "firstName"
  | "lastName"
  | "email"
  | "password"
  | "confirmPassword"
  | "phoneNumber"
  | "dateOfBirth"
  | "image"
> & {
  locale: string;
};

export type ForgotPasswordFormData = Pick<AuthRequest, "email"> & {
  locale: string;
};

export type ResetPasswordFormData = Pick<
  AuthRequest,
  "newPassword" | "confirmPassword"
>;

export interface ResetPasswordVariables extends ResetPasswordFormData {
  token: string | null;
}

// Organizations
export interface Organization {
  id: string;
  orgName: string;
  imageUrl: string;
  description: string;
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

export interface UpdateOrganizationDto {
  orgName?: string;
  description?: string;
  imageFile?: File | null | undefined;
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
  applicationCount: number;
  postedAt?: string;
  createdAt: string;
  updatedAt: string;
  organization: Organization;
}

export type Resume = {
  userId: string;
  resumeFileUrl: string;
  resumeFileKey: string;
  aiSummary: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateNotificationSettings = {
  newJobEmailNotifications: boolean;
  aiPrompt: string | null;
};
