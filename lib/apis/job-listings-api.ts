import { JobListingFormData, NewJobListingApplication } from "@/schemas";
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
    title?: string,
    organizationId?: string,
    status?: string,
    type?: string,
    locationRequirement?: string,
    experience?: string,
    city?: string,
    state?: string,
    jobIds?: string[],
  ) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (title) params.append("title", title);
    if (organizationId) params.append("organizationId", organizationId);
    if (status) params.append("status", status);
    if (type) params.append("type", type);
    if (locationRequirement)
      params.append("locationRequirement", locationRequirement);
    if (experience) params.append("experienceLevel", experience);
    if (city) params.append("city", city);
    if (state) params.append("state", state);
    jobIds?.forEach((id) => params.append("jobIds", id));

    const { data } = await api.get(`/job-listings?${params.toString()}`);
    return data;
  },

  // Get a single job listing by ID
  findOne: async (id: string) => {
    const { data } = await api.get(`/job-listings/${id}`);
    return data;
  },

  // Create job listing
  // Adjust API service
  create: async (dto: JobListingFormData) => {
    assertApiUrl();
    const { data } = await api.post("/job-listings", dto);
    return data;
  },

  update: async (id: string, dto: JobListingFormData) => {
    assertApiUrl();
    const { data } = await api.put(`/job-listings/${id}`, dto);
    return data;
  },

  delete: async (id: string) => {
    assertApiUrl();
    const { data } = await api.delete(`/job-listings/${id}`);
    return data;
  },

  // Toggle job listing status or featured flag
  toggleStatusOrFeatured: async (
    id: string,
    status?: string,
    isFeatured?: boolean,
  ) => {
    assertApiUrl();
    const { data } = await api.put(`/job-listings/${id}`, {
      status,
      isFeatured,
    });
    return data;
  },

  // Get own job listing application
  getOwnJobListingApplication: async (jobId: string, userId: string) => {
    assertApiUrl();
    const { data } = await api.get(`/job-listings/${jobId}/application`, {
      params: { userId },
    });
    return data;
  },

  // Get user resume
  getUserResume: async (userId: string) => {
    assertApiUrl();
    const { data } = await api.get(`/job-listings/resume/${userId}`);
    return data;
  },

  // Create job listing application
  createJobListingApplication: async (
    jobListingId: string,
    dto: NewJobListingApplication,
  ) => {
    assertApiUrl();
    const { data } = await api.post(
      `/job-listings/${jobListingId}/application`,
      dto,
    );
    return data;
  },

  // Upload resume
  uploadResume: async (formData: FormData) => {
    assertApiUrl();
    const { data } = await api.post(`/job-listings/resume`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
};
