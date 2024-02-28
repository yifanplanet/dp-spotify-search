"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { searchTracks } from "@/lib/spotifyClient";
import SearchBar from "./components/SearchBar";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { useUser } from "@/hooks/useUser";
import SearchResults from "./components/SearchResults";
import { Track } from "@/lib/types";
import TrackModal from "./components/TrackModal";

export default function Home() {
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const { user, isLoading } = useUser();

  useEffect(() => {
    const refreshAccessToken = async (refreshToken: string) => {
      try {
        await fetch("/api/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error("Error refreshing access token:", error);
      }
    };

    if (
      (!user?.accessToken ||
        (user?.expiresIn &&
          new Date(user?.expiresIn).getTime() < Date.now())) &&
      user?.refreshToken
    ) {
      refreshAccessToken(user?.refreshToken);
    }
  }, []);

  const handleSearch = async (query: string) => {
    if (!user?.accessToken || !user?.refreshToken) return;
    if (!query.trim()) {
      setSearchResults([]);
      setSelectedTrack(null);
      return;
    }

    console.log("Searching for", query);
    console.log("user?.accessToken", user?.accessToken);
    console.log("user?.refreshToken", user?.refreshToken);

    const results = await searchTracks({
      accessToken: user?.accessToken,
      refreshToken: user?.refreshToken,
      query,
    });
    setSearchResults(results);
  };

  const handleClickTrack = async (track: Track) => {
    setSelectedTrack(track);

    const { id, name, album, artists, imageUrl, externalUrl } = track;
    try {
      await fetch("/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          imageUrl,
          artists,
          externalUrl,
          album,
        }),
      });
      console.log(`Added ${name} to search history`);
    } catch (error) {
      console.error("Failed to add track to history", error);
    }
  };

  return (
    <main className="main-container">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : !user?.accessToken ? (
        <Login />
      ) : (
        <div className="layout">
          <Profile user={user} />
          <SearchBar onSearch={handleSearch} searchResults={searchResults} />

          {!!searchResults.length && (
            <SearchResults
              searchResults={searchResults}
              handleClickTrack={handleClickTrack}
            />
          )}

          {selectedTrack?.name && (
            <TrackModal
              track={selectedTrack}
              onClose={() => setSelectedTrack(null)}
            />
          )}
        </div>
      )}
    </main>
  );
}
