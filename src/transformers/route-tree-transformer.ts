import { buildAppPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

export const routeTreeTransformer: FileTransformer = {
  deps: (opts) => opts.shouldUseAuth as boolean,
  transformer: ({ project, opts }) => {
    const routeTreeFile = project.getSourceFileOrThrow(
      buildAppPath()("routes", "route-tree.ts")
    );

    if (opts.shouldUseAuth) {
      routeTreeFile.addImportDeclaration({
        moduleSpecifier: "./sign-in",
        namedImports: ["signInRoute"],
      });

      const routeTree =
        routeTreeFile.getVariableDeclarationOrThrow("routeTree");

      routeTree.setInitializer(
        "rootRoute.addChildren([homeRoute, signInRoute])"
      );
    }
  },
};
