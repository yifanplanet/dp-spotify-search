import { Track } from "@/lib/types";
import Image from "next/image";
import React from "react";

interface SearchResultsProps {
  searchResults: Track[];
  handleClickTrack: (track: Track) => Promise<void>;
  handleClickMore: () => Promise<void>;
  loading: boolean;
}

export default function SearchResults({
  searchResults,
  handleClickTrack,
  handleClickMore,
  loading,
}: SearchResultsProps) {
  return (
    <div className="result-container scroll-container">
      <ul>
        {searchResults &&
          searchResults.map((track) => (
            <li
              key={track.id}
              onClick={async (e) => {
                e.preventDefault;
                await handleClickTrack(track);
              }}
            >
              {track.imageUrl && (
                <Image
                  src={track.imageUrl}
                  alt={track.name}
                  width={100}
                  height={100}
                />
              )}
              <div className="track-list-item">
                <p className="track-list-item-title">{track.name}</p>
                <p className="track-list-item-artists">{track.artists}</p>
              </div>
            </li>
          ))}
        <li
          className={"load-more text-md" + (loading ? " disabled" : "")}
          onClick={async (e) => {
            e.preventDefault;
            if (!loading) {
              await handleClickMore();
            }
          }}
        >
          {loading ? "Loading..." : "More"}
        </li>
      </ul>
    </div>
  );
}
