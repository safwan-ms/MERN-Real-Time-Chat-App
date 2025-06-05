import type { ReactNode } from "react";

export interface ChatProviderProps {
  children: ReactNode;
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
  password: string;
  profilePic: {
    url: string;
    publicId?: string;
  };
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageDataType {
  text?: string;
  image?: string;
}
export interface Message {
  _id?: string;
  senderId?: string;
  receiverId?: string;
  text?: string;
  image?: string;
  seen?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
