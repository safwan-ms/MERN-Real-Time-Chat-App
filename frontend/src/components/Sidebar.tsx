import assets from "@/assets/assets";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const {
    getUsers,
    selectedUser,
    setSelectedUser,
    users,
    unseenMessages,
    setUnseenMessages,
  } = useChat();
  const { logout, onlineUsers } = useAuth();

  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const filteredUser =
    typeof input === "string" && input.length > 0
      ? users.filter((user) =>
          user.fullName.toLowerCase().includes(input.toLowerCase())
        )
      : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <aside
      className={`bg-[#8185B2]/10 h-full p-3 sm:p-4 md:p-5 rounded-r-xl overflow-y-auto text-white ${
        selectedUser ? "hidden md:block" : "block"
      }`}
    >
      <div className="pb-4 sm:pb-5 px-1 sm:px-2">
        <div className="flex justify-between items-center">
          <img 
            src={assets.logo} 
            alt="logo" 
            className="max-w-28 sm:max-w-32 md:max-w-36 lg:max-w-40" 
          />

          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-4 sm:max-h-5 cursor-pointer"
            />

            <div className="absolute top-full right-0 z-20 w-28 sm:w-32 p-3 sm:p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-xs sm:text-sm hover:text-white transition-colors"
              >
                Edit Profile
              </p>

              <hr className="my-2 sm:my-3 border-t border-gray-500" />

              <p 
                onClick={logout} 
                className="cursor-pointer text-xs sm:text-sm hover:text-white transition-colors"
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-2 sm:py-3 px-3 sm:px-4 mt-3 sm:mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3 flex-shrink-0" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent outline-none text-white text-xs sm:text-sm placeholder-[#c8c8c8] flex-1 min-w-0"
            placeholder="Search User..."
          />
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        {filteredUser.map((user, index) => (
          <div
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            key={index}
            className={`relative flex items-center gap-2 sm:gap-3 p-2 sm:p-3 pl-3 sm:pl-4 rounded cursor-pointer transition-colors hover:bg-[#282142]/30 ${
              selectedUser?._id === user._id && "bg-[#282142]/50"
            }`}
          >
            <img
              src={user?.profilePic.url || assets.avatar_icon}
              alt="profile"
              className="w-8 sm:w-9 md:w-10 aspect-[1/1] rounded-full flex-shrink-0"
            />

            <div className="flex flex-col leading-tight sm:leading-5 min-w-0 flex-1">
              <p className="text-sm sm:text-base font-medium truncate">{user.fullName}</p>
              {onlineUsers.includes(user._id) ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>

            {unseenMessages[user._id] > 0 && (
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 text-xs h-4 w-4 sm:h-5 sm:w-5 flex justify-center items-center rounded-full bg-violet-500/70 text-white font-medium">
                {unseenMessages[user._id] > 9 ? '9+' : unseenMessages[user._id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
