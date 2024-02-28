import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { CLIENT_ID, SPOTIFY_API } from "../../lib/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { refreshToken } = req.body;
  console.log(" req.body", req.body);

  if (!refreshToken) {
    return res.status(400).json({ error: "Missing refresh token" });
  }

  if (!CLIENT_ID) {
    return res
      .status(500)
      .json({ error: "Missing environment variable for Spotify" });
  }

  try {
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
      }),
    };
    console.log("==== refresh payload", payload);
    const body = await fetch(SPOTIFY_API.TOKEN, payload);
    const response = await body.json();

    console.log("==== refresh response", response);

    // Extract the new access token from the response
    const { access_token, refresh_token } = response.data;
    res.status(200).json({
      accessToken: access_token,
      expiresIn: Date.now() + 60 * 60 * 1000,
      refreshToken: refresh_token,
    });
  } catch (error) {
    console.error("==== Error refreshing token", error);
    res.status(401).json({ error: "Failed to refresh token" });
  }
}
