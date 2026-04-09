import React, { useMemo, useState } from "react";
import "./App.css";

export default function App() {
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState([
    { id: 1, name: "The Rewon", score: 0 },
    { id: 2, name: "Rejiii", score: 0 },
    { id: 2, name: "Tahirov Rashad", score: 0 },
    { id: 2, name: "Revii", score: 0 },
  ]);
  const [scoreInput, setScoreInput] = useState({});

  const addPlayer = () => {
    const trimmed = playerName.trim();
    if (!trimmed) return;

    const exists = players.some(
      (player) => player.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) return;

    setPlayers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: trimmed,
        score: 0,
      },
    ]);
    setPlayerName("");
  };

  const removePlayer = (id) => {
    setPlayers((prev) => prev.filter((player) => player.id !== id));
  };

  const updateScore = (id, amount) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === id ? { ...player, score: player.score + amount } : player
      )
    );
  };

  const resetScores = () => {
    setPlayers((prev) => prev.map((player) => ({ ...player, score: 0 })));
  };

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.score - a.score);
  }, [players]);

  const leader = sortedPlayers[0];

  return (
    <div className="app">
      <div className="container">
        <div className="top">
          <div>
            <h1>Point Counter</h1>
            <p>İstifadəçiləri əlavə et, xalları idarə et və lideri gör.</p>
          </div>
          <button className="reset-btn" onClick={resetScores}>
            Xalları sıfırla
          </button>
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
            <h2>Lider lövhəsi</h2>

            {leader && (
              <div className="leader">
                <p>Hazırkı lider</p>
                <div className="leader-row">
                  <h3>{leader.name}</h3>
                  <span>{leader.score} xal</span>
                </div>
              </div>
            )}

            <div className="players">
              {sortedPlayers.length === 0 ? (
                <div className="empty">Hələ istifadəçi əlavə edilməyib.</div>
              ) : (
                sortedPlayers.map((player, index) => (
                  <div className="player-card" key={player.id}>
                    <div className="rank">{index + 1}</div>

                    <div className="player-info">
                      <div className="name-row">
                        <h3>{player.name}</h3>
                        <span className="score-badge">{player.score} xal</span>
                      </div>

                      <div className="action-buttons">
                        <button onClick={() => updateScore(player.id, 1)}>+1</button>
                        <button onClick={() => updateScore(player.id, 5)}>+5</button>
                        <button onClick={() => updateScore(player.id, 10)}>+10</button>
                        <button onClick={() => updateScore(player.id, -1)}>-1</button>
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
      </div>
    </div>
  );
}