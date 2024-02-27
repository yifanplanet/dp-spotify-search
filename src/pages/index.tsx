"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { searchTracks } from "@/lib/spotifyClient";
import SearchBar from "./components/SearchBar";
import Login from "./components/Login";
import { useRouter } from "next/router";
import Profile from "./components/Profile";
import { useUser } from "@/hooks/useUser";
import { Track } from "@/lib/spotify";

export default function Home() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const router = useRouter();
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
    if (!user?.accessToken) return;
    if (!query.trim()) return;
    const results = await searchTracks(user?.accessToken, query);
    setSearchResults(results);
  };

  const handleClickTrack = async (track: Track) => {
    setSelectedTrack(track);

    const { id, name, album, artists } = track;
    try {
      await fetch("/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trackId: id, trackName: name }),
      });
      console.log(`Added ${name} to search history`);
    } catch (error) {
      console.error("Failed to add track to history", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : !user ? (
        <Login />
      ) : (
        <>
          <Profile user={user} />
          <SearchBar onSearch={handleSearch} />
          {selectedTrack && (
            <div>
              <h2>Selected Track</h2>
              <p>{selectedTrack.name}</p>
              <p>{selectedTrack.album.name}</p>
              <p>{selectedTrack.artists.map((a) => a.name).join(", ")}</p>
              <Image
                src={selectedTrack.album.images[0].url}
                alt={selectedTrack.name}
                width={200}
                height={200}
              />
            </div>
          )}
          <ul className="grid grid-cols-3 gap-4">
            {searchResults.map((track) => (
              <li
                key={track.id}
                onClick={async (e) => {
                  e.preventDefault;
                  await handleClickTrack(track);
                }}
              >
                <Image
                  src={track.album.images[0].url}
                  alt={track.name}
                  width={200}
                  height={200}
                />
                <p>{track.name}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
