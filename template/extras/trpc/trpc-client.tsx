import { QueryClient } from "@tanstack/react-query";
import { TRPCClientError, loggerLink } from "@trpc/client";
import { httpBatchLink } from "@trpc/client";
import {
  createTRPCReact,
  createTRPCClient as _createTRPCClient,
  createTRPCQueryUtils as _createTRPCQueryUtils,
} from "@trpc/react-query";
import SuperJSON from "superjson";
import { type AppRouter } from "~server/routes/__root";

type Headers = Parameters<typeof httpBatchLink>[0]["headers"];

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          const noRetryCodes = [
            "BAD_REQUEST",
            "FORBIDDEN",
            "UNAUTHORIZED",
            "NOT_FOUND",
          ];

          if (
            error instanceof TRPCClientError &&
            "data" in error &&
            typeof error.data === "object" &&
            (noRetryCodes as unknown[]).includes(
              (error.data as { code: unknown }).code
            )
          ) {
            return false;
          }

          const MAX_RETRIES = 3;
          return failureCount <= MAX_RETRIES;
        },
        refetchOnMount: (query) => (query.state.data ? false : "always"),
      },
    },
  });

export const createLinks = (headers?: Headers) => {
  return () => [
    loggerLink({
      enabled: () => import.meta.env.DEV && typeof window !== "undefined",
    }),
    httpBatchLink({
      url: `${__APP_URL__}/api/trpc`,
      fetch: (url, options) =>
        fetch(url, { ...options, credentials: "include" }),
      headers,
      transformer: SuperJSON,
    }),
  ];
};

export const trpc = createTRPCReact<AppRouter>();

export const createTRPCClient = (
  links: ReturnType<typeof createLinks> = createLinks()
) => {
  return _createTRPCClient<AppRouter>({
    links: links(),
  });
};

export const createTRPCQueryUtils = (
  opts: Parameters<typeof _createTRPCQueryUtils<AppRouter>>[0]
) => {
  return _createTRPCQueryUtils<AppRouter>({
    queryClient: opts.queryClient,
    client: opts.client,
  });
};
