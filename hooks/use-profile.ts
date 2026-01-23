import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/auth-api";
import { useAppDispatch } from "@/stores/hooks";
import { useEffect } from "react";
import { setAuth } from "@/stores/slices/auth.slice";

export function useProfile() {
  const dispatch = useAppDispatch();

  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authApi.getProfile(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: true, // Only fetch if user should be authenticated
  });

  // Sync profile data to Redux when it's fetched
  useEffect(() => {
    if (data) {
      dispatch(setAuth({ user: data }));
    }
  }, [data, dispatch]);

  return {
    profile: data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
