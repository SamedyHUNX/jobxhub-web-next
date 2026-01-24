import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const apiErrorMapping = (
  t: (key: string) => string
): Record<string, string> => ({
  "Invalid credentials": t("invalidCredentials"),
  "User not found": t("userNotFound"),
  Unauthorized: t("unauthorized"),
  "All fields are required": t("allFieldsRequired"),
  "Profile image is required": t("profileImageRequired"),
  "Email already exists": t("emailExists"),
  "Username already taken": t("usernameExist"),
  "Failed to complete signup. Please try again": t("signUpFailed"),
  "Invalid token": t("invalidToken"),
  "Verification token has expired. Please request a new verification email":
    t("verifyTokenExpired"),
  "Invalid or expired verification token": t("invalidOrExpiredToken"),
  "Failed to verify email. Please try again": t("verifyEmailFailed"),
  "Email and password are required": t("emailOrPasswordRequired"),
  "Account has been banned": t("accountBanned"),
  "Account has been disabled": t("accountDisabled"),
  "Account is not verified. Please check your inbox to verify":
    t("accountNotVerified"),
  "Invalid payload": t("invalidPayload"),
  "Token has been invalidated. Please sign in again.": t("invalidatedToken"),
  "Too many requests": t("tooManyRequest"),
  "Passwords must match": t("passwordsMustMatch"),
});

export function extractErrorMessage(
  error: AxiosError,
  t: (key: string) => string
): string {
  if (
    error.response &&
    error.response.data &&
    typeof error.response.data === "object"
  ) {
    const data = error.response.data as { message?: string };
    if (data.message) {
      const mapping = apiErrorMapping(t);
      return mapping[data.message] || data.message;
    }
  }
  return error.message || "An unknown error occurred";
}
