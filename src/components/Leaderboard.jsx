const getPlaceLabel = (index) => {
  if (index === 0) return "Leader | First Place";
  if (index === 1) return "Second Place";
  if (index === 2) return "Third Place";
  return `${index + 1}th Place`;
};

const Leaderboard = ({ players }) => {
  if (players.length === 0) return null;

  return (
    <div className="leader-container">
      {players.map((player, index) => (
        <div className={
            index === 0 ? `bg-[#D4AF37] border border-[#B8860B] text-[#3E2E00] active-leader` 
          : index === 1 ? `bg-[#BFC5CE] border border-[#8D949E] text-[#2F3540] active-leader` 
          : index === 2 ? `bg-[#B87333] border border-[#8A5A2B] text-[#2E1705] active-leader` 
          : `leader`} 
          key={player.id} >
          <p>{getPlaceLabel(index)}</p>

          <div className="leader-row">
            <h3 className="truncate max-w-40">{player.name}</h3>
            <span>{player.score} xal</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
