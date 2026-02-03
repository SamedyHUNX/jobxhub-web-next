import { z } from "zod";

/**
 * Sign In Schema
 */
export const createSignInSchema = (t: (key: string) => string) => {
  return z.object({
    email: z.string().email(t("invalidEmail")),
    password: z.string().min(1, t("passwordRequired")),
  });
};

/**
 * Sign Up Schema
 */
export const createSignUpSchema = (t: (key: string) => string) => {
  return z.object({
    username: z.string().min(1, t("usernameRequired")),
    firstName: z.string().min(1, t("firstNameRequired")),
    lastName: z.string().min(1, t("lastNameRequired")),
    email: z.string().email(t("invalidEmail")),
    password: z.string().min(8, t("passwordMinLength")),
    phoneNumber: z.string().min(1, t("phoneNumberRequired")),
    dateOfBirth: z.string().min(1, t("dateOfBirthRequired")),
    image: z.any().refine((file) => file instanceof File, t("imageRequired")),
  });
};

/**
 * Forgot Password Schema
 */
export const forgotPasswordSchema = (t: (key: string) => string) => {
  return z.object({
    email: z.string().email(t("invalidEmail")),
  });
};

/**
 * Reset Password Schema
 */
export const createResetPasswordSchema = (t: (key: string) => string) => {
  return z
    .object({
      newPassword: z
        .string()
        .min(8, t("passwordMinLength"))
        .regex(/[A-Z]/, t("passwordUppercase"))
        .regex(/[a-z]/, t("passwordLowercase"))
        .regex(/[0-9]/, t("passwordNumber")),
      confirmNewPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("passwordsDoNotMatch"),
      path: ["confirmNewPassword"],
    });
};
/**
 * Create Organization Schema
 */
export const createOrganizationSchema = (t: (key: string) => string) => {
  return z.object({
    orgName: z.string().min(1, t("orgNameRequired")),
    orgDescription: z.string().min(10, t("orgDescriptionTooShort")),
    orgSlug: z.string().min(1, t("orgSlugRequired")),
    orgImage: z
      .any()
      .refine((file) => file instanceof File, t("orgImageRequired")),
  });
};

export type CreateOrgFormData = {
  orgName: string;
  orgSlug: string;
  orgDescription: string;
  orgImage: File | null;
};

export const createUpdateProfileSchema = (t: (key: string) => string) => {
  return z.object({
    firstName: z.string().min(1, t("firstNameRequired")).optional(),
    lastName: z.string().min(1, t("lastNameRequired")).optional(),
    username: z
      .string()
      .min(3, t("usernameTooShort"))
      .max(10, t("usernameTooLong"))
      .regex(/^[a-zA-Z0-9_]+$/, t("usernameInvalid"))
      .optional(),
    phoneNumber: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, t("phoneNumberInvalid"))
      .optional()
      .or(z.literal("")),
  });
};

/**
 * Create Job Listing Schema
 */
export const createJobListingSchema = (t: (key: string) => string) => {
  return z
    .object({
      title: z.string().min(1, t("jobTitleRequired")),
      description: z
        .string()
        .min(100, t("jobDescriptionMinLength"))
        .max(5000, t("jobDescriptionMaxLength")),
      experienceLevel: z.enum(experienceLevels, {
        message: t("experienceLevelRequired"),
      }),
      wage: z
        .number()
        .optional()
        .nullable()
        .transform((val) => val ?? undefined),
      wageInterval: z
        .enum(wageIntervals)
        .optional()
        .nullable()
        .transform((val) => val ?? undefined),
      type: z.enum(jobListingTypes, {
        message: t("jobTypeRequired"),
      }),
      stateAbbreviation: z
        .string()
        .transform((val) => (val.trim() === "" ? null : val))
        .nullable(),
      city: z
        .string()
        .transform((val) => (val.trim() === "" ? null : val))
        .optional()
        .nullable(),
      locationRequirement: z.enum(["in-office", "hybrid", "remote"], {
        message: t("locationRequirementRequired"),
      }),
    })
    .refine(
      (listing) => {
        return (
          listing.locationRequirement === "remote" ||
          (listing.city != null && listing.city.trim() !== "")
        );
      },
      {
        message: t("nonRemoteRequired"),
        path: ["city"],
      }
    )
    .refine(
      (listing) => {
        return (
          listing.locationRequirement === "remote" ||
          (listing.stateAbbreviation != null &&
            listing.stateAbbreviation.trim() !== "")
        );
      },
      {
        message: t("nonRemoteRequired"),
        path: ["stateAbbreviation"],
      }
    );
};

export type CreateJobListingFormData = z.infer<
  ReturnType<typeof createJobListingSchema>
>;

// JobListings
export const wageIntervals = ["hourly", "yearly", "monthly", "weekly"] as const;
export const locationRequirements = ["in-office", "hybrid", "remote"] as const;
export const experienceLevels = [
  "junior",
  "mid",
  "senior",
  "lead",
  "manager",
  "ceo",
  "director",
] as const;
export const jobListingStatuses = ["draft", "published", "delisted"] as const;
export const jobListingTypes = [
  "internship",
  "part-time",
  "full-time",
  "freelance",
  "contract",
] as const;

// JobListingApplication
export const applicationStages = [
  "denied",
  "applied",
  "interviewed",
  "hired",
] as const;

// Derived union types (always match arrays above)
export type WageInterval = (typeof wageIntervals)[number];
export type LocationRequirement = (typeof locationRequirements)[number];
export type ExperienceLevel = (typeof experienceLevels)[number];
export type JobListingStatus = (typeof jobListingStatuses)[number];
export type JobListingType = (typeof jobListingTypes)[number];
export type ApplicationStage = (typeof applicationStages)[number];
