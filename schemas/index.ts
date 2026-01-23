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
  const baseSchema = z
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
      message: t("passwordMustMatch"),
      path: ["confirmNewPassword"],
    });
};
