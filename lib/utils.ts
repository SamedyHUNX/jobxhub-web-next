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
