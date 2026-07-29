const AddPlayerForm = ({ playerName, onPlayerNameChange, onAddPlayer }) => {
  return (
    <div className="card">
      <h2>İstifadəçi əlavə et</h2>

      <div className="add-box">
        <input
          type="text"
          placeholder="İstifadəçi adı"
          value={playerName}
          onChange={(event) => onPlayerNameChange(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && onAddPlayer()}
        />

        <button onClick={onAddPlayer}>Əlavə et</button>
      </div>
    </div>
  );
};

export default AddPlayerForm;
