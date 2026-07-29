const AppHeader = ({ onChooseStarter, onReset }) => {
  return (
    <div className="top">
      <div>
        <p>Oyunçuları əlavə et, xalları idarə et və lideri gör.</p>
      </div>

      <div className="buttons-container">
        <button className="start-player" onClick={onChooseStarter}>
          Başlayan oyunçunu seç
        </button>

        <button className="reset-btn" onClick={onReset}>
          Oyunu sıfırla
        </button>
      </div>
    </div>
  );
};

export default AppHeader;
