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
  token: string;
  dateOfBirth: string;
}
