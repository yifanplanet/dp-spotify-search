import React, { useEffect, useState } from "react";

interface HistoryEntry {
  track_id: string;
  track_name: string;
  clicked_at: Date;
}

const History = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await fetch("/api/history");
      if (!response.ok) {
        console.error("Failed to fetch history");
        return;
      }
      const data = await response.json();
      setHistory(data);
    };

    fetchHistory();
  }, []);

  return (
    <div className="history-list">
      {history.length > 0 ? (
        <ul>
          {history.map((entry) => (
            <li key={entry.track_id}>
              {entry.track_name} - {new Date(entry.clicked_at).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default History;
