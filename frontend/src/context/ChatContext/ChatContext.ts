import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Message, MessageDataType, User } from "./types";

interface ChatContextType {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  getUsers: () => Promise<void>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  sendMessage: (messageData: MessageDataType) => Promise<void>;
  setSelectedUser: Dispatch<SetStateAction<User | null>>;
  unseenMessages: Record<string, number>;
  setUnseenMessages: Dispatch<SetStateAction<Record<string, number>>>;
  getMessages: (userId: string) => Promise<void>;
  loadingMessages: boolean;
  setLoadingMessages: React.Dispatch<React.SetStateAction<boolean>>;
  sendingMessage: boolean;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);
