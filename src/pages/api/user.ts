import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import { parse } from "cookie";

export interface User {
  name: string;
  imageUrl: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = parse(req.headers.cookie || "");
  const spotifyUserId = cookies.spotifyUserId;

  if (!spotifyUserId) {
    return res.status(403).json({ error: "Unauthorized Spotify User" });
  }
  
  try {
    const result = await sql`
      SELECT name, image_url, access_token, refresh_token FROM users WHERE spotify_user_id = ${spotifyUserId};
    `;

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    res.status(200).json({
      name: user.name,
      imageUrl: user.image_url,
      accessToken: user.access_token,
      refreshToken: user.refresh_token,
    });
  } catch (error) {
    console.error("Database query error", error);
    res
      .status(500)
      .json({ error: "Internal server error: failed to get user" });
  }
}
