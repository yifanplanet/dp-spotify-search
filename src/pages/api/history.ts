import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import { parse } from "cookie";
import { Track } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = parse(req.headers.cookie || "");
  const spotifyUserId = cookies.spotifyUserId;

  if (!spotifyUserId) {
    return res.status(403).json({ error: "Unauthorized Spotify User" });
  }

  if (req.method === "POST") {
    // Add a new history entry
    const { id, name, imageUrl, artists, externalUrl, album }: Track = req.body;
    try {
      await sql`
        INSERT INTO history (spotify_user_id, track_id, track_name, artists, image_url, external_url, album)
        VALUES (${spotifyUserId}, ${id}, ${name}, ${artists}, ${imageUrl}, ${externalUrl}, ${album})
        ON CONFLICT (spotify_user_id, track_id)
        DO UPDATE SET track_name = ${name}, artists = ${artists}, image_url = ${imageUrl}, external_url = ${externalUrl}, album = ${album}, clicked_at = NOW();
        
      `;
      return res.status(200).json({ message: "History added successfully" });
    } catch (error) {
      console.error("Failed to add history", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "GET") {
    // Retrieve the user's search history
    try {
      const result = await sql`
        SELECT track_id, track_name, artists, image_url, external_url, album
        FROM history
        WHERE spotify_user_id = ${spotifyUserId}
        ORDER BY clicked_at DESC
        LIMIT 10;
      `;
      const history = result.rows;
      res.status(200).json(
        history.map((entry) => ({
          id: entry.track_id,
          name: entry.track_name,
          imageUrl: entry.image_url,
          artists: entry.artists,
          album: entry.album,
          externalUrl: entry.external_url,
        }))
      );
    } catch (error) {
      console.error("Failed to retrieve history", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
