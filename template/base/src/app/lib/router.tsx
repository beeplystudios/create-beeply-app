import { createRouter as _createRouter } from "@tanstack/react-router";
import { routeTree } from "~app/routes/route-tree";

export const createRouter = () => {
  return _createRouter({
    routeTree,
    defaultNotFoundComponent: () => <div>That page was not found!</div>,
  });
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
