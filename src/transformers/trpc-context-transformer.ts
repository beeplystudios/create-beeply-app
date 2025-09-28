import { SyntaxKind } from "ts-morph";
import { buildServerPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

export const trpcContextTransformer: FileTransformer = {
  deps: (opts) => opts.shouldUseTRPC,
  transformer: ({ project, opts }) => {
    const trpcFile = project.getSourceFileOrThrow(
      buildServerPath()("trpc", "trpc-context.ts")
    );

    if (opts.shouldUseDrizzle) {
      trpcFile.addImportDeclaration({
        moduleSpecifier: "@/server/db",
        namedImports: ["db"],
      });

      const contextFunc = trpcFile
        .getVariableDeclarationOrThrow("createContext")
        .getInitializerIfKindOrThrow(SyntaxKind.ArrowFunction);

      contextFunc
        .getBody()
        .getFirstDescendantByKindOrThrow(SyntaxKind.ReturnStatement)
        .getExpressionIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)
        .addShorthandPropertyAssignment({ name: "db" });
    }
  },
};
