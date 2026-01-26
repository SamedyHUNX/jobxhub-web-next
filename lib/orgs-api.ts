import { CreateOrgFormData } from "@/schemas";
import { OrgsResponse } from "@/types";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function assertApiUrl() {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL env variable is not set");
  }
}

export const orgsApi = {
  create: async (formData: CreateOrgFormData): Promise<OrgsResponse> => {
    assertApiUrl();
    const { data } = await api.post<OrgsResponse>(
      "/organizations/create",
      formData
    );
    return data;
  },
};
