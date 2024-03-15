import { TRPCError } from "@trpc/server";
import type { Session, User } from "lucia";

import { middleware, publicProcedure } from "../trpc";
import { auth } from "./lucia";
import { getCookie } from "hono/cookie";
import { AUTH_COOKIE_NAME } from "~constants";

type ExtractAuthNewContext = {
  user: User | null;
  session: Session | null;
};

export const extractAuth = middleware(async (opts) => {
  const authCookie = getCookie(opts.ctx.honoCtx, AUTH_COOKIE_NAME);

  // in the case where multiple extractAuths are chained together,
  // don't fetch the user multiple times
  if ("user" in opts.ctx && "session" in opts.ctx) {
    return opts.next({
      ctx: {
        user: opts.ctx.user,
        session: opts.ctx.session,
      } as ExtractAuthNewContext,
    });
  }

  if (!authCookie)
    return opts.next({
      ctx: { user: null, session: null } as ExtractAuthNewContext,
    });

  const { session, user } = await auth.validateSession(authCookie);
  if (!session || !user) {
    await auth.invalidateSession(authCookie);
  }

  if (!session)
    return opts.next({
      ctx: { user: null, session: null } as ExtractAuthNewContext,
    });

  return opts.next({
    ctx: { user, session } as ExtractAuthNewContext,
  });
});

export const requireAuth = extractAuth.unstable_pipe((opts) => {
  const { ctx } = opts;
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return opts.next({
    ctx: { user: ctx.user, session: ctx.session },
  });
});

export const authedProcedure = publicProcedure.use(requireAuth);
