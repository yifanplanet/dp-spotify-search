import { NextApiRequest, NextApiResponse } from "next";
import { generateRandomString } from "../../lib/spotifyAuth";
import { serialize } from 'cookie';

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
const SCOPES = ["user-read-private", "user-read-email"];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!CLIENT_ID || !REDIRECT_URI) {
    throw new Error("Missing environment variables for Spotify");
  }

  const state = generateRandomString(16);

  // Store the state parameter in a cookie
  res.setHeader(
    "Set-Cookie",
    serialize("spotify_auth_state", state, { path: "/" })
  );

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("response_type", "code");
  params.append("scope", SCOPES.join(" "));
  params.append("redirect_uri", REDIRECT_URI);
  params.append("state", state);

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
