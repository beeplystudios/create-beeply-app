import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { type Context as HonoContext } from "hono";

export const createTRPCContext = (ctx: HonoContext) => {};

const t = initTRPC
  .context<ReturnType<typeof createTRPCContext>>()
  .create({ transformer: SuperJSON });

export const publicProcedure = t.procedure;

export const router = t.router;

export const middleware = t.middleware;
