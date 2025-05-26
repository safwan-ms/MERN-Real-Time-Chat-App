import assets, { messagesDummyData } from "@/assets/assets";
import { formatMessageTime } from "@/lib/utils";
import type { DummyDataProps } from "@/types";
import { useEffect, useRef } from "react";

interface ChatContainerProps {
  selectedUser: DummyDataProps | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<DummyDataProps | null>>;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  selectedUser,
  setSelectedUser,
}) => {
  const scrollEnd = useRef<HTMLDivElement | null>(null);
  const loggedInUserId = "680f50e4f10f3cd28382ecf9";

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUser]);

  return selectedUser ? (
    <main className="h-full overflow-hidden relative backdrop:blur-lg flex flex-col">
      {/* ----------------header-------------------- */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-500">
        <img
          src={assets.profile_martin}
          alt="profile"
          className="w-8 h-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="icon"
          className="md:hidden w-6 cursor-pointer"
        />
        <img
          src={assets.help_icon}
          alt="help_icon"
          className="max-md:hidden w-5"
        />
      </div>

      {/* ---------------chat area----------------- */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messagesDummyData.map((msg, index) => {
          const isSender = msg.senderId === loggedInUserId;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              {/* Incoming avatar */}
              {!isSender && (
                <img
                  src={assets.profile_martin}
                  alt="profile"
                  className="w-7 h-7 rounded-full"
                />
              )}

              <div className="max-w-[70%]">
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt="chat-image"
                    className="w-full max-w-xs rounded-lg border border-gray-700"
                  />
                ) : (
                  <p
                    className={`p-2 text-sm font-light rounded-lg break-words text-white ${
                      isSender
                        ? "bg-violet-500/30 rounded-br-none"
                        : "bg-gray-700 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </p>
                )}
                <p className="text-[10px] text-gray-400 mt-1 text-right">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>

              {/* Outgoing avatar */}
              {isSender && (
                <img
                  src={assets.avatar_icon}
                  alt="avatar"
                  className="w-7 h-7 rounded-full"
                />
              )}
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>
    </main>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full">
      <img src={assets.logo_icon} alt="logo" className="w-16" />
      <p>Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
