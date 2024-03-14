import { rootRoute } from "./__root";
import { homeRoute } from "./home";
import { signInRoute } from "./sign-in";

export const routeTree = rootRoute.addChildren([homeRoute, signInRoute]);
