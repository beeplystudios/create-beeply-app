import { SyntaxKind, VariableDeclarationKind, Writers } from "ts-morph";
import { buildAppPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

//   // return createRouter({
//   routeTree,
//   scrollRestoration: true,
//   defaultPreloadStaleTime: 0,
// })

export const createRouterTransformer: FileTransformer = {
  deps: () => true,
  transformer: ({ project, opts }) => {
    const routerFile = project.getSourceFileOrThrow(
      buildAppPath()("router.tsx")
    );

    const getRouterFunc = routerFile
      .getVariableDeclarationOrThrow("getRouter")
      .getInitializerIfKindOrThrow(SyntaxKind.ArrowFunction);

    const createRouterCall =
      getRouterFunc.getVariableDeclarationOrThrow("router");

    const routerArg = createRouterCall
      .getInitializerIfKindOrThrow(SyntaxKind.CallExpression)
      .getArguments()
      .at(0)!
      .asKindOrThrow(SyntaxKind.ObjectLiteralExpression);

    if (opts.shouldUseTanstackQuery) {
      routerFile.addImportDeclarations([
        {
          moduleSpecifier: "@tanstack/react-query",
          namedImports: ["QueryClient"],
        },
        {
          moduleSpecifier: "superjson",
          defaultImport: "superjson",
        },
        {
          moduleSpecifier: "@tanstack/react-router-ssr-query",
          namedImports: ["setupRouterSsrQueryIntegration"],
        },
      ]);

      getRouterFunc.insertVariableStatement(0, {
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
          {
            name: "queryClient",
            initializer: `
              new QueryClient({
                defaultOptions: {
                  dehydrate: { serializeData: superjson.serialize },
                  hydrate: { deserializeData: superjson.deserialize },
                  queries: {
                    refetchOnMount: false,
                  },
                },
              })
                
            `,
          },
        ],
      });

      getRouterFunc.addStatements(`
            setupRouterSsrQueryIntegration({
              router,
              queryClient,
            })

        `);

      routerArg.addPropertyAssignment({
        name: "context",
        initializer: "{ queryClient }",
      });
    }

    //   const routerFile = project.getSourceFileOrThrow(
    //     buildAppPath()("lib", "router.tsx")
    //   );

    //   const createRouterFunc = routerFile
    //     .getVariableDeclarationOrThrow("createRouter")
    //     .getInitializerIfKindOrThrow(SyntaxKind.ArrowFunction);

    //   if (opts.shouldUseTRPC) {
    //     routerFile.addImportDeclarations([
    //       {
    //         moduleSpecifier: "./trpc",
    //         namedImports: [
    //           "createLinks",
    //           "createQueryClient",
    //           "createTRPCClient",
    //           "createTRPCQueryUtils",
    //           "trpc",
    //         ],
    //       },
    //       {
    //         moduleSpecifier: "@tanstack/react-query",
    //         namedImports: ["QueryClientProvider"],
    //       },
    //     ]);

    //     createRouterFunc.getParameters()[0]?.remove();
    //     createRouterFunc.addParameter({
    //       name: "opts",
    //       type: "{ trpcLinks?: ReturnType<typeof createLinks> }",
    //     });

    //     createRouterFunc.addVariableStatements([
    //       {
    //         declarationKind: VariableDeclarationKind.Const,
    //         declarations: [
    //           {
    //             name: "queryClient",
    //             initializer: "createQueryClient()",
    //           },
    //         ],
    //       },
    //       {
    //         declarationKind: VariableDeclarationKind.Const,
    //         declarations: [
    //           {
    //             name: "trpcClient",
    //             initializer: "createTRPCClient(opts.trpcLinks)",
    //           },
    //         ],
    //       },
    //       {
    //         declarationKind: VariableDeclarationKind.Const,
    //         declarations: [
    //           {
    //             name: "reactClient",
    //             initializer:
    //               "trpc.createClient({ links: opts.trpcLinks ? opts.trpcLinks() : createLinks()() })",
    //           },
    //         ],
    //       },
    //     ]);

    //     createRouterArg.context = `
    //     {
    //       queryUtils: createTRPCQueryUtils({
    //         queryClient,
    //         client: trpcClient,
    //       }),
    //       ${opts.shouldSSR ? "assets: []," : ""}
    //     }
    //   `;

    //     createRouterArg.Wrap = `(props) => (
    //       <trpc.Provider queryClient={queryClient} client={reactClient}>
    //         <QueryClientProvider client={queryClient}>
    //           {props.children}
    //         </QueryClientProvider>
    //       </trpc.Provider>
    //     )
    //   `;

    //     if (opts.shouldSSR) {
    //       createRouterArg.dehydrate = `() => {
    //       return {
    //         queryClientState: dehydrate(queryClient)
    //       }
    //     }
    //     `;

    //       createRouterArg.hydrate = `(dehydratedState) => {
    //       hydrate(queryClient, dehydratedState.queryClientState)
    //     }
    //     `;
    //     }

    //     createRouterArg.defaultPreloadStaleTime = "0";
    //   }

    getRouterFunc.addStatements((writer) => {
      // const writeArg = Writers.object(createRouterArg);

      writer.newLineIfLastNot().write("return router;");
    });
  },
};
