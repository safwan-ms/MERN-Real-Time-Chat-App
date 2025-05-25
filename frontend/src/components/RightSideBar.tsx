import type { DummyDataProps } from "@/types";

interface RightSidebarProps {
  selectedUser: DummyDataProps | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<DummyDataProps | null>>;
}

const RightSideBar: React.FC<RightSidebarProps> = ({
  selectedUser,
  setSelectedUser,
}) => {
  return (
    <div>
      <h1>RightSideBar</h1>
    </div>
  );
};

export default RightSideBar;
