import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import { parse } from "cookie";

interface HistoryEntry {
  trackId: string;
  trackName: string;
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

  if (req.method === "POST") {
    // Add a new history entry
    const { trackId, trackName }: HistoryEntry = req.body;
    try {
      await sql`
        INSERT INTO history (spotify_user_id, track_id, track_name)
        VALUES (${spotifyUserId}, ${trackId}, ${trackName})
        ON CONFLICT (spotify_user_id, track_id)
        DO UPDATE SET clicked_at = NOW();
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
        SELECT track_id, track_name, clicked_at
        FROM history
        WHERE spotify_user_id = ${spotifyUserId}
        ORDER BY clicked_at DESC;
      `;
  
      const history = result.rows;
      res.status(200).json(history);
    } catch (error) {
      console.error("Failed to retrieve history", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
