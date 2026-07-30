import { LuHistory } from "react-icons/lu";

const AllGamesButton = ({ onClick, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="reset-btn bg-white! text-black/70! hover:bg-gray-100! hover:text-black! transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      <LuHistory size={20} />
      <span>All Games</span>
    </button>
  );
};

export default AllGamesButton;