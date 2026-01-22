// Locale
export type LocaleType = "en" | "de" | "km";

// User
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  userRole: string;
  dateOfBirth: string;
  token: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  name: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  status: string;
  code: number;
  message: string;
  data: UsersData;
}

export interface UsersData {
  users: User[];
}

export type SignInResponse = UsersData;

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  image: File | null;
}
