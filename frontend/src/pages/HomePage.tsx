import ChatContainer from "@/components/ChatContainer";
import RightSideBar from "@/components/RightSideBar";
import Sidebar from "@/components/Sidebar";
import { useChat } from "@/hooks/useChat";

const HomePage = () => {
  const { selectedUser } = useChat();
  return (
    <div className="w-full h-screen px-2 py-2 sm:px-4 sm:py-4 md:px-[5%] md:py-[2%] lg:px-[8%] lg:py-[3%] xl:px-[10%] xl:py-[3%]">
      <div
        className={`backdrop-blur-xl border border-gray-600 md:border-2 rounded-xl md:rounded-2xl overflow-hidden h-full grid ${
          selectedUser
            ? "grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr_280px] xl:grid-cols-[350px_1fr_300px]"
            : "grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr] xl:grid-cols-[350px_1fr]"
        } relative`}
      >
        <Sidebar />
        <ChatContainer />
        {selectedUser && <RightSideBar />}
      </div>
    </div>
  );
};

export default HomePage;
