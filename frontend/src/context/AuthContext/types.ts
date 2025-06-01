export interface UpdateProfileData {
  fullName?: string;
  bio?: string;
  profilePic?: {
    url: string;
    publicId: string;
  };
}

export interface UserInfoProps {
  _id: string;
  email: string;
  fullName: string;
  profilePic: {
    url: string;
    publicId: string;
  };
  bio: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  fullName: string;
  bio: string;
}

export type AuthState = "login" | "signup"; // add more if needed
