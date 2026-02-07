import axios from "axios";
import {
  SignInFormData,
  SignUpFormData,
  AuthResponse,
  User,
  ProfileResponse,
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
  signUp: async (
    formData: SignUpFormData,
    locale: string,
  ): Promise<AuthResponse> => {
    assertApiUrl();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, value instanceof File ? value : String(value));
      }
    });

    const { data } = await api.post<AuthResponse>("/auth/sign-up", form, {
      headers: { "Accept-Language": locale },
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
  forgotPassword: async (
    email: string,
    locale: string,
  ): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>(
      "/auth/forgot-password",
      { email },
      { headers: { "Accept-Language": locale } },
    );
    return data;
  },

  // Reset password
  resetPassword: async (
    token: string | null,
    newPassword: string,
    confirmNewPassword: string,
  ): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/reset-password", {
      token,
      newPassword,
      confirmNewPassword,
    });
    return data;
  },

  // Sign Out
  signOut: async (): Promise<void> => {
    await api.post("/auth/sign-out");
  },
};
