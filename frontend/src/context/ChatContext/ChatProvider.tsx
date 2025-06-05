import { useEffect, useState } from "react";
import { ChatContext } from "./ChatContext";
import type {
  ChatProviderProps,
  Message,
  MessageDataType,
  User,
} from "./types";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [unseenMessages, setUnseenMessages] = useState<Record<string, number>>(
    {}
  );

  const { socket, axios } = useAuth();

  //function to get all users for sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error((error as Error).message);
      console.log(error);
    }
  };

  //function to get messages for selected user
  const getMessages = async (userId: string) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(
          Array.isArray(data.messages) ? data.messages : [data.messages]
        );
        console.log(data);
      }
    } catch (error) {
      toast.error((error as Error).message);
      console.log(error);
    }
  };

  //function to send message to selected user
  const sendMessage = async (messageData: MessageDataType) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser?._id}`,
        messageData
      );

      if (data.success) {
        setMessages((prevMessage) => [...prevMessage, data.newMessage]);
        console.log(data.newMessage);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
      console.log(error);
    }
  };

  //function to subscribe to messages for selected user
  const subscribeToMessage = async () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  //function to unsubscribe from messages
  const unsubscribeFromMessages = async () => {
    if (socket) socket.off("newMessage");
  };
  useEffect(() => {
    subscribeToMessage();
    return () => {
      unsubscribeFromMessages();
    };
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    setMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getMessages,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
