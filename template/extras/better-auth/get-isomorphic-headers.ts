import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const isomorphicHeaders = createIsomorphicFn()
  .server(() => getRequestHeaders())
  .client(() => ({}));
