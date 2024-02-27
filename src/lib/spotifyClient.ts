import axios from "axios";

export const searchTracks = async (token: string, query: string) => {
  const { data } = await axios.get(
    `https://api.spotify.com/v1/search?type=track&q=${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data.tracks.items;
};
