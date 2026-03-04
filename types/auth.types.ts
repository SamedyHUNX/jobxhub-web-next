import { ApiResponse } from "./api.types";

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

export type AuthResponse = ApiResponse<[]>;

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
