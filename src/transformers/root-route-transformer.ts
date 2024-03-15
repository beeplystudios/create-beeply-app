import { Writers } from "ts-morph";
import { buildAppPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

export const rootRouteTransformer: FileTransformer = {
  deps: (opts) => opts.shouldSSR,
  transformer: ({ project, opts }) => {
    const rootRouteFile = project.getSourceFileOrThrow(
      buildAppPath()("routes", "__root.tsx")
    );

    if (opts.shouldSSR) {
      rootRouteFile.addImportDeclaration({
        moduleSpecifier: "~app/lib/dev-style-inject",
        namedImports: ["devStyleInject"],
      });

      const rootRoute =
        rootRouteFile.getVariableDeclarationOrThrow("rootRoute");

      rootRoute.setInitializer((writer) => {
        const writeArgs = Writers.object({
          links: "devStyleInject",
          component: "RootRoute",
        });

        writer.write("createRootRouteWithContext<RouterContext>()(");
        writeArgs(writer);
        writer.write(")");
      });
    }
  },
};
