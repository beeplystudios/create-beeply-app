export const dependencyVersionMap = {
  prisma: "^5.10.2",

  trpc: {
    "@tanstack/react-query": "^5.26.3",
    "@trpc/client": "11.0.0-next-beta.316",
    "@trpc/react-query": "11.0.0-next-beta.316",
    "@trpc/server": "11.0.0-next-beta.316",
  },

  lucia: {
    "@lucia-auth/adapter-prisma": "^4.0.1",
    lucia: "^3.1.1",
    radash: "^12.1.0",
    arctic: "^1.2.1",
  },

  typebox: {
    "@sinclair/typebox": "^0.32.15",
    "typebox-validators": "^0.3.5",
  },

  tailwind: {
    tailwindcss: "^3.4.1",
    postcss: "^8.4.35",
    autoprefixer: "^10.4.18",
  },

  superjson: "^2.2.1",
} as const;
