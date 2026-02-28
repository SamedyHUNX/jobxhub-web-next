import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { jobListingsApi } from "@/lib/apis/job-listings-api";
import {
  JobListingAiSearch,
  JobListingFormData,
  NewJobListingApplication,
  newJobListingApplicationSchema,
} from "@/schemas";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import type { JobListing, JobListingFormResponse } from "@/types";
import { setSelectedJobListing } from "@/stores/slices/job-listings.slice";
import type { Application } from "@/types/application.types";

interface UseJobListingsParams {
  search?: string;
  title?: string;
  organizationId?: string;
  status?: string;
  type?: string;
  locationRequirement?: string;
  experienceLevel?: string;
  city?: string;
  stateAbbreviation?: string;
  jobIds?: string[];
}

const SELECTED_JOB_LISTING_KEY = "selectedJobListingId";

export function useJobListings(params?: UseJobListingsParams) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const selectedJobListingId = useAppSelector(
    (state) => state.jobListings.selectedJobListingId,
  );
  const selectedOrganization = useAppSelector(
    (state) => state.organizations.selectedOrgId,
  );
  const router = useRouter();

  const successT = useTranslations("apiSuccesses");
  const errorT = useTranslations("apiErrors");

  // Fetch all job listings with filters using useQuery
  const {
    data: jobListingsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "jobListings",
      params?.search,
      params?.title,
      params?.organizationId,
      params?.status,
      params?.type,
      params?.locationRequirement,
      params?.experienceLevel,
      params?.city,
      params?.stateAbbreviation,
      params?.jobIds,
    ],
    queryFn: () =>
      jobListingsApi.findAll(
        params?.search,
        params?.title,
        params?.organizationId,
        params?.status,
        params?.type,
        params?.locationRequirement,
        params?.experienceLevel,
        params?.city,
        params?.stateAbbreviation,
        params?.jobIds,
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const jobListings = jobListingsData?.data || [];
  const count = jobListings.length || 0;

  // Initialize from cookie on mount
  useEffect(() => {
    if (!selectedJobListingId && jobListings.length > 0) {
      const storedId = Cookies.get(SELECTED_JOB_LISTING_KEY);
      if (storedId) {
        const jobListing = jobListings.find(
          (j: JobListing) => j.id === storedId,
        );
        if (jobListing) {
          dispatch(setSelectedJobListing(jobListing.id));
        } else {
          // Clean up invalid cookie
          Cookies.remove(SELECTED_JOB_LISTING_KEY);
        }
      }
    }
  }, [selectedJobListingId, jobListings, dispatch]);

  const fetchJobListingByJobId = async (id: string) => {
    const result = await queryClient.fetchQuery({
      queryKey: ["jobListing", id],
      queryFn: () => jobListingsApi.findOne(id),
    });

    return result.data[0];
  };

  // In hook
  const jobListingMutation = useMutation<
    JobListingFormResponse,
    AxiosError,
    { id?: string; data: JobListingFormData }
  >({
    mutationFn: ({ id, data }) => {
      return id ? jobListingsApi.update(id, data) : jobListingsApi.create(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
      toast(
        variables.id
          ? successT("updateJobListingSuccess")
          : successT("createJobListingSuccess"),
      );
      router.push(`/employer/orgs/${selectedOrganization}/all-jobs`);
    },
    onError: (error: AxiosError) => {
      toast(extractErrorMessage(error, errorT));
    },
  });

  // Delete job listing mutation
  const deleteJobListingMutation = useMutation<any, AxiosError, string>({
    mutationFn: (id: string) => {
      return jobListingsApi.delete(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
      toast(successT("deleteJobListingSuccess"));
      router.push(`/employer/orgs/${selectedOrganization}/all-jobs`);
    },
    onError: (error: AxiosError) => {
      toast(extractErrorMessage(error, errorT));
    },
  });

  // Toggle publish/unpublish status
  const toggleJobListingStatusMutation = useMutation<
    JobListing,
    AxiosError,
    { id: string; status: string }
  >({
    mutationFn: ({ id, status }) => {
      return jobListingsApi.toggleStatusOrFeatured(id, status);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
      toast(
        variables.status === "published"
          ? successT("publishJobListingSuccess")
          : successT("unpublishJobListingSuccess"),
      );
    },
    onError: (error: AxiosError) => {
      toast(extractErrorMessage(error, errorT));
    },
  });

  const toggleJobListingFeaturedMutation = useMutation<
    JobListing,
    AxiosError,
    { id: string; isFeatured: boolean }
  >({
    mutationFn: ({ id, isFeatured }) => {
      return jobListingsApi.toggleStatusOrFeatured(id, undefined, isFeatured);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
      toast(
        variables.isFeatured
          ? successT("featureJobListingSuccess")
          : successT("unfeatureJobListingSuccess"),
      );
    },
    onError: (error: AxiosError) => {
      toast(extractErrorMessage(error, errorT));
    },
  });

  // Usage
  const saveJobListing = (jobId?: string, data?: JobListingFormData) => {
    if (!data) return;
    jobListingMutation.mutate({ id: jobId, data });
  };

  // Get published job listings
  const publishedJobListings = jobListings.filter(
    (job: JobListing) => job.status === "published",
  );

  // Get featured job listings
  const featuredJobListings = jobListings.filter(
    (job: JobListing) => job.isFeatured,
  );

  // Get job listing application
  const getJobListingApplicationMutation = useMutation<
    Application,
    AxiosError,
    { jobId: string }
  >({
    mutationFn: async ({ jobId }: { jobId: string }) => {
      const result = await jobListingsApi.getOwnJobListingApplication(jobId);
      return result.data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
    },
    onError: (error: AxiosError) => {
      toast(extractErrorMessage(error, errorT));
    },
  });

  // Create job listing application
  const createJobListingApplicationMutation = useMutation({
    mutationFn: async ({
      jobListingId,
      dto,
    }: {
      jobListingId: string;
      dto: NewJobListingApplication;
    }) => {
      const response = await jobListingsApi.createJobListingApplication(
        jobListingId,
        dto,
      );
      return response.data[0];
    },
    onSuccess: (_, variables) => {
      toast.success(successT("createJobListingApplicationSuccess"));
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
    },
    onError: (error: AxiosError) => {
      toast(extractErrorMessage(error, errorT));
    },
  });

  // Handle resume upload
  const uploadResumeMutation = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await jobListingsApi.uploadResume(formData);
      return response.data[0];
    },
    onSuccess: () => {
      toast.success(successT("uploadResumeSuccess"));
      queryClient.invalidateQueries({ queryKey: ["userResume"] });
    },
    onError: (error: AxiosError) => {
      toast(extractErrorMessage(error, errorT));
    },
  });

  // Get user resume
  const getUserResumeMutation = useMutation({
    mutationFn: async (userId: string) => {
      const result = await jobListingsApi.getUserResume(userId);
      console.log(result.data[0]);
      return result.data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
    },
    onError: (error: AxiosError) => {
      toast(extractErrorMessage(error, errorT));
    },
  });

  // Delete user resume
  const deleteUserResumeMutation = useMutation({
    mutationFn: async (userId: string) => {
      const result = await jobListingsApi.deleteUserResume(userId);
      return result.data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
      toast.success(successT("deleteResumeSuccess"));
    },
    onError: (error: AxiosError) => {
      toast(extractErrorMessage(error, errorT));
    },
  });

  // Get AI Job Listings Search Results
  const getAiJobListingSearchResultsMutation = useMutation({
    mutationFn: async (data: JobListingAiSearch) => {
      const result = await jobListingsApi.getAiSearchResults(data);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
      toast.success(successT("aiSearchSuccess"));
    },
    onError: (error: AxiosError) => {
      toast(extractErrorMessage(error, errorT));
    },
  });

  return {
    jobListings,
    count,
    isLoading,
    error,
    refetch,

    getOwnJobApplication: getJobListingApplicationMutation.mutateAsync,
    getUserResume: getUserResumeMutation.mutateAsync,
    createJobListingApplication: createJobListingApplicationMutation.mutate,

    // Create or Update job listing
    saveJobListing,
    jobListingLoading: jobListingMutation.isPending,

    // Upload resume
    uploadResume: uploadResumeMutation.mutate,
    uploadResumeLoading: uploadResumeMutation.isPending,

    // Fetch job by jobId
    fetchJobListingByJobId,

    // Delete user resume
    deleteResume: deleteUserResumeMutation.mutate,
    isDeletingResume: deleteUserResumeMutation.isPending,

    // Delete job listing
    deleteJobListing: deleteJobListingMutation.mutate,
    deleteJobListingLoading: deleteJobListingMutation.isPending,

    // Toggle publish/unpublish
    toggleJobListingStatus: toggleJobListingStatusMutation.mutate,
    toggleJobListingStatusLoading: toggleJobListingStatusMutation.isPending,

    // Toggle feature/unfeature
    toggleJobListingFeatured: toggleJobListingFeaturedMutation.mutate,
    toggleJobListingFeaturedLoading: toggleJobListingFeaturedMutation.isPending,
    publishedJobListings,
    featuredJobListings,

    getAiJobListingSearchResults:
      getAiJobListingSearchResultsMutation.mutateAsync,
  };
}
