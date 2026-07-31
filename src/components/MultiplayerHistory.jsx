import {
  FiActivity,
  FiArrowDown,
  FiArrowUp,
  FiLogIn,
  FiLogOut,
  FiWifiOff,
} from "react-icons/fi";

const timeFormatter = new Intl.DateTimeFormat("az-AZ", {
  hour: "2-digit",
  minute: "2-digit",
});

const getEventContent = (event) => {
  if (event.type === "join") {
    return {
      icon: <FiLogIn aria-hidden="true" />,
      text: "otağa qoşuldu",
      tone: "join",
    };
  }

  if (event.type === "leave") {
    return {
      icon: <FiLogOut aria-hidden="true" />,
      text: "otaqdan çıxdı",
      tone: "leave",
    };
  }

  if (event.type === "offline") {
    return {
      icon: <FiWifiOff aria-hidden="true" />,
      text: "offline oldu",
      tone: "offline",
    };
  }

  const amount = Number(event.amount || 0);

  return {
    icon:
      amount >= 0 ? (
        <FiArrowUp aria-hidden="true" />
      ) : (
        <FiArrowDown aria-hidden="true" />
      ),
    text:
      amount >= 0
        ? `+${amount} xal qazandı`
        : `${Math.abs(amount)} xal itirdi`,
    tone: amount >= 0 ? "score-up" : "score-down",
  };
};

const formatEventTime = (createdAt) => {
  const timestamp = Number(createdAt || 0);
  return timestamp ? timeFormatter.format(new Date(timestamp)) : "İndi";
};

const getDateTime = (createdAt) => {
  const timestamp = Number(createdAt || 0);
  return timestamp ? new Date(timestamp).toISOString() : undefined;
};

export default function MultiplayerHistory({ history }) {
  return (
    <section className="multiplayer-history" aria-labelledby="history-title">
      <div className="multiplayer-history__heading">
        <div>
          <span>Canlı tarixçə</span>
          <h2 id="history-title">Otaqdakı hadisələr</h2>
        </div>
        <FiActivity aria-hidden="true" />
      </div>

      {history.length === 0 ? (
        <p className="multiplayer-history__empty">
          Hələ heç bir hadisə yoxdur.
        </p>
      ) : (
        <ol className="multiplayer-history__list">
          {history.map((event) => {
            const content = getEventContent(event);

            return (
              <li
                key={event.id}
                className={`multiplayer-history__event is-${content.tone}`}
              >
                <span className="multiplayer-history__icon">
                  {content.icon}
                </span>
                <div className="multiplayer-history__content">
                  <p>
                    <strong>{event.playerName}</strong> {content.text}
                  </p>
                  {event.type === "score" && (
                    <span>
                      {Number(event.previousScore || 0)} →{" "}
                      {Number(event.newScore || 0)} xal
                    </span>
                  )}
                </div>
                <time dateTime={getDateTime(event.createdAt)}>
                  {formatEventTime(event.createdAt)}
                </time>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
