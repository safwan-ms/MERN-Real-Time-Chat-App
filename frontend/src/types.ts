export interface UserInfoProps {
  _id: string;
  email: string;
  fullName: string;
  profilePic: string;
  bio: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateProfile {
  bio: string;
}

export type AuthState = "login" | "register"; // add more if needed
