import PlayerCard from "./PlayerCard";

const PlayersList = ({
  players,
  scoreInput,
  onScoreChange,
  onCustomScoreChange,
  onCustomScoreSubmit,
  onRemovePlayer,
}) => {
  if (players.length === 0) {
    return <div className="empty">Hələ istifadəçi əlavə edilməyib.</div>;
  }

  return (
    <div className="players">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          customScore={scoreInput[player.id]}
          onScoreChange={onScoreChange}
          onCustomScoreChange={onCustomScoreChange}
          onCustomScoreSubmit={onCustomScoreSubmit}
          onRemove={onRemovePlayer}
        />
      ))}
    </div>
  );
};

export default PlayersList;
