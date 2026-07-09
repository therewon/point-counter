import React, { useEffect, useMemo, useState, useRef } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";


export default function App() {
  const [playerName, setPlayerName] = useState("");
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (time) => {
    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return "Just now";

    const minutes = Math.floor(diff / 60);
    if (minutes < 60)
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24)
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);
  // LocalStorage-dan oxu
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem("players");

    return savedPlayers
      ? JSON.parse(savedPlayers)
      : [{ id: 1, name: "The Rewon", score: 0 }];
  });

  const [scoreInput, setScoreInput] = useState(() => {
    const savedScoreInput = localStorage.getItem("scoreInput");
    return savedScoreInput ? JSON.parse(savedScoreInput) : {};
  });

  // Players dəyişəndə yadda saxla
  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  // Score input dəyişəndə yadda saxla
  useEffect(() => {
    localStorage.setItem("scoreInput", JSON.stringify(scoreInput));
  }, [scoreInput]);

  const addPlayer = () => {
    const trimmed = playerName.trim();

    if (!trimmed) {
      toast.warning("İstifadəçi adını daxil edin!");
      return;
    }

    const exists = players.some(
      (player) => player.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      toast.error("Bu istifadəçi artıq mövcuddur!");
      return;
    }

    setPlayers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: trimmed,
        score: 0,
      },
    ]);

    setHistory((prev) => [
      ...prev,
      {
        text: `${trimmed} əlavə olundu!`,
        time: Date.now(),
      },
    ]);
    toast.success(`${trimmed} əlavə olundu!`);
    setPlayerName("");
  };

  const removePlayer = (id) => {
    const player = players.find((p) => p.id === id);

    setPlayers((prev) => prev.filter((player) => player.id !== id));

    setScoreInput((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

    setHistory((prev) => [
      ...prev,
      {
        text: `${player?.name} silindi!`,
        time: Date.now(),
      },
    ]);
    toast.info(`${player?.name} silindi.`);
  };

  const updateScore = (id, amount) => {
    const player = players.find((p) => p.id === id);

    setPlayers((prev) =>
      prev.map((player) =>
        player.id === id
          ? { ...player, score: player.score + amount }
          : player
      )
    );

    if (amount > 0) {
      setHistory((prev) => [
        ...prev,
        {
          text: `${player?.name} +${amount} xal qazandı!`,
          time: Date.now(),
        },
      ]);
    } else {
      setHistory((prev) => [
        ...prev,
        {
          text: `${player?.name} ${Math.abs(amount)} xal itirdi!`,
          time: Date.now(),
        },
      ]);
    }
  };

  const resetScores = () => {
    setPlayers([]);
    setHistory([]);
    setScoreInput({});

    localStorage.removeItem("players");
    localStorage.removeItem("history");
    localStorage.removeItem("scoreInput");

    toast.success("Bütün məlumatlar silindi.");
  };

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.score - a.score);
  }, [players]);

  const leader = sortedPlayers[0];

  const [startingPlayer, setStartingPlayer] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isRolling, setIsRolling] = useState(false);
  const startGame = () => {
    if (players.length === 0) return;

    setIsOpen(true);
    setIsRolling(true);

    let count = 0;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * players.length);

      setActiveIndex(randomIndex);

      count++;

      if (count >= 20) {
        clearInterval(interval);

        const winner =
          players[Math.floor(Math.random() * players.length)];

        setStartingPlayer(winner);
        setActiveIndex(players.findIndex(p => p.id === winner.id));

        toast.success(`${winner.name} oyuna başlayır!`);

        setIsRolling(false);
      }
    }, 120);
  };
  return (
    <div className="app">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
      <div className="container">
        <div className="top">
          <div>
            <h1>Point Counter</h1>
            <p>İstifadəçiləri əlavə et, xalları idarə et və lideri gör.</p>
          </div>

          <div className="buttons-container">
            <button className="start-player" onClick={startGame}>Oyuna başlayanı seç</button>
            <button className="reset-btn" onClick={resetScores}>
              Reset Game
            </button>

            {isOpen && (
              <>
                <div
                  className="choose-player-overlay"
                  onClick={() => setIsOpen(false)}
                />

                <div className="choose-player-wrapper">

                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">
                      Choose a player who starts the game
                    </h1>

                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-2xl"
                    >
                      <IoMdClose />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">

                    {players.map((player, index) => (
                      <motion.div
                        key={player.id}
                        animate={{
                          // scale: activeIndex === index ? 1.5 : 1,
                          rotate:
                            activeIndex === index ? [-3, 3, -3, 0] : 0,
                          height: activeIndex === index ? "50px" : "40px"
                        }}
                        transition={{
                          duration: 0.15,
                        }}
                        className={`
                                rounded-xl
                                border-2
                                p-10
                                text-center
                                transition-all
                                flex
                                flex-col
                                items-center
                                justify-center

                                ${activeIndex === index
                            ? "border-green-500 bg-green-500 shadow-xl"
                            : "border-gray-300"
                          }
        `}
                      >
                        <h2 className="text-lg font-bold">
                          {player.name}
                        </h2>
                      </motion.div>
                    ))}

                  </div>

                  {!isRolling && startingPlayer && (
                    <motion.h2
                      initial={{ opacity: 0, scale: .5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center pt-4! text-3xl font-bold text-green-600"
                    >
                      🎉 {startingPlayer.name} starts the game!
                    </motion.h2>
                  )}

                </div>
              </>
            )}


          </div>
        </div>

        <div className="grid">
          <div className="card">
            <h2>İstifadəçi əlavə et</h2>

            <div className="add-box">
              <input
                type="text"
                placeholder="İstifadəçi adı"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPlayer()}
              />

              <button onClick={addPlayer}>Əlavə et</button>
            </div>
          </div>

          <div className="card leaderboard">
            <div className="leader-container">
              {sortedPlayers.length === 0 ? (
                <div></div>
              ) : (
                sortedPlayers.map((player, index) => (
                  <div className="leader" key={index}>
                    <p>{index === 0 ? "Leader | First Place" : (index + 1 === 2 ? "Second Place" : index + 1 === 3 ? "Third Place" : index + 1 + "th Place")}</p>
                    <div className="leader-row">
                      <h3>{player.name}</h3>
                      <span>{player.score} xal</span>
                    </div>
                  </div>
                )
                ))
              }
            </div>



            <div className="players">
              {sortedPlayers.length === 0 ? (
                <div className="empty">
                  Hələ istifadəçi əlavə edilməyib.
                </div>
              ) : (
                sortedPlayers.map((player, index) => (
                  <div className="player-card" key={player.id}>

                    <div className="player-info">
                      <div className="name-row">
                        <h3>{player.name}</h3>
                        <span className="score-badge">
                          {player.score} xal
                        </span>
                      </div>

                      <div className="action-buttons *:text-(--primary-color)">
                        <button
                          onClick={() => {
                            updateScore(player.id, 1);
                            toast.success(`${player.name} +1 xal qazandı`);
                          }}
                        >
                          +1
                        </button>

                        <button
                          onClick={() => {
                            updateScore(player.id, 5);
                            toast.success(`${player.name} +5 xal qazandı`);
                          }}
                        >
                          +5
                        </button>

                        <button
                          onClick={() => {
                            updateScore(player.id, 10);
                            toast.success(`${player.name} +10 xal qazandı`);
                          }}
                        >
                          +10
                        </button>

                        <button
                          onClick={() => {
                            updateScore(player.id, -1);
                            toast.error(`${player.name} 1 xal itirdi`);
                          }}
                        >
                          -1
                        </button>

                        <button
                          onClick={() => {
                            updateScore(player.id, -5);
                            toast.error(`${player.name} 5 xal itirdi`);
                          }}
                        >
                          -5
                        </button>

                        <button
                          onClick={() => {
                            updateScore(player.id, -10);
                            toast.error(`${player.name} 10 xal itirdi`);
                          }}
                        >
                          -10
                        </button>
                      </div>
                    </div>

                    <div className="custom-score">
                      <input
                        type="number"
                        placeholder="Xal"
                        value={scoreInput[player.id] || ""}
                        onChange={(e) =>
                          setScoreInput((prev) => ({
                            ...prev,
                            [player.id]: e.target.value,
                          }))
                        }
                      />

                      <button
                        onClick={() => {
                          const value = Number(scoreInput[player.id] || 0);

                          if (!value) return;

                          updateScore(player.id, value);

                          setScoreInput((prev) => ({
                            ...prev,
                            [player.id]: "",
                          }));
                        }}
                      >
                        Xal ver
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => removePlayer(player.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="history">
          <h2>History</h2>

          {
            history.length === 0 ? (
              <div className="history-wrapper-empty">
                <h4 className="empty-history">Hele ki melumat daxil edilmeyib</h4>
              </div>
            ) : (
              <div className="history-wrapper">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="history-item"
                    style={{
                      color:
                        item.text.includes("əlavə") || item.text.includes("qazandı")
                          ? "#22c55e"
                          : "red",
                    }}
                  >
                    <h4><span style={{ color: "black !important" }}>{index + 1}.</span> {item.text}</h4>
                    <p>{getTimeAgo(item.time)}</p>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
