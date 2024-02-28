import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import cookie from "cookie";
import { CLIENT_ID, TOKEN_ENDPOINT } from "../../lib/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Missing refresh token" });
  }

  if (!CLIENT_ID) {
    return res
      .status(500)
      .json({ error: "Missing environment variable for Spotify" });
  }

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
  });

  try {
    const response = await axios({
      method: "POST",
      url: TOKEN_ENDPOINT,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: params,
    });

    // Extract the new access token from the response
    const { access_token, expires_in, refresh_token } = response.data;
    res.status(200).json({
      accessToken: access_token,
      expiresIn: Date.now() + 60 * 60 * 1000,
      refreshToken: refresh_token,
    });
  } catch (error) {
    res.status(401).json({ error: "Failed to refresh token" });
  }
}
