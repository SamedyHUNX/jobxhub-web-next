import { orgsApi } from "@/lib/apis/orgs-api";
import { extractErrorMessage } from "@/lib/utils";
import { CreateOrgFormData } from "@/schemas";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  clearSelection,
  setSelectedOrganization,
} from "@/stores/slices/organizations.slice";
import { Organization } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

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
  const successT = useTranslations("apiSuccesses");
  const errorT = useTranslations("apiErrors");

  const router = useRouter();

  // Initialize from localStorage on mount
  useEffect(() => {
    if (!selectedOrganization) {
      const stored = localStorage.getItem("selectedOrganization");
      if (stored) {
        try {
          const org = JSON.parse(stored);
          dispatch(setSelectedOrganization(org));
        } catch (e) {
          console.error("Failed to parse stored organization", e);
          localStorage.removeItem("selectedOrganization");
        }
      }
    }
  }, [selectedOrganization, dispatch]);

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
      toast.success(successT("createOrgSuccess"));
      router.push(`/employer/select`);
    },
    onError: (error: AxiosError) => {
      toast.error(extractErrorMessage(error, errorT));
    },
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
    selectedOrganization,
    // Mutations
    createOrganization: createOrganizationMutation.mutate,
    isCreating: createOrganizationMutation.isPending,
    selectOrganization,
    clearSelectedOrganization,
  };
}
