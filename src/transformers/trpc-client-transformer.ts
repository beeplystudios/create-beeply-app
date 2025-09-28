import { SyntaxKind, VariableDeclarationKind } from "ts-morph";
import { buildAppPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

export const trpcClientTransformer: FileTransformer = {
  deps: (opts) =>
    (opts.shouldUseTRPC && opts.shouldUseTanstackQuery) ||
    (opts.shouldUseAuth as boolean),
  transformer: ({ project, opts }) => {
    const clientFile = project.getSourceFileOrThrow(
      buildAppPath()("lib", "trpc-client.ts")
    );

    if (opts.shouldUseTRPC && opts.shouldUseTanstackQuery) {
      clientFile.addImportDeclarations([
        {
          moduleSpecifier: "@trpc/tanstack-react-query",
          namedImports: ["createTRPCContext"],
        },
      ]);

      clientFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [
          {
            name: "{ TRPCProvider, useTRPC, useTRPCClient }",
            initializer: "createTRPCContext<TRPCRouter>()",
          },
        ],
      });
    }

    if (opts.shouldUseAuth) {
      clientFile.addImportDeclaration({
        moduleSpecifier: "@/lib/get-isomorphic-headers.ts",
        namedImports: ["isomorphicHeaders"],
      });

      clientFile
        .getVariableDeclarationOrThrow("createTRPCClient")
        .getInitializerIfKindOrThrow(SyntaxKind.ArrowFunction)
        .getBody()
        .getFirstDescendantByKindOrThrow(SyntaxKind.CallExpression)
        .getArguments()
        .at(0)!
        .asKindOrThrow(SyntaxKind.ObjectLiteralExpression)
        .addPropertyAssignment({
          name: "headers",
          initializer: "async () => isomorphicHeaders()",
        });
    }
  },
};
