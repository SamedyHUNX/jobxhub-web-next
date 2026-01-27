import { orgsApi } from "@/lib/orgs-api";
import { useQuery } from "@tanstack/react-query";

export function useOrgsByUserId(userId: string | undefined) {
  return useQuery({
    queryKey: ["organizations", "user", userId],
    queryFn: () => orgsApi.findByUser(userId!),
    enabled: !!userId,
    select: (data) => data.data.organizations,
  });
}

export function useOrgByOrgId(id: string | undefined) {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: () => orgsApi.findOne(id!),
    enabled: !!id,
    select: (data) => data.data.organizations[0],
  });
}
