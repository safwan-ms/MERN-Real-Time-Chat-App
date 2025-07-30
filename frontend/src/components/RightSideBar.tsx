import assets from "@/assets/assets";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useEffect, useState } from "react";

const RightSideBar = () => {
  const { selectedUser, messages } = useChat();
  const { logout, onlineUsers } = useAuth();
  const [msgImages, setMsgImages] = useState<(string | undefined)[]>([]);

  //Get all the images from the messages and set them to state
  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  return (
    selectedUser && (
      <div className="bg-[#8185b2]/10 text-white w-full relative overflow-y-auto hidden lg:block">
        <div className="pt-8 sm:pt-12 lg:pt-16 flex items-center flex-col gap-2 text-xs font-light mx-auto px-4">
          <img
            src={selectedUser?.profilePic.url || assets.avatar_icon}
            alt="Profile_pic"
            className="w-16 sm:w-18 lg:w-20 aspect-[1/1] rounded-full"
          />
          <h1 className="px-4 sm:px-6 lg:px-10 text-lg sm:text-xl font-medium mx-auto flex items-center gap-2 text-center">
            {onlineUsers.includes(selectedUser._id) && (
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
            )}
            <span className="truncate">{selectedUser.fullName}</span>
          </h1>
          <p className="px-4 sm:px-6 lg:px-10 mx-auto text-center text-sm leading-relaxed text-gray-300">
            {selectedUser.bio}
          </p>
        </div>

        <hr className="border-[#ffffff]/50 my-4 sm:my-6 mx-4" />

        <div className="px-4 sm:px-5 text-xs sm:text-sm">
          <p className="font-medium mb-2 sm:mb-3">Media</p>
          <div className="mt-2 max-h-[150px] sm:max-h-[180px] lg:max-h-[200px] overflow-y-auto grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 opacity-80">
            {msgImages.length > 0 ? (
              msgImages.map((url, index) => (
                <div
                  key={index}
                  onClick={() => window.open(url)}
                  className="cursor-pointer rounded hover:opacity-80 transition-opacity"
                >
                  <img 
                    src={url} 
                    alt="Media" 
                    className="w-full h-16 sm:h-20 lg:h-24 object-cover rounded-md" 
                  />
                </div>
              ))
            ) : (
              <p className="col-span-2 text-gray-400 text-center py-4 text-xs">
                No media shared yet
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={() => logout()}
          className="absolute bottom-4 sm:bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-xs sm:text-sm font-light py-2 px-12 sm:px-16 lg:px-20 rounded-full cursor-pointer hover:from-purple-500 hover:to-violet-700 transition-all duration-200"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default RightSideBar;
