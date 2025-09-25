import { publicProcedure, router } from "../trpc-config";

export const appRouter = router({
  test: publicProcedure.query(async () => "Hi from the server!"),
});

// Export type router type signature,
// NOT the router itself.
export type TRPCRouter = typeof appRouter;
