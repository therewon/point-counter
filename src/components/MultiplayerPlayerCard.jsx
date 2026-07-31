import { FaCrown } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

const SCORE_ACTIONS = [-5, -1, 1, 5];

export default function MultiplayerPlayerCard({
  player,
  rank,
  isCurrentPlayer,
  isPlaying,
  isScoreLoading,
  onScoreChange,
}) {
  const canChangeScore = isCurrentPlayer && isPlaying && !isScoreLoading;

  return (
    <article
      className={`multiplayer-player ${isCurrentPlayer ? "is-current" : ""}`}
    >
      <div className="multiplayer-player__identity">
        <span className="multiplayer-player__rank" aria-label={`${rank}. yer`}>
          {rank}
        </span>
        <span className="multiplayer-player__avatar" aria-hidden="true">
          <FiUser />
        </span>
        <div>
          <div className="multiplayer-player__name">
            <h3>{player.name}</h3>
            {player.isHost && (
              <span className="host-badge">
                <FaCrown aria-hidden="true" /> Host
              </span>
            )}
            {isCurrentPlayer && <span className="you-badge">Siz</span>}
          </div>
          <span
            className={`presence-indicator ${
              player.isOnline ? "is-online" : "is-offline"
            }`}
          >
            <span aria-hidden="true" />
            {player.isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <strong className="multiplayer-player__score">
        {Number(player.score || 0)}
        <small>xal</small>
      </strong>

      <div className="multiplayer-score-actions">
        {SCORE_ACTIONS.map((amount) => (
          <button
            key={amount}
            type="button"
            className={amount > 0 ? "is-positive" : "is-negative"}
            onClick={() => onScoreChange(player.id, amount)}
            disabled={!canChangeScore}
            title={
              isCurrentPlayer
                ? isPlaying
                  ? `${amount > 0 ? "+" : ""}${amount} xal`
                  : "Xallar oyun başladıqdan sonra dəyişdirilir"
                : "Hər oyunçu yalnız öz xalını dəyişə bilər"
            }
            aria-label={`${player.name}: ${amount > 0 ? "əlavə et" : "çıx"} ${Math.abs(amount)} xal`}
          >
            {amount > 0 ? `+${amount}` : amount}
          </button>
        ))}
      </div>
    </article>
  );
}
