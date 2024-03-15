import { buildAppPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

export const routerContextTransformer: FileTransformer = {
  deps: (opts) => opts.shouldUseTRPC || opts.shouldSSR,
  transformer: ({ project, opts }) => {
    const contextFile = project.getSourceFileOrThrow(
      buildAppPath()("lib", "router-context.ts")
    );

    const routerContextInterface =
      contextFile.getInterfaceOrThrow("RouterContext");

    if (opts.shouldUseTRPC) {
      contextFile.addImportDeclarations([
        {
          moduleSpecifier: "@trpc/react-query/shared",
          namedImports: ["CreateQueryUtils"],
          isTypeOnly: true,
        },
        {
          moduleSpecifier: "~server/routes/__root",
          namedImports: ["AppRouter"],
          isTypeOnly: true,
        },
      ]);

      routerContextInterface.addProperty({
        name: "queryUtils",
        type: "CreateQueryUtils<AppRouter>",
      });
    }

    if (opts.shouldSSR) {
      contextFile.addImportDeclaration({
        moduleSpecifier: "@tanstack/react-router-server/client",
        namedImports: ["RouterManagedTag"],
        isTypeOnly: true,
      });

      routerContextInterface.addProperty({
        name: "assets",
        type: "RouterManagedTag[]",
      });
    }
  },
};
