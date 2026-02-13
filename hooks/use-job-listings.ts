import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { jobListingsApi } from "@/lib/apis/job-listings-api";
import { JobListingFormData } from "@/schemas";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import type { JobListing, JobListingFormResponse } from "@/types";
import { setSelectedJobListing } from "@/stores/slices/job-listings.slice";

interface UseJobListingsParams {
  search?: string;
  organizationId?: string;
  status?: string;
  type?: string;
  locationRequirement?: string;
  experienceLevel?: string;
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
      params?.organizationId,
      params?.status,
      params?.type,
      params?.locationRequirement,
      params?.experienceLevel,
    ],
    queryFn: () =>
      jobListingsApi.findAll(
        params?.search,
        params?.organizationId,
        params?.status,
        params?.type,
        params?.locationRequirement,
        params?.experienceLevel,
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

  return {
    jobListings,
    count,
    isLoading,
    error,
    refetch,

    // Create or Update job listing
    saveJobListing,
    jobListingLoading: jobListingMutation.isPending,

    // Fetch job by jobId
    fetchJobListingByJobId,

    // Toggle publish/unpublish
    toggleJobListingStatus: toggleJobListingStatusMutation.mutate,
    toggleJobListingStatusLoading: toggleJobListingStatusMutation.isPending,

    // Toggle feature/unfeature
    toggleJobListingFeatured: toggleJobListingFeaturedMutation.mutate,
    toggleJobListingFeaturedLoading: toggleJobListingFeaturedMutation.isPending,
    publishedJobListings,
    featuredJobListings,
  };
}
