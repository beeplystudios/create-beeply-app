import { Google } from "arctic";
import { Type } from "@sinclair/typebox";
import { Check } from "@sinclair/typebox/value";

export const googleAuth = new Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${__APP_URL__}/api/auth/sign-in/google/callback`
);
export const googleAuthScopes = ["openid", "email", "profile"];

const googleUserInfoResponseSchema = Type.Object({
  email: Type.String(),
  name: Type.String(),
  picture: Type.String(),
  id: Type.String(),
});

export const getGoogleUser = async (accessToken: string) => {
  const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status !== 200) throw new Error("failed to get google user");

  const data = await res.json();

  if (!Check(googleUserInfoResponseSchema, data))
    throw new Error("google user response does not fit schema");

  return data;
};
