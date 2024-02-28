import axios from "axios";
import { SPOTIFY_API } from "./constants";
import { SpotifyTrack } from "./spotify";

export const searchTracks = async ({
  accessToken,
  refreshToken,
  query,
}: {
  accessToken: string;
  refreshToken: string;
  query: string;
}) => {
  try {
    const { data } = await axios.get(
      `${SPOTIFY_API.SEARCH}?type=track&q=${encodeURIComponent(query)}`,
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
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseError = error.response?.data;
      if (
        responseError &&
        responseError.error.status === 401 &&
        responseError.error.message === "The access token expired" &&
        refreshToken
      ) {
        // Token has expired, attempt to login
        window.location.href = "/api/login";
        // Token has expired, attempt to refresh it
        await fetch("/api/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });
      }

      window.location.href = "/api/login";
    }
    throw error;
  }
};
