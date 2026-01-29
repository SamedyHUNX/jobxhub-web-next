import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/auth-api";
import { useAppDispatch } from "@/stores/hooks";
import { useEffect } from "react";
import { setAuth } from "@/stores/slices/auth.slice";
import { User } from "@/types";
import { usersApi } from "@/lib/users-api";

export function useProfile() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authApi.getProfile(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
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
    },
  });

  const updateProfile = async (updatedData: FormData) => {
    return updateProfileMutation.mutateAsync(updatedData);
  };

  return {
    profile: data,
    isLoading,
    isError,
    error,
    refetch,
    updateProfile,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
  };
}
