import { SyntaxKind } from "ts-morph";
import { buildAppPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

export const rootRouteTransformer: FileTransformer = {
  deps: (opts) => opts.shouldUseTanstackQuery,
  transformer: ({ project, opts }) => {
    console.log("RUNNING ROUTE TREE FILE TRANSFORMER");
    const routeTreeFile = project.getSourceFileOrThrow(
      buildAppPath()("routes", "__root.tsx")
    );

    routeTreeFile.addImportDeclaration({
      moduleSpecifier: "@tanstack/react-query",
      namedImports: ["QueryClient"],
      isTypeOnly: true,
    });

    const routerContextType =
      routeTreeFile.getTypeAliasOrThrow("RouterContext");

    routerContextType
      .getTypeNodeOrThrow()
      .asKindOrThrow(SyntaxKind.TypeLiteral)
      .addProperty({
        name: "queryClient",
        type: "QueryClient",
      });
  },
};
