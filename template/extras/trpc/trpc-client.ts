import type { TRPCRouter } from "@/server/trpc/routes";
import {
  createTRPCClient as _createTRPCClient,
  httpBatchStreamLink,
} from "@trpc/client";
import superjson from "superjson";

export const createTRPCClient = () =>
  _createTRPCClient<TRPCRouter>({
    links: [
      httpBatchStreamLink({
        transformer: superjson,
        url: `${process.env.BASE_URL ?? ""}/api/trpc`,
      }),
    ],
  });
