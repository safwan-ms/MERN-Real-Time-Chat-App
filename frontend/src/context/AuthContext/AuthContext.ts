import { createContext } from "react";
import type { Socket } from "socket.io-client";
import axios from "axios";
import type { AuthState, LoginCredentials, UserInfoProps } from "./types";

export interface AuthContextType {
  axios: typeof axios;
  authUser: UserInfoProps | null;
  onlineUsers: string[];
  socket: Socket | null;
  login: (state: AuthState, credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (body: Partial<UserInfoProps>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
