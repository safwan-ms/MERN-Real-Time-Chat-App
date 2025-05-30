import { createContext, useEffect, useState, type ReactNode } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { AuthState, LoginCredentials, UserInfoProps } from "@/types";

interface AuthContextType {
  axios: typeof axios;
  authUser: UserInfoProps | null;
  onlineUsers: string[];
  socket: Socket | null;
}
interface AuthProviderProps {
  children: ReactNode;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [authUser, setAuthUser] = useState<UserInfoProps | null>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  axios.defaults.withCredentials = true; //

  //Check if user is authenticated and if so, set the user data and connect the socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      console.log(data);
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  //Login function to handle user authentication and socket connection
  const login = async (state: AuthState, credentials: LoginCredentials) => {
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
      }
    } catch (error) {
      console.log((error as Error).message);
      toast.error("Login failed. Please check your credentials.");
      setAuthUser(null);
    }
  };

  //Logout function to handle user logout and socket disconnected
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    socket?.disconnect();
  };

  //Update profile function to handle user profile updates

  const updateProfile = (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  //Connect socket function to handle socket connection and online users updates
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
