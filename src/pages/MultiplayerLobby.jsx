import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiCopy,
  FiPlus,
  FiRadio,
  FiWifiOff,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  createRoom,
  joinRoom,
  normalizeRoomCode,
} from "../services/multiplayerService";
import "./multiplayer.css";

export default function MultiplayerLobby() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [targetScore, setTargetScore] = useState(100);
  const [allowNegativeScore, setAllowNegativeScore] = useState(false);
  const [loadingAction, setLoadingAction] = useState("");
  const [error, setError] = useState("");
  const [isOffline, setIsOffline] = useState(
    () => typeof navigator !== "undefined" && !navigator.onLine,
  );
  const isBusy = Boolean(loadingAction);

  useEffect(() => {
    const updateConnectionState = () => setIsOffline(!navigator.onLine);

    window.addEventListener("online", updateConnectionState);
    window.addEventListener("offline", updateConnectionState);

    return () => {
      window.removeEventListener("online", updateConnectionState);
      window.removeEventListener("offline", updateConnectionState);
    };
  }, []);

  const handleRoomCodeChange = (event) => {
    const normalizedValue = normalizeRoomCode(event.target.value)
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);

    setRoomCode(normalizedValue);
    setError("");
  };

  const handleCreateRoom = async () => {
    if (isOffline) {
      setError("İnternet bağlantısını yoxlayın.");
      return;
    }

    setLoadingAction("create");
    setError("");

    try {
      const code = await createRoom(user, {
        targetScore,
        allowNegativeScore,
      });
      navigate(`/room/${code}`);
    } catch (createError) {
      console.error("Otaq yaradıla bilmədi:", createError);
      setError(createError.message);
    } finally {
      setLoadingAction("");
    }
  };

  const handleJoinRoom = async (event) => {
    event.preventDefault();

    if (isOffline) {
      setError("İnternet bağlantısını yoxlayın.");
      return;
    }

    setLoadingAction("join");
    setError("");

    try {
      const code = await joinRoom(roomCode, user);
      navigate(`/room/${code}`);
    } catch (joinError) {
      console.error("Otağa qoşulmaq mümkün olmadı:", joinError);
      setError(joinError.message);
    } finally {
      setLoadingAction("");
    }
  };

  return (
    <main className="multiplayer-page">
      <section className="multiplayer-shell container">
        <div className="multiplayer-hero">
          <div>
            <span className="multiplayer-kicker">
              <FiRadio aria-hidden="true" /> Canlı oyun
            </span>
            <h1>Otaq yaradın və xalları birlikdə idarə edin.</h1>
            <p>
              Kodunuzu paylaşın. Dostlarınız qoşulan kimi bütün oyunçular və
              xallar hər cihazda real vaxtda görünəcək.
            </p>
          </div>

          <div className="multiplayer-hero__code" aria-hidden="true">
            <small>Nümunə room code</small>
            <strong>7KQ2MX</strong>
            <FiCopy />
          </div>
        </div>

        {isOffline && (
          <div className="multiplayer-warning" role="status">
            <FiWifiOff aria-hidden="true" />
            <div>
              <strong>İnternet bağlantısı yoxdur</strong>
              <p>
                Online multiplayer müvəqqəti əlçatan deyil. Offline oyun
                rejimindən istifadə etməyə davam edə bilərsiniz.
              </p>
            </div>
          </div>
        )}

        <div className="multiplayer-lobby-grid">
          <section className="multiplayer-panel">
            <span className="multiplayer-panel__number">01</span>
            <h2>Yeni otaq yarat</h2>
            <p>
              Siz host olacaqsınız və oyunu iştirakçılar hazır olduqda
              başladacaqsınız.
            </p>

            <label className="multiplayer-field">
              <span>Qalib üçün hədəf xal</span>
              <input
                type="number"
                min="1"
                max="100000"
                value={targetScore}
                onChange={(event) =>
                  setTargetScore(
                    Math.max(1, Math.min(100000, Number(event.target.value) || 1)),
                  )
                }
                disabled={isBusy}
              />
            </label>

            <label className="multiplayer-checkbox">
              <input
                type="checkbox"
                checked={allowNegativeScore}
                onChange={(event) => setAllowNegativeScore(event.target.checked)}
                disabled={isBusy}
              />
              <span>Xalın sıfırdan aşağı düşməsinə icazə ver</span>
            </label>

            <button
              type="button"
              className="multiplayer-primary-button"
              onClick={handleCreateRoom}
              disabled={isBusy || isOffline}
            >
              <FiPlus aria-hidden="true" />
              {loadingAction === "create" ? "Otaq yaradılır..." : "Yeni otaq yarat"}
            </button>
          </section>

          <section className="multiplayer-panel multiplayer-panel--dark">
            <span className="multiplayer-panel__number">02</span>
            <h2>Otağa qoşul</h2>
            <p>
              Host-un paylaşdığı 6 simvolluq kodu daxil edin. Böyük-kiçik hərf
              fərqi yoxdur.
            </p>

            <form onSubmit={handleJoinRoom}>
              <label className="multiplayer-field">
                <span>Room code</span>
                <input
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  maxLength={6}
                  value={roomCode}
                  onChange={handleRoomCodeChange}
                  placeholder="Məsələn, 7KQ2MX"
                  disabled={isBusy}
                  aria-describedby="room-code-help"
                />
              </label>
              <small id="room-code-help" className="multiplayer-field__help">
                O, 0, I və 1 simvolları istifadə edilmir.
              </small>

              <button
                type="submit"
                className="multiplayer-secondary-button"
                disabled={isBusy || isOffline || roomCode.length !== 6}
              >
                {loadingAction === "join" ? "Qoşulur..." : "Otağa qoşul"}
                <FiArrowRight aria-hidden="true" />
              </button>
            </form>
          </section>
        </div>

        {error && (
          <div className="multiplayer-error" role="alert">
            {error}
          </div>
        )}
      </section>
    </main>
  );
}
