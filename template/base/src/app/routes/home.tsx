import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { rootRoute } from "./__root";

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  meta: () => [{ title: "Home" }],
  component: lazyRouteComponent(
    () => import("src/app/features/home-view"),
    "HomeView"
  ),
});
