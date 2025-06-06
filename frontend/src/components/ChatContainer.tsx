import assets from "@/assets/assets";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { formatMessageTime } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Loader from "./Loader";

const ChatContainer = () => {
  const {
    loading,
    setLoading,
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
  } = useChat();

  const { authUser, onlineUsers } = useAuth();

  const scrollEnd = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledRef = useRef(false);

  const [input, setInput] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // ✅ Send handler for text or image
  const handleSend = async (
    e?:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLImageElement>
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

  // ✅ File select handler
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
        setLoading(true);
        hasScrolledRef.current = false;
        await getMessages(selectedUser._id);
        setLoading(false);
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

      {/* Chat area */}
      {loading ? (
        <Loader />
      ) : (
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-24"
        >
          {messages?.map((msg) => {
            const isSender = msg.senderId === authUser?._id;

            return (
              <div
                key={msg._id}
                className={`flex items-end gap-2 ${
                  isSender ? "justify-end" : "justify-start"
                }`}
              >
                {!isSender && (
                  <img
                    src={selectedUser?.profilePic.url || assets.avatar_icon}
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
                    className="w-7 h-7 rounded-full"
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
        <div className="absolute bottom-20 left-4 right-4 bg-black/50 backdrop-blur-lg rounded-lg p-3 flex items-center gap-3">
          <img
            src={previewImage}
            alt="preview"
            className="w-16 h-16 object-cover rounded border border-gray-700"
          />
          <p className="text-white text-sm">
            Image selected. Press send or Enter.
          </p>
        </div>
      )}

      {/* Input area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => e.key === "Enter" && handleSend(e)}
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
              src={assets.gallery_icon}
              alt="gallery_icon"
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>

        <img
          onClick={handleSend}
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
