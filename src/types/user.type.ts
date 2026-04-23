export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  dob: string; // YYYY-MM-DD
  gender: string; // MALE, FEMALE, OTHER
  membership?: {
    tier: string;
    points: number;
  };
}

export interface UpdateProfilePayload {
  fullName: string;
  phone: string;
  dob: string;
  gender: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
