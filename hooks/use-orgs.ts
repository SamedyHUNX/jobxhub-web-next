import { orgsApi } from "@/lib/apis/orgs-api";
import { extractErrorMessage } from "@/lib/utils";
import { CreateOrgFormData, OrgUserNotificationSettings } from "@/schemas";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  clearSelection,
  setSelectedOrgId,
} from "@/stores/slices/organizations.slice";
import type { CreateOrgResponse, Organization } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface UseOrgsParams {
  search?: string;
  isVerified?: boolean;
}

interface SelectOrgOptions {
  redirectUrl?: string | ((org: Organization) => string);
  skipRedirect?: boolean;
}

const SELECTED_ORG_KEY = "selectedOrgId";

export function useOrgs(params?: UseOrgsParams) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const selectedOrgId = useAppSelector(
    (state) => state.organizations.selectedOrgId,
  );
  const successT = useTranslations("apiSuccesses");
  const errorT = useTranslations("apiErrors");
  const router = useRouter();
  const locale = useLocale();

  // Fetch organizations
  const {
    data: orgsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["organizations", params?.search, params?.isVerified],
    queryFn: () => orgsApi.findAll(params?.search, params?.isVerified),
    staleTime: 5 * 60 * 1000,
  });

  const allOrgs = orgsData?.data || [];

  // Initialize from cookie on mount
  useEffect(() => {
    if (!selectedOrgId && allOrgs.length > 0) {
      const storedId = Cookies.get(SELECTED_ORG_KEY);
      if (storedId) {
        const org = allOrgs.find((o: Organization) => o.id === storedId);
        if (org) {
          dispatch(setSelectedOrgId(org.id));
        } else {
          // Clean up invalid cookie
          Cookies.remove(SELECTED_ORG_KEY);
        }
      }
    }
  }, [selectedOrgId, allOrgs, dispatch]);

  // Create organization mutation
  const createOrganizationMutation = useMutation<
    CreateOrgResponse,
    AxiosError,
    CreateOrgFormData
  >({
    mutationFn: async (formData) => {
      return await orgsApi.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
      toast.success(successT("createOrgSuccess"));
      router.push(`/employer/select`);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Select organization with navigation
  const selectOrganization = useCallback(
    (orgId: string, options?: SelectOrgOptions) => {
      const org = allOrgs.find((o: Organization) => o.id === orgId);
      if (!org) return;

      // Update state and cookie
      dispatch(setSelectedOrgId(org.id));
      Cookies.set(SELECTED_ORG_KEY, orgId, {
        secure: true,
        sameSite: "strict",
        expires: 7,
      });

      // Handle navigation
      if (!options?.skipRedirect) {
        let url: string;

        if (options?.redirectUrl) {
          url =
            typeof options.redirectUrl === "function"
              ? options.redirectUrl(org)
              : options.redirectUrl;
        } else {
          // Default redirect
          url = `/employer/orgs/${org.id}`;
        }

        router.push(url);
      }
    },
    [dispatch, allOrgs, router, locale],
  );

  const selectedOrgData = useMemo(
    () => allOrgs.find((org: Organization) => org.id === selectedOrgId),
    [allOrgs, selectedOrgId],
  );

  // Navigate to create organization page
  const navigateToCreateOrg = useCallback(
    (options?: { hideSlug?: boolean; skipInvitationScreen?: boolean }) => {
      const baseUrl = `/${locale}/employer/new`;
      const params = new URLSearchParams();

      if (options?.hideSlug) {
        params.append("hideSlug", "true");
      }
      if (options?.skipInvitationScreen !== undefined) {
        params.append(
          "skipInvitationScreen",
          String(options.skipInvitationScreen),
        );
      }

      const url = params.toString() ? `${baseUrl}?${params}` : baseUrl;
      router.push(url);
    },
    [router, locale],
  );

  // Clear selected organization
  const clearSelectedOrganization = useCallback(() => {
    dispatch(clearSelection());
    Cookies.remove(SELECTED_ORG_KEY);
  }, [dispatch]);

  // Update organization mutation
  const updateOrganizationMutation = useMutation<
    Organization,
    AxiosError,
    { orgId: string; data: FormData }
  >({
    mutationFn: async ({ orgId, data }) => {
      return await orgsApi.update({ orgId, data });
    },
    onSuccess: (_, { orgId }) => {
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization", orgId],
      });
      toast.success(successT("updateOrgSuccess"));
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  const getOrgUserNotificationSettingsMutation = useMutation({
    mutationFn: (orgId: string) =>
      orgsApi.getOrgUserNotificationSettings(orgId),
    onSuccess: (response) => {
      if (response.data && response.data.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["organizations"] });
        toast.success(successT("getOrgUserNotificationSettingsSuccess"));
        return response.data[0];
      }
    },
    onError(error: AxiosError) {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  const updateOrgUserNotificationSettingsMutation = useMutation({
    mutationFn: ({
      orgId,
      data,
    }: {
      orgId: string;
      data: OrgUserNotificationSettings;
    }) => orgsApi.updateOrgUserNotificationSettings(orgId, data),
    onSuccess: (response) => {
      if (response.data && response.data.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["organizations"] });
        toast.success(successT("updateOrgUserNotificationSettingsSuccess"));
        return response.data[0];
      }
    },
    onError(error: AxiosError) {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  return {
    // Data
    allOrgs,
    selectedOrgId,
    selectedOrgData,
    isLoading,
    error,

    // Actions
    selectOrganization,
    createOrganization: createOrganizationMutation.mutate,
    navigateToCreateOrg,
    clearSelectedOrganization,

    // Mutation states
    isCreating: createOrganizationMutation.isPending,

    updateOrganization: updateOrganizationMutation.mutateAsync,
    isUpdating: updateOrganizationMutation.isPending,

    getOrgUserNotificationSettingsMutation,
    updateOrgUserNotificationSettingsMutation,
  };
}
