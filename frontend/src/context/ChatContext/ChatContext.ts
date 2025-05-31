import { createContext } from "react";

export interface ChatContextType {}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);
