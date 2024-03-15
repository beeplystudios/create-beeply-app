import { createApp } from "vinxi";
import tsconfigPaths from "vite-tsconfig-paths";
import reactRefresh from "@vitejs/plugin-react";
import { Plugin } from "vite";

const defineConstants: () => Plugin = () => ({
  name: "define-consts",
  config: () => ({
    define: {
      __APP_URL__: JSON.stringify(process.env.APP_URL),
    },
  }),
});

export default createApp({
  server: {
    compressPublicAssets: {
      gzip: true,
    },
  },
  routers: [
    {
      name: "public",
      type: "static",
      dir: "./public",
    },
    {
      name: "client",
      type: "client",
      handler: "./src/app/client-entry.tsx",
      target: "browser",
      base: "/_build",
      plugins: () => [tsconfigPaths(), reactRefresh(), defineConstants()],
    },
    {
      name: "ssr",
      type: "http",
      handler: "./src/app/server-entry.tsx",
      plugins: () => [tsconfigPaths(), reactRefresh(), defineConstants()],
      target: "server",
    },
    {
      name: "api",
      type: "http",
      handler: "./src/server/handler.ts",
      target: "server",
      base: "/api",
      plugins: () => [tsconfigPaths(), defineConstants()],
    },
  ],
});
