import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/auth-api";
import { useAppSelector } from "@/stores/hooks";

export function useProfile() {
  const token = useAppSelector((state) => state.auth.token);

  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ["profile", token],
    queryFn: () => authApi.getProfile(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once on failure
  });

  return {
    profile: data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
