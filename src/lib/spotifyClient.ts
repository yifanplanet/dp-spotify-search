import axios from "axios";
import { SPOTIFY_API } from "./constants";
import { SpotifyTrack } from "./spotify";
import { Track } from "./types";

export const searchTracks = async ({
  accessToken,
  refreshToken,
  query,
  offset = 0,
}: {
  accessToken: string;
  refreshToken: string;
  query: string;
  offset?: number;
}): Promise<Track[]> => {
  try {
    const { data } = await axios.get(
      `${SPOTIFY_API.SEARCH}?type=track&q=${encodeURIComponent(
        query
      )}&limit=20&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data.tracks.items.map((track: SpotifyTrack) => ({
      id: track.id,
      name: track.name,
      imageUrl: track.album.images[0].url,
      artists: track.artists.map((a) => a.name).join(", "),
      album: track.album.name,
      externalUrl: track.external_urls.spotify,
      previewUrl: track.preview_url,
    }));
  } catch (error) {
    await handleSpotifyError(error, refreshToken);
    throw error;
  }
};

export const getSpotifyTracks = async ({
  accessToken,
  refreshToken,
  ids,
}: {
  accessToken: string;
  refreshToken: string;
  ids: string[];
}): Promise<Track[]> => {
  try {
    const { data } = await axios.get(
      `${SPOTIFY_API.TRACKS}?ids=${ids.filter(Boolean).join(",")}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data.tracks.map((track: SpotifyTrack) => ({
      id: track.id,
      name: track.name,
      imageUrl: track.album.images[0].url,
      artists: track.artists.map((a) => a.name).join(", "),
      album: track.album.name,
      externalUrl: track.external_urls.spotify,
      previewUrl: track.preview_url,
    }));
  } catch (error) {
    await handleSpotifyError(error, refreshToken);
    throw error;
  }
};

const handleSpotifyError = async (error: any, refreshToken?: string) => {
  if (axios.isAxiosError(error)) {
    const responseError = error.response?.data;
    if (
      responseError &&
      responseError.error.status === 401 &&
      responseError.error.message === "The access token expired" &&
      refreshToken
    ) {
      // Token has expired, attempt to refresh it
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
        window.location.href = "/api/login";
      }
    }

    window.location.href = "/api/login";
  }
};
