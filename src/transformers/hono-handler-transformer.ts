import { Writers } from "ts-morph";
import { buildServerPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

export const honoHandlerTransformer: FileTransformer = {
  deps: (opts) => opts.shouldUseTRPC || (opts.shouldUseAuth as boolean),
  transformer: ({ project, opts }) => {
    const honoFile = project.getSourceFileOrThrow(buildServerPath()("hono.ts"));

    if (opts.shouldUseTRPC) {
      honoFile.addImportDeclarations([
        {
          moduleSpecifier: "@trpc/server/adapters/fetch",
          namedImports: ["fetchRequestHandler"],
        },
        {
          moduleSpecifier: "./routes/__root",
          namedImports: ["appRouter"],
        },
        {
          moduleSpecifier: "./trpc",
          namedImports: ["createTRPCContext"],
        },
      ]);

      honoFile.addStatements((writer) => {
        const writeOptions = Writers.object({
          endpoint: `"/api/trpc"`,
          router: "appRouter",
          createContext: "() => createTRPCContext(ctx)",
          req: "ctx.req.raw",
        });

        writer
          .newLineIfLastNot()
          .writeLine(`hono.use("/trpc/*", (ctx) =>`)
          .write("fetchRequestHandler(");

        writeOptions(writer);
        writer.write(")").writeLine(");").blankLine();
      });
    }

    if (opts.shouldUseAuth) {
      honoFile.addImportDeclarations([
        {
          moduleSpecifier: "./auth/auth-routes",
          namedImports: ["authRouter"],
        },
      ]);

      honoFile.addStatements((writer) =>
        writer.newLineIfLastNot().write(`hono.route("/auth", authRouter);`)
      );
    }
  },
};
