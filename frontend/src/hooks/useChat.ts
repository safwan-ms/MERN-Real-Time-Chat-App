import { ChatContext } from "@/context/ChatContext/ChatContext";
import { useContext } from "react";

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used inside an ChatProvider");
  return context;
};
