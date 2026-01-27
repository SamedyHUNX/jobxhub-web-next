import { orgsApi } from "@/lib/orgs-api";
import { CreateOrgFormData } from "@/schemas";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  clearSelection,
  setSelectedOrganization,
} from "@/stores/slices/organizations.slice";
import { Organization } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useCallback, useEffect } from "react";

interface UseOrgsParams {
  search?: string;
  isVerified?: boolean;
}

export function useOrgs(params?: UseOrgsParams) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const selectedOrganization = useAppSelector(
    (state) => state.organizations.selectedOrgId
  );

  // Fetch organizations with filters using useQuery
  const {
    data: organizationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["organizations", params],
    queryFn: () => orgsApi.findAll(params?.search, params?.isVerified),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const organizations = organizationsData?.data.organizations || [];

  // Create organization mutation
  const createOrganizationMutation = useMutation({
    mutationFn: async (formData: CreateOrgFormData) => {
      return await orgsApi.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });

  // Fetch organizations by user
  const fetchOrgsByUserId = (userId: string) =>
    useQuery({
      queryKey: ["organizations", "user", userId],
      queryFn: () => orgsApi.findByUser(userId),
      enabled: !!userId,
      select: (data) => data.data.organizations,
    });

  // Fetch single organization
  const fetchOrgByOrgId = (id: string) =>
    useQuery({
      queryKey: ["organization", id],
      queryFn: () => orgsApi.findOne(id),
      enabled: !!id,
      select: (data) => data.data.organizations[0],
    });

  // Select organization
  const selectOrganization = useCallback(
    (orgOrId: string | Organization) => {
      if (typeof orgOrId === "string") {
        const org = organizations.find((o: Organization) => o.id === orgOrId);
        if (org) {
          dispatch(setSelectedOrganization(org));
          localStorage.setItem("selectedOrganization", JSON.stringify(org));
        }
      } else {
        dispatch(setSelectedOrganization(orgOrId));
        localStorage.setItem("selectedOrganization", JSON.stringify(orgOrId));
      }
    },
    [dispatch, organizations]
  );

  // Clear selected organization
  const clearSelectedOrganization = useCallback(() => {
    dispatch(clearSelection());
    localStorage.removeItem("selectedOrganization");
  }, [dispatch]);

  return {
    // Mutations
    createOrganization: createOrganizationMutation.mutate,
    isCreating: createOrganizationMutation.isPending,
    createSuccess: createOrganizationMutation.isSuccess,
    createError: createOrganizationMutation.error as AxiosError,

    fetchOrgByOrgId,
    fetchOrgsByUserId,

    selectOrganization,
    clearSelectedOrganization,
  };
}
