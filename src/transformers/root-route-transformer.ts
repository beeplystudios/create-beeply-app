import { SyntaxKind } from "ts-morph";
import { buildAppPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

export const rootRouteTransformer: FileTransformer = {
  deps: (opts) => opts.shouldUseTanstackQuery || opts.shouldUseTRPC,
  transformer: ({ project, opts }) => {
    const routeTreeFile = project.getSourceFileOrThrow(
      buildAppPath()("routes", "__root.tsx")
    );

    const routerContextType = routeTreeFile
      .getTypeAliasOrThrow("RouterContext")
      .getTypeNodeOrThrow()
      .asKindOrThrow(SyntaxKind.TypeLiteral);

    if (opts.shouldUseTanstackQuery) {
      routeTreeFile.addImportDeclaration({
        moduleSpecifier: "@tanstack/react-query",
        namedImports: ["QueryClient"],
        isTypeOnly: true,
      });

      routerContextType.addProperty({
        name: "queryClient",
        type: "QueryClient",
      });
    }

    if (opts.shouldUseTRPC) {
      routeTreeFile.addImportDeclarations([
        {
          moduleSpecifier: "@trpc/client",
          namedImports: ["TRPCClient"],
          isTypeOnly: true,
        },
        {
          moduleSpecifier: "@/server/trpc/routes",
          namedImports: ["TRPCRouter"],
          isTypeOnly: true,
        },
      ]);

      routerContextType.addProperty({
        name: "trpcClient",
        type: "TRPCClient<TRPCRouter>",
      });
    }

    if (opts.shouldUseTRPC && opts.shouldUseTanstackQuery) {
      routeTreeFile.addImportDeclaration({
        moduleSpecifier: "@trpc/tanstack-react-query",
        namedImports: ["TRPCOptionsProxy"],
        isTypeOnly: true,
      });

      routerContextType.addProperty({
        name: "trpc",
        type: "TRPCOptionsProxy<TRPCRouter>",
      });
    }
  },
};
