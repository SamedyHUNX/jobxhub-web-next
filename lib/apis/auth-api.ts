import axios from "axios";
import {
  SignInFormData,
  SignUpFormData,
  AuthResponse,
  User,
  ProfileResponse,
  ForgotPasswordFormData,
  ResetPasswordVariables,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
});

function assertApiUrl() {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL env variable is not set");
  }
}

export const authApi = {
  // Sign In
  signIn: async (credentials: SignInFormData): Promise<AuthResponse> => {
    assertApiUrl();
    const { data } = await api.post<AuthResponse>(
      "/auth/sign-in",
      credentials,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return data;
  },

  // Signup
  signUp: async (signUpFormData: SignUpFormData): Promise<AuthResponse> => {
    assertApiUrl();

    const signUpForm = new FormData();
    Object.entries(signUpFormData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        signUpForm.append(key, value instanceof File ? value : String(value));
      }
    });

    const { data } = await api.post<AuthResponse>("/auth/sign-up", signUpForm, {
      headers: { "Accept-Language": signUpFormData.locale },
    });
    return data;
  },

  // Get user info
  getProfile: async (): Promise<User | null> => {
    const { data } = await api.get<ProfileResponse>("/auth/me");
    return data.data?.[0] ?? undefined;
  },

  // Verify Email
  verifyEmail: async (token: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/verify-email", {
      token,
    });
    return data;
  },

  // Forgot password
  forgotPassword: async ({
    email,
    locale,
  }: ForgotPasswordFormData): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>(
      "/auth/forgot-password",
      {},
      { headers: { "Accept-Language": locale } },
    );
    return data;
  },

  // Reset password
  resetPassword: async ({
    token,
    newPassword,
    confirmPassword,
  }: ResetPasswordVariables): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/reset-password", {
      token,
      newPassword,
      confirmPassword,
    });
    return data;
  },

  // Sign Out
  signOut: async (): Promise<void> => {
    await api.post("/auth/sign-out");
  },
};
