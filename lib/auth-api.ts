import axios from "axios";
import { AuthResponse, SignInFormData, SignUpFormData, User } from "@/types";

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
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  },

  // Signup
  signUp: async (
    formData: SignUpFormData,
    locale: string
  ): Promise<AuthResponse> => {
    assertApiUrl();

    // Create FormData instance
    const form = new FormData();

    // Append all fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          form.append(key, value);
        } else {
          form.append(key, String(value));
        }
      }
    });

    // for (const [key, value] of form.entries()) {
    //   console.log(key, value);
    // }

    const { data } = await api.post<AuthResponse>("/auth/sign-up", form, {
      headers: {
        "Accept-Language": locale,
      },
    });
    return data;
  },

  // Get user info
  getProfile: async () => {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },

  // Verify Email
  verifyEmail: async (token: string): Promise<Partial<AuthResponse>> => {
    const { data } = await api.post<Partial<AuthResponse>>(
      "/auth/verify-email",
      {
        token,
      }
    );
    return data;
  },

  // Forgot password
  forgotPassword: async (
    email: string,
    locale: string
  ): Promise<{ user: User }> => {
    const {
      data: { data },
    } = await api.post(
      "/auth/forgot-password",
      { email },
      {
        headers: {
          "Accept-Language": locale,
        },
      }
    );
    return data;
  },

  // Reset password
  resetPassword: async (
    token: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/reset-password", {
      token,
      newPassword,
      confirmNewPassword,
    });
    return data;
  },

  // Sign Out
  signOut: async () => {
    await api.post("/auth/sign-out");
  },
};
