import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/apis/auth-api";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { useEffect } from "react";
import { setAuth } from "@/stores/slices/auth.slice";
import { usersApi } from "@/lib/apis/users-api";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";
import { AxiosError } from "axios";
import { UpdateProfileResponse } from "@/types";

export function useProfile() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const successT = useTranslations("apiSuccesses");
  const errorT = useTranslations("apiErrors");

  const {
    data: profileData,
    isLoading,
    error,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authApi.getProfile(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: true,
  });

  // Sync profile data to Redux when it's fetched
  useEffect(() => {
    if (profileData) {
      dispatch(setAuth({ user: profileData }));
    }
  }, [profileData, dispatch]);

  // Update profile mutation
  const updateProfileMutation = useMutation<
    UpdateProfileResponse,
    AxiosError,
    FormData
  >({
    mutationFn: (updatedData) => usersApi.updateMe(updatedData),
    onSuccess: (response) => {
      if (response.data && response.data.length > 0) {
        const updatedUser = response.data[0];
        queryClient.setQueryData(["profile"], response.data);
        dispatch(setAuth({ user: updatedUser }));
        toast.success(successT("profileUpdated"));
      } else {
        toast.error(errorT("profileUpdateFailed"));
      }
    },
    onError(error: AxiosError) {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  return {
    // Get data
    user,
    isLoading,
    isError,
    error,
    refetch,

    // Update profile
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
}
