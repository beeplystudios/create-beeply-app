import { SyntaxKind, Writers } from "ts-morph";
import { buildServerPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

export const trpcContextTransformer: FileTransformer = {
  deps: (opts) => opts.shouldUseTRPC,
  transformer: ({ project, opts }) => {
    const trpcFile = project.getSourceFileOrThrow(buildServerPath()("trpc.ts"));

    if (opts.shouldUsePrisma) {
      trpcFile.addImportDeclaration({
        moduleSpecifier: "./db",
        namedImports: ["prisma"],
      });
    }

    const contextFunc = trpcFile
      .getVariableDeclarationOrThrow("createTRPCContext")
      .getInitializerIfKindOrThrow(SyntaxKind.ArrowFunction);

    contextFunc.setBodyText((writer) => {
      const writeReturnStatement = Writers.object({
        honoCtx: "ctx",
        ...(opts.shouldUsePrisma ? { prisma: "prisma" } : {}),
      });

      Writers.returnStatement(writeReturnStatement)(writer);
    });

    contextFunc.formatText();
  },
};
