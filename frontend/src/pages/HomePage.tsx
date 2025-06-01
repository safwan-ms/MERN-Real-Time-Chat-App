import ChatContainer from "@/components/ChatContainer";
import RightSideBar from "@/components/RightSideBar";
import Sidebar from "@/components/Sidebar";
import type { UserInfoProps } from "@/context/AuthContext/types";
import { useState } from "react";

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState<UserInfoProps | null>(null);

  return (
    <div className="w-full h-screen sm:px-[10%] sm:py-[3%] ">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        }`}
      >
        <Sidebar />
        <ChatContainer
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <RightSideBar selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default HomePage;
