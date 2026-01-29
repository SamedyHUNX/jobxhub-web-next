import { CreateOrgFormData } from "@/schemas";
import { OrgsResponse } from "@/types";
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

export const orgsApi = {
  // Get all orgs with optional filtering
  findAll: async (search?: string, isVerified?: boolean) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (isVerified !== undefined)
      params.append("isVerified", String(isVerified));

    const { data } = await api.get(`/organizations?${params.toString()}`);
    return data;
  },

  // Create an Organization
  create: async (formData: CreateOrgFormData): Promise<OrgsResponse> => {
    assertApiUrl();
    const { data } = await api.post<OrgsResponse>(
      "/organizations/create",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  // Get organizations by userId
  findByUser: async (userId: string) => {
    const { data } = await api.get(`/organizations/user/${userId}`);
    return data;
  },

  // Get a single organization by ID
  findOne: async (orgId: string) => {
    const { data } = await api.get(`/organizations/org/${orgId}`);
    return data;
  },
};
