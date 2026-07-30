import React from "react";

const SaveGameButton = ({ onClick, disabled = false, players }) => {
  return (
      <button
        type="button"
        onClick={onClick}
        disabled={players.length < 2}
        className="reset-btn bg-green-600! hover:bg-green-700! transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Game
      </button>
  );
};

export default SaveGameButton;