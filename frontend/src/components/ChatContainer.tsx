import assets from "@/assets/assets";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { formatMessageTime } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useChat();

  const { authUser, onlineUsers } = useAuth();

  const scrollEnd = useRef<HTMLDivElement | null>(null);
  // const loggedInUserId = "680f50e4f10f3cd28382ecf9";
  const [input, setInput] = useState("");

  const handleSubmitMessage = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLImageElement>
  ) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };
  //Handle sending an image
  const handleSendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <main className="h-full overflow-hidden relative backdrop:blur-lg flex flex-col">
      {/* ----------------header-------------------- */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic.url || assets.avatar_icon}
          alt="profile"
          className="w-8 h-8 rounded-full"
        />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
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
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-20">
        {messages?.map((msg) => {
          const isSender = msg.senderId === authUser?._id;

          return (
            <div
              key={msg._id}
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
                  src={
                    isSender
                      ? authUser?.profilePic.url || assets.avatar_icon
                      : selectedUser.profilePic.url || assets.avatar_icon
                  }
                  alt="avatar"
                  className="w-7 h-7 rounded-full"
                />
              )}
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>
      {/* ----------bottom area------------- */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) =>
              e.key === "Enter" ? handleSubmitMessage(e) : null
            }
            type="text"
            placeholder="Send a Message..."
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />

          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />

          <label htmlFor="image">
            <img
              onClick={handleSubmitMessage}
              src={assets.gallery_icon}
              alt="gallery_icon"
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>

        <img
          onClick={handleSubmitMessage}
          src={assets.send_button}
          alt="send_button"
          className="w-7 cursor-pointer"
        />
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
