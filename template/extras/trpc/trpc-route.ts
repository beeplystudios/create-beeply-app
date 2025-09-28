import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/trpc/routes";
import { createContext } from "@/server/trpc/trpc-context";
import { createFileRoute } from "@tanstack/react-router";

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: appRouter,
    createContext: () => createContext(request),
    endpoint: "/api/trpc",
  });
}

export const Route = createFileRoute("/api/trpc/$")({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
});
