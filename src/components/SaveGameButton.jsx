import React from "react";

const SaveGameButton = ({ onClick, disabled = false }) => {
  return (
    <div className="flex justify-end items-center py-4! px-3">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="reset-btn bg-green-600! hover:bg-green-700! transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Game
      </button>
    </div>
  );
};

export default SaveGameButton;