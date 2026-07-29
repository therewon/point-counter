import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";

const StartingPlayerModal = ({
  players,
  activeIndex,
  startingPlayer,
  isRolling,
  onClose,
}) => {
  return (
    <>
      <div className="choose-player-overlay" onClick={onClose} />

      <div className="bg-(--primary-color) p-5! fixed w-full sm:max-w-187.5 sm:w-1/2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[2] rounded-[10px]">
        <div className="flex justify-between items-center max-sm:p-4!">
          <h1 className="sm:text-xl! text-lg! font-bold">
            Choose a player who starts the game
          </h1>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl -translate-y-1"
            aria-label="Close modal"
          >
            <IoMdClose />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              animate={{
                rotate: activeIndex === index ? [-3, 3, -3, 0] : 0,
                height: activeIndex === index ? "50px" : "40px",
              }}
              transition={{ duration: 0.15 }}
              className={`rounded-xl border-2 p-10 text-center transition-all flex flex-col items-center justify-center ${
                activeIndex === index
                  ? "border-green-500 bg-green-500 shadow-xl"
                  : "border-gray-300"
              }`}
            >
              <h2 className="text-lg font-bold">{player.name}</h2>
            </motion.div>
          ))}
        </div>

        {!isRolling && startingPlayer && (
          <motion.h2
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center pt-4! max-sm:pb-4! text-3xl font-bold text-green-600"
          >
            🎉 {startingPlayer.name} starts the game!
          </motion.h2>
        )}
      </div>
    </>
  );
};

export default StartingPlayerModal;
