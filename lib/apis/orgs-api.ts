import { CreateOrgFormData } from "@/schemas";
import {
  CreateOrgResponse,
  FindAllOrgsResponse,
  UpdateOrganizationDto,
} from "@/types";
import axios from "axios";

import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
});

// Add request interceptor to include orgId from cookie
api.interceptors.request.use(
  (config) => {
    const orgId = Cookies.get("selectedOrgId");
    if (orgId) {
      config.headers["X-Organization-Id"] = orgId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

function assertApiUrl() {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL env variable is not set");
  }
}

export const orgsApi = {
  // Get all orgs with optional filtering
  findAll: async (
    search?: string,
    isVerified?: boolean,
  ): Promise<FindAllOrgsResponse> => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (isVerified !== undefined)
      params.append("isVerified", String(isVerified));

    const { data } = await api.get(`/organizations?${params.toString()}`);
    return data;
  },

  // Separate endpoint for user's organizations
  findByUserId: async (userId: string) => {
    const response = await api.get(`/organizations/user/${userId}`);
    return response.data;
  },

  // Create an Organization
  create: async (formData: CreateOrgFormData): Promise<CreateOrgResponse> => {
    assertApiUrl();
    const { data } = await api.post<CreateOrgResponse>(
      "/organizations",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
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

  // Get selected organization
  selectedOrg: async () => {
    const { data } = await api.get(`/organizations/org/selected`);
    return data;
  },

  // Update organization
  update: async ({ orgId, data }: { orgId: string; data: FormData }) => {
    const response = await api.put(`/organizations/org/${orgId}`, data);
    return response.data;
  },
};
