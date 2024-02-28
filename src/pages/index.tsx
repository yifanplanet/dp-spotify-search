"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { getSpotifyTracks, searchTracks } from "@/lib/spotifyClient";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);

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

    setSearchResults([]);
    setSelectedTrack(null);

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

    setSearchQuery(query);

    const results = await searchTracks({
      accessToken: user?.accessToken,
      refreshToken: user?.refreshToken,
      query,
    });
    setSearchResults(results);

    // Update the previewUrl of the tracks in searchResults
    const trackDetails = await getSpotifyTracks({
      accessToken: user?.accessToken,
      refreshToken: user?.refreshToken,
      ids: results.map((result) => result.id),
    });

    setSearchResults((prevResults) => {
      return prevResults.map((result) => {
        if (result.previewUrl) return result;
        const track = trackDetails.find((t) => t.id === result.id);
        return track ? { ...result, previewUrl: track.previewUrl } : result;
      });
    });
  };

  const handleLoadMore = async () => {
    if (!user?.accessToken || !user?.refreshToken || !searchQuery) return;
    setLoadingMore(true);
    try {
      const results: Track[] = await searchTracks({
        accessToken: user?.accessToken,
        refreshToken: user?.refreshToken,
        query: searchQuery,
        offset: searchResults.length,
      });

      const uniqueResults = results.filter((result) => {
        return !searchResults.some(
          (existingResult) => existingResult.id === result.id
        );
      });

      setSearchResults((prevResults) => [...prevResults, ...uniqueResults]);

      // Update the previewUrl of the tracks in searchResults
      const trackDetails = await getSpotifyTracks({
        accessToken: user?.accessToken,
        refreshToken: user?.refreshToken,
        ids: uniqueResults.map((result) => result.id),
      });

      setSearchResults((prevResults) => {
        return prevResults.map((result) => {
          if (result.previewUrl) return result;
          const track = trackDetails.find((t) => t.id === result.id);
          return track ? { ...result, previewUrl: track.previewUrl } : result;
        });
      });
    } catch (error) {
      console.error("Error loading more tracks", error);
    } finally {
      setTimeout(() => setLoadingMore(false), 2000);
    }
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
              handleClickMore={handleLoadMore}
              loading={loadingMore}
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
