export const OPEN_SPOTIFY = `https://open.spotify.com/`;

export const SPOTIFY_API = {
  TOKEN: `https://accounts.spotify.com/api/token`,
  PROFILE: `https://api.spotify.com/v1/me`,
  SEARCH: `https://api.spotify.com/v1/search`,
  TRACKS: "https://api.spotify.com/v1/tracks",
};

export const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
export const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
export const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

export const SCOPES = ["user-read-private", "user-read-email"];
