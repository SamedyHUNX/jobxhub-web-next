import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  setSelectedJobListing,
  clearSelection,
} from "@/stores/slices/job-listings.slice";
import { jobListingsApi } from "@/lib/job-listings-api";
import { JobListing } from "@/types";
import { CreateJobListingFormData } from "@/schemas";
import { AxiosError } from "axios";

interface UseJobListingsParams {
  search?: string;
  organizationId?: string;
  status?: string;
  type?: string;
  locationRequirement?: string;
  experienceLevel?: string;
}

export function useJobListings(params?: UseJobListingsParams) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const selectedJobListing = useAppSelector(
    (state) => state.jobListings.selectedJobListing
  );

  // Fetch all job listings with filters using useQuery
  const {
    data: jobListingsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["jobListings", params],
    queryFn: () =>
      jobListingsApi.findAll(
        params?.search,
        params?.organizationId,
        params?.status,
        params?.type,
        params?.locationRequirement,
        params?.experienceLevel
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const jobListings = jobListingsData?.data?.jobListings || [];
  const count = jobListingsData?.count || 0;

  const fetchJobListingByJobId = (id: string) =>
    useQuery({
      queryKey: ["jobListing", id],
      queryFn: () => jobListingsApi.findOne(id),
      enabled: !!id,
      select: (data) => data.data.jobListings[0],
    });

  // Create job listing mutation
  const createJobListingMutation = useMutation({
    mutationFn: (dto: CreateJobListingFormData) => {
      return jobListingsApi.create(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
    },
    onError: (error: AxiosError) => {
      console.error(error);
    },
  });

  return {
    jobListings,
    count,
    isLoading,
    error,
    refetch,

    // Create Job Mutations
    createJobListing: createJobListingMutation.mutate,
    isCreating: createJobListingMutation.isPending,

    // Fetch job by jobId
    fetchJobListingByJobId,
  };
}
