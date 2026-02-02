import { CreateJobListingFormData } from "@/schemas";
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

export const jobListingsApi = {
  // Get all job listings with optional filtering
  findAll: async (
    search?: string,
    organizationId?: string,
    status?: string,
    type?: string,
    locationRequirement?: string,
    experienceLevel?: string
  ) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (organizationId) params.append("organizationId", organizationId);
    if (status) params.append("status", status);
    if (type) params.append("type", type);
    if (locationRequirement)
      params.append("locationRequirement", locationRequirement);
    if (experienceLevel) params.append("experienceLevel", experienceLevel);

    const { data } = await api.get(`/job-listings?${params.toString()}`);
    return data;
  },

  // Get a single job listing by ID
  findOne: async (id: string) => {
    const { data } = await api.get(`/job-listings/${id}`);
    return data;
  },

  // Create job listing
  create: async (dto: CreateJobListingFormData) => {
    assertApiUrl();
    const { data } = await api.post("/job-listings", dto);
    return data;
  },
};
