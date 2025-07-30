import assets from "@/assets/assets";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { formatMessageTime } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Loader from "./Loader";

const ChatContainer = () => {
  const {
    loadingMessages,
    setLoadingMessages,
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
    sendingMessage,
  } = useChat();

  const { authUser, onlineUsers } = useAuth();

  const scrollEnd = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledRef = useRef(false);

  const [input, setInput] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleSend = async (
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLImageElement>
  ) => {
    if (e) e.preventDefault();

    if (previewImage) {
      await sendMessage({ image: previewImage });
      setPreviewImage(null);
    } else if (input.trim() !== "") {
      await sendMessage({ text: input.trim() });
      setInput("");
    }
  };

  const handleSendImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPreviewImage(reader.result);
      } else {
        toast.error("Failed to preview image.");
      }
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        setLoadingMessages(true);
        hasScrolledRef.current = false;
        await getMessages(selectedUser._id);
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({
        behavior: hasScrolledRef.current ? "smooth" : "auto",
      });
      hasScrolledRef.current = true;
    }
  }, [messages]);

  return selectedUser ? (
    <main className="h-full overflow-hidden relative backdrop:blur-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 py-2 sm:py-3 px-3 sm:px-4 border-b border-stone-500">
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="back"
          className="md:hidden w-5 sm:w-6 cursor-pointer hover:opacity-70 transition-opacity"
        />
        
        <img
          src={selectedUser.profilePic.url || assets.avatar_icon}
          alt="profile"
          className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base md:text-lg text-white font-medium truncate flex items-center gap-2">
            {selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && (
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
            )}
          </p>
        </div>

        <img
          src={assets.help_icon}
          alt="help_icon"
          className="hidden md:block w-4 md:w-5 cursor-pointer hover:opacity-70 transition-opacity"
        />
      </div>

      {/* Chat area */}
      {loadingMessages ? (
        <Loader />
      ) : (
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-2 sm:px-3 md:px-4 py-2 sm:py-3 space-y-3 sm:space-y-4 pb-20 sm:pb-24"
        >
          {messages?.map((msg) => {
            const isSender = msg.senderId === authUser?._id;

            return (
              <div
                key={msg._id}
                className={`flex items-end gap-1 sm:gap-2 ${
                  isSender ? "justify-end" : "justify-start"
                }`}
              >
                {!isSender && (
                  <img
                    src={selectedUser?.profilePic.url || assets.avatar_icon}
                    alt="profile"
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex-shrink-0"
                  />
                )}

                <div className="max-w-[85%] sm:max-w-[75%] md:max-w-[70%]">
                  {msg.image ? (
                    <img
                      src={msg.image}
                      alt="chat-image"
                      className="w-full max-w-[200px] sm:max-w-xs rounded-lg border border-gray-700"
                    />
                  ) : (
                    <p
                      className={`p-2 sm:p-3 text-xs sm:text-sm font-light rounded-lg break-words text-white ${
                        isSender
                          ? "bg-violet-500/30 rounded-br-none"
                          : "bg-gray-700 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1 text-right">
                    {msg.createdAt ? formatMessageTime(msg.createdAt) : ""}
                  </p>
                </div>

                {isSender && (
                  <img
                    src={
                      isSender
                        ? authUser?.profilePic.url || assets.avatar_icon
                        : selectedUser.profilePic.url || assets.avatar_icon
                    }
                    alt="avatar"
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex-shrink-0"
                  />
                )}
              </div>
            );
          })}
          <div ref={scrollEnd}></div>
        </div>
      )}

      {/* Image Preview */}
      {previewImage && (
        <div className="justify-between absolute bottom-16 sm:bottom-20 left-2 right-2 sm:left-4 sm:right-4 bg-black/50 backdrop-blur-lg rounded-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
          <img
            src={previewImage}
            alt="preview"
            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded border border-gray-700 flex-shrink-0"
          />
          <p className="text-white text-xs sm:text-sm flex-1">Press Send button to send.</p>
          {sendingMessage && <Loader />}
        </div>
      )}

      {/* Input area wrapped in a form */}
      <form
        onSubmit={handleSend}
        className="absolute bottom-0 left-0 right-0 flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-t from-black/20 to-transparent"
      >
        <div className="flex-1 flex items-center bg-gray-100/10 px-3 sm:px-4 rounded-full min-w-0">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Send a Message..."
            className="flex-1 text-xs sm:text-sm p-2 sm:p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent min-w-0"
          />

          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />

          <label htmlFor="image" className="cursor-pointer">
            <img
              src={assets.gallery_icon}
              alt="gallery_icon"
              className="w-4 sm:w-5 mr-1 sm:mr-2 hover:opacity-70 transition-opacity"
            />
          </label>
        </div>

        <button type="submit" className="flex-shrink-0">
          <img
            src={assets.send_button}
            alt="send_button"
            className="w-6 sm:w-7 cursor-pointer hover:opacity-70 transition-opacity"
          />
        </button>
      </form>
    </main>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 text-gray-500 bg-white/10 hidden md:flex h-full px-4">
      <img src={assets.logo_icon} alt="logo" className="w-12 sm:w-16 opacity-50" />
      <p className="text-sm sm:text-base text-center">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
