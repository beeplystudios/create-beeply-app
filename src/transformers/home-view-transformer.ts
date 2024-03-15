import { SyntaxKind, Writers, ts } from "ts-morph";
import { buildAppPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

export const homeViewTransformer: FileTransformer = {
  deps: () => true,
  transformer: ({ project, opts }) => {
    const homeViewFile = project.getSourceFileOrThrow(
      buildAppPath()("features", "home-view.tsx")
    );

    const stack = homeViewFile
      .getVariableDeclarationOrThrow("stack")
      .getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);

    if (opts.shouldUseTailwind) {
      const writeTw = Writers.object({
        name: `"Tailwind CSS"`,
        url: `"https://tailwindcss.com"`,
        textColor: `"text-cyan-500"`,
        description: `"A utility-first CSS framework for rapid UI development"`,
      });

      stack.addElement(writeTw);
    }

    if (opts.shouldUsePrisma) {
      const writePrisma = Writers.object({
        name: `"Prisma"`,
        url: `"https://prisma.io"`,
        textColor: `"text-indigo-500"`,
        description: `"Next-generation Node.js and TypeScript ORM"`,
      });

      stack.addElement(writePrisma);
    }

    if (opts.shouldUseTRPC) {
      const writeTRPC = Writers.object({
        name: `"tRPC"`,
        url: `"https://trpc.io"`,
        textColor: `"text-blue-500"`,
        description: `"End-to-end typesafe APIs made easy"`,
      });

      stack.addElement(writeTRPC);
    }

    if (opts.shouldUseAuth) {
      const writeAuth = Writers.object({
        name: `"Lucia"`,
        url: `"https://lucia-auth.com"`,
        textColor: `"text-orange-500"`,
        description: `"Server-side auth library"`,
      });

      stack.addElement(writeAuth);
    }
  },
};
