import { ApplicationStage } from "@/schemas";

export interface Application {
  jobListingId: string;
  userId: string;
  coverLetter: string;
  rating: number;
  stage: ApplicationStage;
  createdAt: string;
  updatedAt: string;
}
