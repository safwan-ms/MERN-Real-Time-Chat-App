import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Message, User } from "./types";

interface ChatContextType {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  getUsers: () => Promise<void>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  sendMessage: (messageData: string) => Promise<void>;
  setSelectedUser: Dispatch<SetStateAction<User | null>>;
  unseenMessages: Record<string, number>;
  setUnseenMessages: Dispatch<SetStateAction<Record<string, number>>>;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);
