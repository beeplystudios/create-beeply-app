import { VariableDeclarationKind } from "ts-morph";
import { buildAppPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

export const trpcClientTransformer: FileTransformer = {
  deps: (opts) => opts.shouldUseTRPC && opts.shouldUseTanstackQuery,
  transformer: ({ project }) => {
    const contextFile = project.getSourceFileOrThrow(
      buildAppPath()("lib", "trpc-client.ts")
    );

    contextFile.addImportDeclarations([
      {
        moduleSpecifier: "@trpc/tanstack-react-query",
        namedImports: ["createTRPCContext"],
      },
    ]);

    contextFile.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [
        {
          name: "{ TRPCProvider, useTRPC, useTRPCClient }",
          initializer: "createTRPCContext<TRPCRouter>()",
        },
      ],
    });
  },
};
