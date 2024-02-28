import { User } from "@/pages/api/user";
import { sql } from "@vercel/postgres";

export async function updateUser(userData: User & { spotifyUserId: string }) {
  const { spotifyUserId, name, imageUrl, accessToken, refreshToken } = userData;

  try {
    await sql`
      INSERT INTO users (spotify_user_id, access_token, refresh_token, name, image_url)
      VALUES ( ${spotifyUserId}, ${accessToken}, ${refreshToken}, ${name}, ${imageUrl})
      ON CONFLICT (spotify_user_id) DO UPDATE
      SET access_token = ${accessToken}, refresh_token = ${refreshToken}, name = ${name}, image_url = ${imageUrl};
    `;
    return { success: true };
  } catch (error) {
    console.error("Database query error", error);
    return {
      success: false,
      error: "Internal server error: failed to update user",
    };
  }
}