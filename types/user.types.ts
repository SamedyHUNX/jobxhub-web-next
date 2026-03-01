import { ApiResponse } from "./api.types";
import { Subscription } from "./subscription.types";

// User
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  userRole: string;
  phoneNumber: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
  hasActiveSubscription: boolean;
  subscription?: Subscription;
}

export type ProfileResponse = ApiResponse<User[]>;

export type Resume = {
  userId: string;
  resumeFileUrl: string;
  resumeFileKey: string;
  aiSummary: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateNotificationSettings = {
  newJobEmailNotifications: boolean;
  aiPrompt: string | null;
};
