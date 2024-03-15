import { SyntaxKind, VariableDeclarationKind, Writers } from "ts-morph";
import { buildAppPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

export const createRouterTransformer: FileTransformer = {
  deps: () => true,
  transformer: ({ project, opts }) => {
    const routerFile = project.getSourceFileOrThrow(
      buildAppPath()("lib", "router.tsx")
    );

    const createRouterFunc = routerFile
      .getVariableDeclarationOrThrow("createRouter")
      .getInitializerIfKindOrThrow(SyntaxKind.ArrowFunction);

    let createRouterArg: Record<string, string> = {
      routeTree: "routeTree",
      context: `${opts.shouldSSR ? "{ assets: [] }" : "{}"}`,
    };

    if (opts.shouldUseTRPC) {
      routerFile.addImportDeclarations([
        {
          moduleSpecifier: "./trpc",
          namedImports: [
            "createLinks",
            "createQueryClient",
            "createTRPCClient",
            "createTRPCQueryUtils",
            "trpc",
          ],
        },
        {
          moduleSpecifier: "@tanstack/react-query",
          namedImports: [
            "QueryClientProvider",
            ...(opts.shouldSSR ? ["dehydrate", "hydrate"] : []),
          ],
        },
      ]);

      createRouterFunc.getParameters()[0]?.remove();
      createRouterFunc.addParameter({
        name: "opts",
        type: "{ trpcLinks?: ReturnType<typeof createLinks> }",
      });

      createRouterFunc.addVariableStatements([
        {
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            {
              name: "queryClient",
              initializer: "createQueryClient()",
            },
          ],
        },
        {
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            {
              name: "trpcClient",
              initializer: "createTRPCClient(opts.trpcLinks)",
            },
          ],
        },
        {
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            {
              name: "reactClient",
              initializer:
                "trpc.createClient({ links: opts.trpcLinks ? opts.trpcLinks() : createLinks()() })",
            },
          ],
        },
      ]);

      createRouterArg.context = ` 
      {  
        queryUtils: createTRPCQueryUtils({
          queryClient,
          client: trpcClient,
        }),
        ${opts.shouldSSR ? "assets: []," : ""}
      }
    `;

      createRouterArg.Wrap = `(props) => (
        <trpc.Provider queryClient={queryClient} client={reactClient}>
          <QueryClientProvider client={queryClient}>
            {props.children}
          </QueryClientProvider>
        </trpc.Provider>
      )
    `;

      if (opts.shouldSSR) {
        createRouterArg.dehydrate = `() => {
        return {
          queryClientState: dehydrate(queryClient)
        }
      }
      `;

        createRouterArg.hydrate = `(dehydratedState) => {
        hydrate(queryClient, dehydratedState.queryClientState)
      }
      `;
      }

      createRouterArg.defaultPreloadStaleTime = "0";
    }

    createRouterFunc.addStatements((writer) => {
      const writeArg = Writers.object(createRouterArg);

      writer.newLineIfLastNot().write("return _createRouter(");
      writeArg(writer);
      writer.write(");").newLine();
    });
  },
};
