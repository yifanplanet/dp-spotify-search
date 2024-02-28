import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import querystring from "querystring";
import { parse } from "cookie";
import { SPOTIFY_API } from "../../lib/constants";
import { updateUser } from "@/lib/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, state } = req.query;
  const cookies = parse(req.headers.cookie || "");
  const storedState = cookies.spotify_auth_state;

  if (state !== storedState) {
    return res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  }

  const authOptions = {
    url: SPOTIFY_API.TOKEN,
    method: "post",
    params: {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`
        ).toString("base64"),
    },
  };

  try {
    const response = await axios(authOptions);
    const { access_token, refresh_token } = response.data;

    if (!access_token || !refresh_token) {
      return res.redirect(
        "/#" +
          querystring.stringify({
            error: "invalid_token",
          })
      );
    }

    const userProfile = await axios.get(SPOTIFY_API.PROFILE, {
      headers: { Authorization: "Bearer " + access_token },
    });

    if (!userProfile.data.id) {
      return res.redirect(
        "/#" +
          querystring.stringify({
            error: "invalid_user",
          })
      );
    }

    const { id: spotifyUserId, display_name: name, images } = userProfile.data;

    res.setHeader(
      "Set-Cookie",
      `spotifyUserId=${spotifyUserId}; Path=/; HttpOnly; SameSite=Lax`
    );

    await updateUser({
      spotifyUserId,
      name,
      imageUrl: images[0]?.url,
      accessToken: access_token,
      refreshToken: refresh_token,
    });

    res.redirect(`/`);
  } catch (error) {
    console.error("Error authorization", error);
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "invalid_token",
        })
    );
  }
}
