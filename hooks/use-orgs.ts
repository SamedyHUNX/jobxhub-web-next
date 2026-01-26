import { orgsApi } from "@/lib/orgs-api";
import { CreateOrgFormData } from "@/schemas";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setSelectedOrganization } from "@/stores/slices/organizations.slice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";

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

  // Restore selected org from localStorage on mount
  //   useEffect(() => {
  //     if (!selectedOrganization) {
  //       const stored = localStorage.getItem("selectedOrganization");
  //       if (stored) {
  //         try {
  //           const org = JSON.parse(stored);
  //           dispatch(setSelectedOrganization(org));
  //         } catch (e) {
  //           localStorage.removeItem("selectedOrganization");
  //         }
  //       }
  //     }
  //   }, [dispatch, selectedOrganization]);

  // Create organization mutation
  const createOrganizationMutation = useMutation({
    mutationFn: async (formData: CreateOrgFormData) => {
      return await orgsApi.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });

  return {
    // Mutations
    createOrganization: createOrganizationMutation.mutate,
    isCreating: createOrganizationMutation.isPending,
    createSuccess: createOrganizationMutation.isSuccess,
    createError: createOrganizationMutation.error as AxiosError,
  };
}
