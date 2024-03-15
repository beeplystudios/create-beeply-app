import { SyntaxKind, Writers } from "ts-morph";
import { buildAppPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

export const serverEntryTransformer: FileTransformer = {
  deps: (opts) =>
    opts.shouldSSR && opts.shouldUseTRPC && (opts.shouldUseAuth as boolean),
  transformer: ({ project, opts }) => {
    const serverEntryFile = project.getSourceFileOrThrow(
      buildAppPath()("server-entry.tsx")
    );

    if (opts.shouldUseAuth && opts.shouldUseTRPC) {
      serverEntryFile.addImportDeclarations([
        {
          moduleSpecifier: "~constants",
          namedImports: ["AUTH_COOKIE_NAME"],
        },
        {
          moduleSpecifier: "./lib/trpc",
          namedImports: ["createLinks"],
        },
        {
          moduleSpecifier: "vinxi/http",
          namedImports: ["getCookie"],
        },
      ]);

      const routerVar = serverEntryFile
        .getVariableDeclarationOrThrow("render")
        .getInitializerIfKindOrThrow(SyntaxKind.ArrowFunction)
        .getVariableDeclarationOrThrow("router");

      routerVar.setInitializer((writer) => {
        const writeArgs = Writers.object({
          trpcLinks: `createLinks(() => {
                const authCookie = getCookie(event, AUTH_COOKIE_NAME);

                return {
                    cookie: \`\${AUTH_COOKIE_NAME}=\${authCookie ?? ""}\`
                }
            })`,
        });

        writer.write(`createRouter(`);
        writeArgs(writer);
        writer.write(`)`);
      });
    }

    serverEntryFile.organizeImports();
  },
};
