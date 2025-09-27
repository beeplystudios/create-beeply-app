import { SyntaxKind, VariableDeclarationKind, Writers } from "ts-morph";
import { buildAppPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

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

    const routerContext = routerArg
      .getPropertyOrThrow("context")
      .asKindOrThrow(SyntaxKind.PropertyAssignment)
      .getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

    if (opts.shouldUseTRPC && opts.shouldUseTanstackQuery) {
      routerFile.addImportDeclarations([
        {
          moduleSpecifier: "@trpc/tanstack-react-query",
          namedImports: ["createTRPCOptionsProxy"],
        },
        {
          moduleSpecifier: "@/lib/trpc-client",
          namedImports: ["TRPCProvider"],
        },
      ]);

      getRouterFunc.insertVariableStatement(0, {
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
          {
            name: "serverHelpers",
            initializer:
              "createTRPCOptionsProxy({ client: trpcClient, queryClient })",
          },
        ],
      });

      routerContext.addPropertyAssignment({
        name: "trpc",
        initializer: "serverHelpers",
      });

      routerArg.addPropertyAssignment({
        name: "Wrap",
        initializer: `
        (props) => (
          <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
            {props.children}
          </TRPCProvider>
        )`,
      });
    }

    if (opts.shouldUseTRPC) {
      routerFile.addImportDeclaration({
        moduleSpecifier: "@/lib/trpc-client",
        namedImports: ["createTRPCClient"],
      });

      getRouterFunc.insertVariableStatement(0, {
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
          {
            name: "trpcClient",
            initializer: `
            createTRPCClient()

            `,
          },
        ],
      });

      routerContext.addShorthandPropertyAssignment({
        name: "trpcClient",
      });
    }

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

      getRouterFunc.insertVariableStatements(0, [
        {
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
        },
      ]);

      getRouterFunc.addStatements(`
            setupRouterSsrQueryIntegration({
              router,
              queryClient,
            })

        `);

      routerContext.addShorthandPropertyAssignment({
        name: "queryClient",
      });
    }

    getRouterFunc.addStatements((writer) => {
      writer.newLineIfLastNot().write("return router;");
    });
  },
};
