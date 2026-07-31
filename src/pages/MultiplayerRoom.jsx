import { useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiCopy,
  FiLogOut,
  FiPlay,
  FiRadio,
  FiRefreshCw,
  FiUsers,
} from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import MultiplayerPlayerCard from "../components/MultiplayerPlayerCard";
import MultiplayerWinnerModal from "../components/MultiplayerWinnerModal";
import { useMultiplayerRoom } from "../hooks/useMultiplayerRoom";
import { normalizeRoomCode } from "../services/multiplayerService";
import "./multiplayer.css";

const statusContent = {
  waiting: {
    label: "Gözləmə otağı",
    text: "Oyunçuların qoşulmasını gözləyirik.",
  },
  playing: {
    label: "Oyun gedir",
    text: "Xal dəyişiklikləri bütün cihazlarda canlı yenilənir.",
  },
  finished: {
    label: "Oyun bitdi",
    text: "Qalib müəyyən olundu.",
  },
};

export default function MultiplayerRoom() {
  const { roomCode: roomCodeParam = "" } = useParams();
  const navigate = useNavigate();
  const roomCode = normalizeRoomCode(roomCodeParam);
  const {
    room,
    players,
    currentPlayer,
    isHost,
    loading,
    actionLoading,
    error,
    setError,
    startGame,
    changeScore,
    leaveRoom,
    restartGame,
  } = useMultiplayerRoom(roomCode);
  const [copied, setCopied] = useState(false);
  const [dismissedWinnerId, setDismissedWinnerId] = useState(null);

  const status = statusContent[room?.status] || statusContent.waiting;
  const winner = useMemo(
    () => (room?.winnerId ? room.players?.[room.winnerId] || null : null),
    [room?.players, room?.winnerId],
  );

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (copyError) {
      console.error("Room code kopyalana bilmədi:", copyError);
      setError("Room code kopyalana bilmədi.");
    }
  };

  const handleLeaveRoom = async () => {
    const result = await leaveRoom();

    if (result !== false) {
      navigate("/multiplayer", { replace: true });
    }
  };

  const handleRestart = async () => {
    const result = await restartGame();

    if (result !== false) {
      setDismissedWinnerId(null);
    }
  };

  if (loading) {
    return (
      <main className="multiplayer-page">
        <div className="multiplayer-room-loader" role="status" aria-live="polite">
          <span />
          <p>Otaq məlumatları yüklənir...</p>
        </div>
      </main>
    );
  }

  if (!room) {
    return (
      <main className="multiplayer-page">
        <section className="multiplayer-empty-state container">
          <span>404</span>
          <h1>Otaq tapılmadı</h1>
          <p>{error || "Room code-u yoxlayıb yenidən cəhd edin."}</p>
          <Link to="/multiplayer" className="multiplayer-primary-button">
            <FiArrowLeft aria-hidden="true" /> Multiplayer lobby-yə qayıt
          </Link>
        </section>
      </main>
    );
  }

  if (!currentPlayer) {
    return (
      <main className="multiplayer-page">
        <section className="multiplayer-empty-state container">
          <FiUsers aria-hidden="true" />
          <h1>Siz bu otaqda deyilsiniz</h1>
          <p>Otağa room code vasitəsilə lobby səhifəsindən qoşulun.</p>
          <Link to="/multiplayer" className="multiplayer-primary-button">
            Otağa qoşul
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="multiplayer-page">
      <section className="multiplayer-room container">
        <div className="room-topbar">
          <Link to="/multiplayer" className="room-back-link">
            <FiArrowLeft aria-hidden="true" /> Lobby
          </Link>

          <div className="room-code">
            <span>Room code</span>
            <strong>{roomCode}</strong>
            <button
              type="button"
              onClick={copyRoomCode}
              aria-label="Room code-u kopyala"
            >
              {copied ? <FiCheck /> : <FiCopy />}
            </button>
          </div>
        </div>

        <header className="room-header">
          <div>
            <span className={`room-status room-status--${room.status}`}>
              <FiRadio aria-hidden="true" /> {status.label}
            </span>
            <h1>{status.text}</h1>
            <p>
              Hədəf: <strong>{Number(room.settings?.targetScore || 100)} xal</strong>
              {room.settings?.allowNegativeScore
                ? " · Mənfi xala icazə verilir"
                : " · Minimum xal 0-dır"}
            </p>
          </div>

          <div className="room-header__actions">
            {isHost && room.status === "waiting" && (
              <button
                type="button"
                className="multiplayer-primary-button"
                onClick={startGame}
                disabled={players.length < 2 || actionLoading === "start"}
                title={
                  players.length < 2
                    ? "Minimum 2 oyunçu tələb olunur"
                    : "Oyunu başlat"
                }
              >
                <FiPlay aria-hidden="true" />
                {actionLoading === "start" ? "Başladılır..." : "Oyunu başlat"}
              </button>
            )}

            {isHost && room.status === "finished" && (
              <button
                type="button"
                className="multiplayer-primary-button"
                onClick={handleRestart}
                disabled={actionLoading === "restart"}
              >
                <FiRefreshCw aria-hidden="true" />
                {actionLoading === "restart" ? "Sıfırlanır..." : "Yenidən başlat"}
              </button>
            )}

            <button
              type="button"
              className="multiplayer-danger-button"
              onClick={handleLeaveRoom}
              disabled={actionLoading === "leave"}
            >
              <FiLogOut aria-hidden="true" />
              {actionLoading === "leave" ? "Çıxılır..." : "Otaqdan çıx"}
            </button>
          </div>
        </header>

        {room.status === "waiting" && (
          <div className="room-instruction">
            <strong>Kodu paylaşın:</strong> ən azı bir dostunuz qoşulduqdan
            sonra host oyunu başlada bilər.
          </div>
        )}

        {error && (
          <div className="multiplayer-error" role="alert">
            {error}
          </div>
        )}

        <div className="room-players-heading">
          <div>
            <span>İştirakçılar</span>
            <h2>Otaqdakı oyunçular</h2>
          </div>
          <span className="player-count">
            <FiUsers aria-hidden="true" /> {players.length} oyunçu
          </span>
        </div>

        <div className="multiplayer-players">
          {players.map((player) => (
            <MultiplayerPlayerCard
              key={player.id}
              player={{
                ...player,
                isHost: room.hostId === player.id,
              }}
              isCurrentPlayer={player.id === currentPlayer.id}
              isPlaying={room.status === "playing"}
              isScoreLoading={actionLoading === `score-${player.id}`}
              onScoreChange={changeScore}
            />
          ))}
        </div>
      </section>

      {room.status === "finished" &&
        winner &&
        dismissedWinnerId !== room.winnerId && (
        <MultiplayerWinnerModal
          winner={winner}
          isHost={isHost}
          isRestarting={actionLoading === "restart"}
          onRestart={handleRestart}
          onClose={() => setDismissedWinnerId(room.winnerId)}
        />
      )}
    </main>
  );
}
