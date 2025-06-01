import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import type {
  AuthState,
  LoginCredentials,
  SignUpCredentials,
  UserInfoProps,
} from "./types";
export type UpdateProfileData = FormData;

interface AuthProviderProps {
  children: ReactNode;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [authUser, setAuthUser] = useState<UserInfoProps | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const login = async (
    state: AuthState,
    credentials: LoginCredentials | SignUpCredentials
  ) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        const userData: UserInfoProps = {
          _id: data._id,
          fullName: data.fullName,
          email: data.email,
          profilePic: data.profilePic || "",
          bio: data.bio || "",
        };

        setAuthUser(userData);
        connectSocket(userData);
        toast.success("Login successful!");
        localStorage.setItem("token", data.token);
        setToken(data.token);
      }
    } catch (error) {
      console.log((error as Error).message);
      toast.error("Login failed. Please check your credentials.");
      setAuthUser(null);
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    socket?.disconnect();
    toast.success("Logged out successfully!");
  };

  const updateProfile = async (formData: FormData) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error((error as Error).message || "Profile update failed");
      throw error;
    }
  };

  const connectSocket = (userData: UserInfoProps) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
      withCredentials: true,
    });

    newSocket.connect();
    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
