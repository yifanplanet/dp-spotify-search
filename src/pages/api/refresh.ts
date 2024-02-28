import { NextApiRequest, NextApiResponse } from "next";
import { CLIENT_ID, CLIENT_SECRET, SPOTIFY_API } from "../../lib/constants";
import axios from "axios";
import { updateUser } from "@/lib/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const refreshToken = req.query.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ error: "Missing refresh token" });
  }

  if (!CLIENT_ID) {
    return res
      .status(500)
      .json({ error: "Missing environment variable for Spotify" });
  }

  try {
    var authOptions = {
      method: "POST",
      url: SPOTIFY_API.TOKEN,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      },
      params: {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      },
    };
    const response = await axios(authOptions);
    if (!response?.data?.access_token)
      return res.status(401).json({ error: "Failed to refresh token" });

    const { access_token } = response.data;

    const userProfile = await axios.get(SPOTIFY_API.PROFILE, {
      headers: { Authorization: "Bearer " + access_token },
    });
    if (!userProfile.data.id) {
      return res.status(401).json({ error: "Invalid user" });
    }

    const { id: spotifyUserId, display_name: name, images } = userProfile.data;

    await updateUser({
      spotifyUserId,
      name,
      imageUrl: images[0]?.url,
      accessToken: access_token,
      refreshToken,
    });

    res.status(200).json({
      accessToken: access_token,
      expiresIn: Date.now() + 60 * 60 * 1000,
    });
  } catch (error) {
    res.status(401).json({ error: "Failed to refresh token" });
  }
}
