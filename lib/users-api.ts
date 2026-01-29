import axios from "axios";
import { AuthResponse, User } from "@/types";

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

export const usersApi = {
  // Sign In
  updateMe: async (updatedData: Partial<User>) => {
    assertApiUrl();
    const { data } = await api.put("/users/me", updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  },
};
