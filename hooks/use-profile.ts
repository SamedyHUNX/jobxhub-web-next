import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/apis/auth-api";
import { useAppDispatch } from "@/stores/hooks";
import { useEffect } from "react";
import { setAuth } from "@/stores/slices/auth.slice";
import { usersApi } from "@/lib/apis/users-api";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";
import { AxiosError } from "axios";

export function useProfile() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const successT = useTranslations("apiSuccesses");
  const errorT = useTranslations("apiErrors");

  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authApi.getProfile(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: true,
  });

  // Sync profile data to Redux when it's fetched
  useEffect(() => {
    if (data) {
      dispatch(setAuth({ user: data }));
    }
  }, [data, dispatch]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (updatedData: FormData) => usersApi.updateMe(updatedData),
    onSuccess: (response) => {
      const updatedUser = response.data.users;
      // Update the query cache
      queryClient.setQueryData(["profile"], updatedUser);

      // Update Redux
      dispatch(setAuth({ user: updatedUser }));
      toast.success(successT("profileUpdated"));
    },
    onError(error: AxiosError) {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  return {
    // Get data
    profile: data,
    isLoading,
    isError,
    error,
    refetch,

    // Update profile
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
}
