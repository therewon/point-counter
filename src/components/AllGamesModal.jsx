import { IoMdClose } from "react-icons/io";

const AllGamesModal = ({ games = [], loading, onClose }) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <div className="fixed left-1/2 top-1/2 z-50 w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-(--primary-color) shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 p-5!">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Saved Games
            </h2>

            <p className="mt-1! text-sm text-gray-400">
              View all previously saved games.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[65vh] overflow-y-auto p-5 hide-scrollbar">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-xl bg-white/5"
                />
              ))}
            </div>
          ) : games.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl">🎮</div>

              <h3 className="mt-5 text-xl font-semibold text-white">
                No Saved Games
              </h3>

              <p className="mt-2 text-gray-400">
                Save your first game to see it here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-green-500 hover:bg-white/10"
                >
                  {/* Top */}
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {game.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-400">
                        👥 {game.players?.length || 0} Players
                      </p>
                    </div>

                    {game.createdAt && (
                      <span className="rounded-full bg-green-600/20 px-3 py-1 text-xs font-medium text-green-400">
                        {game.createdAt
                          ?.toDate?.()
                          ?.toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Winner */}
                  {game.winner && (
                    <div className="mb-4 rounded-lg bg-green-600/10 p-3">
                      <p className="text-sm text-green-300">
                        🏆 Winner
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        {game.winner.name} •{" "}
                        {game.winner.score} pts
                      </p>
                    </div>
                  )}

                  {/* Players */}
                  <div className="space-y-2">
                    {game.players?.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                      >
                        <span className="text-gray-200">
                          {player.name}
                        </span>

                        <span className="font-bold text-green-400">
                          {player.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllGamesModal;