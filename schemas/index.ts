
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
  const baseSchema = z.object({
    newPassword: z
      .string()
      .min(8, t("passwordMinLength"))
      .regex(/[A-Z]/, t("passwordUppercase"))
      .regex(/[a-z]/, t("passwordLowercase"))
      .regex(/[0-9]/, t("passwordNumber")),
    confirmNewPassword: z.string().min(1, t("confirmPasswordRequired")),
  });
  return baseSchema;
};
/**
 * Create Organization Schema
 */
export const createOrganizationSchema = (t: (key: string) => string) => {
  return z.object({
    orgName: z.string().min(1, t("orgNameRequired")),
    slug: z.string().min(1, t("slugRequired")),
    image: z.any().refine((file) => file instanceof File, t("imageRequired")),
  });
};

export type CreateOrgFormData = {
  orgName: string;
  slug: string;
  image: File | null;
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
