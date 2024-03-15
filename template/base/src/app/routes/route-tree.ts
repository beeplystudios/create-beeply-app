import { rootRoute } from "./__root";
import { homeRoute } from "./home";

export const routeTree = rootRoute.addChildren([homeRoute]);
