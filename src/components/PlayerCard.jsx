const SCORE_ACTIONS = [1, 5, 10, -1, -5, -10];

const PlayerCard = ({
  player,
  customScore,
  onScoreChange,
  onCustomScoreChange,
  onCustomScoreSubmit,
  onRemove,
}) => {
  return (
    <div className="player-card">
      <div className="player-info">
        <div className="name-row">
          <h3 className="max-w-25 truncate">{player.name}</h3>
          <span className="score-badge">{player.score} xal</span>
        </div>

        <div className="action-buttons *:text-(--primary-color)">
          {SCORE_ACTIONS.map((amount) => (
            <button key={amount} onClick={() => onScoreChange(player.id, amount)}>
              {amount > 0 ? `+${amount}` : amount}
            </button>
          ))}
        </div>
      </div>

      <div className="custom-score">
        <input
          type="number"
          placeholder="Xal"
          value={customScore || ""}
          onChange={(event) =>
            onCustomScoreChange(player.id, event.target.value)
          }
          onKeyDown={(event) =>
            event.key === "Enter" && onCustomScoreSubmit(player.id)
          }
        />

        <button onClick={() => onCustomScoreSubmit(player.id)}>Xal ver</button>

        <button className="delete-btn" onClick={() => onRemove(player.id)}>
          Sil
        </button>
      </div>
    </div>
  );
};

export default PlayerCard;
