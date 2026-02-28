import axios from "axios";

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
  updateMe: async (formData: FormData) => {
    assertApiUrl();
    const { data } = await api.put("/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  getMyNotificationSettings: async () => {
    assertApiUrl();
    const { data } = await api.get("/users/me/notification-settings");
    return data;
  },

  updateNotificationSettings: async (payload: {
    newJobEmailNotifications: boolean;
    aiPrompt: string | null;
  }) => {
    assertApiUrl();
    const { data } = await api.patch(
      "/users/me/notification-settings",
      payload,
    );
    return data;
  },
};
