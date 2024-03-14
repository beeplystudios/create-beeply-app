import { publicProcedure, router } from "../trpc";

export const appRouter = router({
  queryMe: publicProcedure.query(() => {
    return "Hello from your server!";
  }),
});

export type AppRouter = typeof appRouter;
