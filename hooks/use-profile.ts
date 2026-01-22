import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/auth-api";

export function useProfile() {
  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authApi.getProfile(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    profile: data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
