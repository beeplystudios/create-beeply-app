import { Options } from "../cli/get-opts.js";
import { createRouterTransformer } from "../transformers/create-router-transformer.js";
import { envTypeTransformer } from "../transformers/env-type-transformer.js";
import { honoHandlerTransformer } from "../transformers/hono-handler-transformer.js";
import { pkgJsonTransformer } from "../transformers/pkg-json-transformer.js";
import { rootRouteTransformer } from "../transformers/root-route-transformer.js";
import { routeTreeTransformer } from "../transformers/route-tree-transformer.js";
import { routerContextTransformer } from "../transformers/router-context-transformer.js";
import { serverEntryTransformer } from "../transformers/server-entry-transformer.js";
import { FileTransformer } from "../transformers/transformer-type.js";
import { trpcContextTransformer } from "../transformers/trpc-context-transformer.js";

export const buildTransformers = (opts: Options) => {
  const transformers: FileTransformer[] = [
    pkgJsonTransformer,
    createRouterTransformer,
  ];

  if (opts.shouldUseTRPC || opts.shouldUseAuth)
    transformers.push(honoHandlerTransformer);

  if (opts.shouldUseTRPC || opts.shouldSSR)
    transformers.push(routerContextTransformer);
  if (opts.shouldUseTRPC) transformers.push(trpcContextTransformer);

  if (opts.shouldUseAuth)
    transformers.push(envTypeTransformer, routeTreeTransformer);

  if (opts.shouldSSR) {
    transformers.push(rootRouteTransformer);

    if (opts.shouldUseAuth && opts.shouldUseTRPC)
      transformers.push(serverEntryTransformer);
  }

  return transformers;
};
