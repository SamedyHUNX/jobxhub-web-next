import { ApiResponse } from "./api.types";

// Organizations
export interface Organization {
  id: string;
  orgName: string;
  imageUrl: string;
  description: string;
  slug: string;
  isVerified: boolean;
  isBanned: boolean;
  membersCount: number;
  pendingInvitationsCount: number;
  adminDeleteEnabled: boolean;
  createdBy: string;
  jobsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrganizationDto {
  orgName?: string;
  description?: string;
  imageFile?: File | null | undefined;
}

export type FindAllOrgsResponse = ApiResponse<Organization[]>;
export type CreateOrgResponse = ApiResponse<[]>;
