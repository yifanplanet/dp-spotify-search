import Image from "next/image";
import React, { useEffect, useState } from "react";
import TrackModal from "./TrackModal";
import { Track } from "@/lib/types";

const History = () => {
  const [history, setHistory] = useState<Track[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<Track | null>(null);

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
    <>
      <div
        className={`history-container ${
          history.length > 0 ? "show-history" : ""
        }`}
      >
        <p className="text-md">Recent searches:</p>

        {history.length > 0 && (
          <div className="history-list scroll-container">
            <ul>
              {history.map((entry) => (
                <li
                  key={entry.id}
                  onClick={async (e) => {
                    e.preventDefault;
                    setSelectedHistory(entry);
                  }}
                  className="history-entry"
                >
                  {entry.imageUrl && (
                    <Image
                      src={entry.imageUrl}
                      alt={entry.name}
                      width={80}
                      height={80}
                    />
                  )}
                  <div className="track-list-item">
                    <p className="track-list-item-title small">{entry.name}</p>
                    <p className="track-list-item-artists small">
                      {entry.artists}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {selectedHistory?.name && (
        <TrackModal
          track={selectedHistory}
          onClose={() => setSelectedHistory(null)}
        />
      )}
    </>
  );
};

export default History;
