export const dependencyVersionMap = {
  prisma: "^5.10.2",

  tanstackQuery: {
    "@tanstack/react-query": "^5.90.2",
    "@tanstack/react-router-ssr-query": "1.132.2",
  },

  trpc: {
    "@trpc/client": "^11.5.1",
    "@trpc/server": "^11.5.1",
  },

  trpcTanstackQuery: {
    "@trpc/tanstack-react-query": "^11.5.1",
  },

  drizzle: {
    "drizzle-orm": "^0.44.5",
    "@libsql/client": "^0.15.15",
  },

  drizzleDev: {
    "drizzle-kit": "^0.31.5",
  },

  superjson: "^2.2.1",
} as const;
