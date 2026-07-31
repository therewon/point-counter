import { FiArrowRight, FiCloud, FiWifiOff } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./multiplayer.css";

export default function GameModePage() {
  return (
    <main className="mode-page">
      <section className="mode-hero container">
        <span className="mode-hero__eyebrow">Oyun rejimini seçin</span>
        <h1>Hesabı necə aparmaq istəyirsiniz?</h1>
        <p>
          Eyni cihazda klassik xal sayğacından istifadə edin və ya dostlarınızla
          otağa qoşulub nəticələri bütün cihazlarda real vaxtda izləyin.
        </p>

        <div className="mode-grid">
          <Link to="/offline" className="mode-card">
            <span className="mode-card__icon mode-card__icon--offline">
              <FiWifiOff aria-hidden="true" />
            </span>
            <span className="mode-card__tag">İnternetsiz işləyir</span>
            <h2>Offline oyun</h2>
            <p>
              Oyunçuları bir cihazda əlavə edin, xalları local olaraq idarə edin
              və mövcud oyun tarixçənizi qoruyun.
            </p>
            <span className="mode-card__action">
              Offline oyuna keç <FiArrowRight aria-hidden="true" />
            </span>
          </Link>

          <Link to="/multiplayer" className="mode-card mode-card--online">
            <span className="mode-card__icon mode-card__icon--online">
              <FiCloud aria-hidden="true" />
            </span>
            <span className="mode-card__tag">Real vaxtda sinxron</span>
            <h2>Online multiplayer</h2>
            <p>
              6 simvolluq otaq yaradın, kodu paylaşın və hər kəsin xalını eyni
              anda bütün cihazlarda görün.
            </p>
            <span className="mode-card__action">
              Multiplayer aç <FiArrowRight aria-hidden="true" />
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
