import assets from "@/assets/assets";
import type { DummyDataProps } from "@/types";

interface ChatContainerProps {
  selectedUser: DummyDataProps | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<DummyDataProps | null>>;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  selectedUser,
  setSelectedUser,
}) => {
  return selectedUser ? (
    <main className="h-full overflow-scroll relative backdrop:blur-lg">
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={assets.profile_martin}
          alt="profile"
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          Martin Johnson
          <span className="w-2 h-2 rounded-full bg-green-500 "></span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="icon"
          className="md:hidden max-w-7"
        />
        <img
          src={assets.help_icon}
          alt="help_icon"
          className="max-md:hidden max-w-5"
        />
      </div>
    </main>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="logo" className="max-w-16" />
      <p>Chat anytime, anywhere </p>
    </div>
  );
};

export default ChatContainer;
