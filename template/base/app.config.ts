import { createApp } from "vinxi";
import tsconfigPaths from "vite-tsconfig-paths";
import reactRefresh from "@vitejs/plugin-react";
import { Plugin } from "vite";

const defineConstants: () => Plugin = () => ({
  name: "define-consts",
  config: () => ({
    define: {
      __APP_URL__: JSON.stringify(
        process.env.APP_URL ?? "http://localhost:3000"
      ),
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
      base: "/",
    },
    {
      name: "client",
      type: "spa",
      handler: "index.html",
      target: "browser",
      plugins: () => [tsconfigPaths(), reactRefresh(), defineConstants()],
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
