import { useEffect, useState } from "react";
import { getTimeAgo } from "../utils/getTimeAgo";

const getHistoryColor = (text) => {
  return text.includes("əlavə") || text.includes("qazandı")
    ? "#22c55e"
    : "red";
};

const History = ({ history }) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="history">
      <h2>History</h2>

      {history.length === 0 ? (
        <div className="history-wrapper-empty">
          <h4 className="empty-history">Hələ ki məlumat daxil edilməyib</h4>
        </div>
      ) : (
        <div className="history-wrapper">
          {[...history].reverse().map((item, index) => (
            <div
              key={item.id ?? `${item.time}-${index}`}
              className="history-item"
              style={{ color: getHistoryColor(item.text) }}
            >
              <h4>
                <span style={{ color: "black" }}>{index + 1}.</span> {item.text}
              </h4>
              <p>{getTimeAgo(item.time, now)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
