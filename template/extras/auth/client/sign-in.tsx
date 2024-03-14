import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { rootRoute } from "./__root";
import { Type } from "@sinclair/typebox";
import { StandardValidator } from "typebox-validators/standard";

const searchParamSchema = Type.Object({
  callback: Type.Optional(Type.String()),
  error: Type.Optional(Type.String()),
  token: Type.Optional(Type.String()),
});

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  validateSearch: (search) =>
    new StandardValidator(searchParamSchema).validateAndCleanCopy(search),
  component: lazyRouteComponent(
    () => import("../features/sign-in-view"),
    "SignInView"
  ),
});
