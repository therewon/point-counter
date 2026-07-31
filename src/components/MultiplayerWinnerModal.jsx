import { FiAward, FiRefreshCw, FiX } from "react-icons/fi";

const CONFETTI_PIECES = Array.from({ length: 24 }, (_, index) => index);

export default function MultiplayerWinnerModal({
  winner,
  isHost,
  isRestarting,
  onRestart,
  onClose,
}) {
  if (!winner) {
    return null;
  }

  return (
    <div className="winner-modal" role="dialog" aria-modal="true">
      <div className="winner-modal__backdrop" onClick={onClose} />

      <div className="winner-modal__confetti" aria-hidden="true">
        {CONFETTI_PIECES.map((piece) => (
          <span
            key={piece}
            style={{
              "--confetti-index": piece,
              "--confetti-left": `${(piece * 37) % 100}%`,
              "--confetti-delay": `${(piece % 8) * -0.16}s`,
            }}
          />
        ))}
      </div>

      <section className="winner-modal__card">
        <button
          type="button"
          className="winner-modal__close"
          onClick={onClose}
          aria-label="Nəticə pəncərəsini bağla"
        >
          <FiX />
        </button>

        <span className="winner-modal__icon">
          <FiAward aria-hidden="true" />
        </span>
        <span className="winner-modal__eyebrow">Oyunun qalibi</span>
        <h2>{winner.name}</h2>
        <strong>{Number(winner.score || 0)} xal</strong>
        <p>
          Nəticə otaqdakı bütün cihazlarda real vaxtda yeniləndi.
        </p>

        {isHost ? (
          <button
            type="button"
            className="multiplayer-primary-button"
            onClick={onRestart}
            disabled={isRestarting}
          >
            <FiRefreshCw aria-hidden="true" />
            {isRestarting ? "Sıfırlanır..." : "Yenidən başlat"}
          </button>
        ) : (
          <p className="winner-modal__hint">
            Yeni oyunu host başlada bilər.
          </p>
        )}
      </section>
    </div>
  );
}
