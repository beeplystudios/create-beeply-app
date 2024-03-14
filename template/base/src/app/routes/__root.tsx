import { createRootRouteWithContext } from "@tanstack/react-router";
import { RouterContext } from "src/app/lib/router-context";
import { RootRoute } from "~app/features/root-route";

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootRoute,
});
