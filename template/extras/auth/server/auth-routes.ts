import {
  generateCodeVerifier,
  generateState,
  OAuth2RequestError,
} from "arctic";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { capitalize, pick } from "radash";

import { AUTH_COOKIE_NAME } from "~constants";
import { prisma } from "../db";
import { getGoogleUser, googleAuth, googleAuthScopes } from "./google";
import { auth } from "./lucia";

// utility function to get a session or invalidate it if it is invalid
const getOrInvalidateSession = async (authCookie: string) => {
  const { session, user } = await auth.validateSession(authCookie);

  if (!session || !user) {
    await auth.invalidateSession(authCookie);
    return null;
  }

  return { session, user };
};

const capitalizeSameSite = (
  attribute: "lax" | "strict" | "none" | boolean | undefined
): "Lax" | "Strict" | "None" | undefined => {
  if (!attribute) return undefined;
  if (typeof attribute === "boolean")
    return capitalizeSameSite(attribute ? "lax" : "none");

  return capitalize(attribute) as "Lax" | "Strict" | "None";
};

export const authRouter = new Hono();

authRouter.get("/user", async (ctx) => {
  const authCookie = getCookie(ctx, AUTH_COOKIE_NAME);
  if (!authCookie) return ctx.json(null);

  const results = await getOrInvalidateSession(authCookie);

  if (!results) {
    // if the session does not exist but there is a cookie,
    // invalidate the cookie
    if (authCookie) {
      setCookie(ctx, AUTH_COOKIE_NAME, "", {
        path: "/",
        maxAge: 0,
        sameSite: "Lax",
      });
    }
    return ctx.json(null);
  }

  return ctx.json(
    results.user,
    200,
    // if the session token is newly created, set the cookie
    results.session.fresh
      ? {
          "Set-Cookie": auth
            .createSessionCookie(results.session.id)
            .serialize(),
        }
      : undefined
  );
});

authRouter.get("/sign-in/google", async (ctx) => {
  const authCookie = getCookie(ctx, AUTH_COOKIE_NAME);
  const errorCallback = ctx.req.query("error-callback");

  // if the user is already logged in, return an error
  if (authCookie) {
    const session = await getOrInvalidateSession(authCookie);
    if (session) {
      return ctx.redirect(
        `${errorCallback ?? `${__APP_URL__}/sign-in`}?error=already_logged_in`
      );
    }
  }

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = await googleAuth.createAuthorizationURL(state, codeVerifier, {
    scopes: googleAuthScopes,
  });

  const AUTH_STATE_COOKIE_MIXIN = {
    maxAge: 60 * 60,
    path: "/",
  };
  // forward the query params to the callback via cookies
  const tokenQuery = ctx.req.query("token");
  if (tokenQuery && tokenQuery !== "")
    setCookie(ctx, "token", tokenQuery, AUTH_STATE_COOKIE_MIXIN);

  if (errorCallback && errorCallback !== "")
    setCookie(ctx, "error-callback", errorCallback, AUTH_STATE_COOKIE_MIXIN);

  setCookie(
    ctx,
    "redirect",
    ctx.req.query("redirect") || __APP_URL__,
    AUTH_STATE_COOKIE_MIXIN
  );

  setCookie(ctx, "google-oauth-state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    ...AUTH_STATE_COOKIE_MIXIN,
  });

  setCookie(ctx, "code-verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    ...AUTH_STATE_COOKIE_MIXIN,
  });

  return ctx.redirect(url.toString());
});

authRouter.get("/sign-in/google/callback", async (ctx) => {
  const cookies = pick(getCookie(ctx), [
    "google-oauth-state",
    "error-callback",
    "redirect",
    "code-verifier",
  ]);

  const stateQueryParam = ctx.req.query("state");
  const codeQueryParam = ctx.req.query("code");
  const errorCallbackUrl =
    cookies["error-callback"] ?? `${__APP_URL__}/sign-in`;

  // clean up auth state, do not use these cookies after this
  const DELETE_COOKIE = {
    path: "/",
    maxAge: 0,
  };

  Object.keys(cookies).forEach((key) => setCookie(ctx, key, "", DELETE_COOKIE));

  // makes sure that the required params exist and
  // that the oauth flow matches the one started
  if (
    !cookies["google-oauth-state"] ||
    !stateQueryParam ||
    !codeQueryParam ||
    !cookies["code-verifier"] ||
    cookies["google-oauth-state"] !== stateQueryParam
  )
    return ctx.redirect(`${errorCallbackUrl}?error=invalid_state`);

  try {
    const tokens = await googleAuth.validateAuthorizationCode(
      codeQueryParam,
      cookies["code-verifier"]
    );

    const googleUser = await getGoogleUser(tokens.accessToken);

    const existingUser = await prisma.oAuthAccount.findUnique({
      where: {
        providerName_providerUserId: {
          providerName: "google",
          providerUserId: googleUser.id,
        },
      },
    });

    const user =
      existingUser ??
      (await prisma.oAuthAccount.create({
        data: {
          providerName: "google",
          providerUserId: googleUser.id,
          user: {
            create: {
              name: googleUser.name,
              email: googleUser.email,
              image: googleUser.picture,
            },
          },
        },
      }));

    await auth.deleteExpiredSessions();

    const session = await auth.createSession(user.userId, {});

    const sessionCookie = auth.createSessionCookie(session.id);
    setCookie(ctx, AUTH_COOKIE_NAME, sessionCookie.value, {
      ...sessionCookie.attributes,
      sameSite: capitalizeSameSite(sessionCookie.attributes.sameSite),
    });

    return ctx.redirect(
      cookies.redirect ?? process.env.VITE_PUBLIC___APP_URL__
    );
  } catch (e) {
    // the oauth callback token provided is invalid
    if (e instanceof OAuth2RequestError) {
      return ctx.redirect(`${errorCallbackUrl}?error=invalid_code`);
    }

    console.error("Error during sign in: ", e);
    return ctx.redirect(`${errorCallbackUrl}?error=unknown`);
  }
});

authRouter.delete("/sign-out", async (ctx) => {
  const authCookie = getCookie(ctx, AUTH_COOKIE_NAME);
  if (!authCookie) return ctx.json(null, 401);

  await auth.invalidateSession(authCookie);
  deleteCookie(ctx, AUTH_COOKIE_NAME);

  return ctx.json(null);
});
