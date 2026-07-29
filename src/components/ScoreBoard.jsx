import Leaderboard from "./Leaderboard";
import PlayersList from "./PlayersList";

const ScoreBoard = ({
  players,
  sortedPlayers,
  scoreInput,
  onScoreChange,
  onCustomScoreChange,
  onCustomScoreSubmit,
  onRemovePlayer,
}) => {
  return (
    <div className="card leaderboard">
      <Leaderboard players={sortedPlayers} />

      <PlayersList
        players={players}
        scoreInput={scoreInput}
        onScoreChange={onScoreChange}
        onCustomScoreChange={onCustomScoreChange}
        onCustomScoreSubmit={onCustomScoreSubmit}
        onRemovePlayer={onRemovePlayer}
      />
    </div>
  );
};

export default ScoreBoard;
