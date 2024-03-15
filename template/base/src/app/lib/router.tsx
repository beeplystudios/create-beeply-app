import { createRouter as _createRouter } from "@tanstack/react-router";
import { routeTree } from "~app/routes/route-tree";

export const createRouter = (_: Record<string, never>) => {};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
