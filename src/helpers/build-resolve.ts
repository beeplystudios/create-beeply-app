import {
  IndentationText,
  Project,
  SyntaxKind,
  VariableDeclarationKind,
  ts,
} from "ts-morph";
import { Options } from "../cli/get-opts.js";
import { buildAppPath, buildServerPath } from "./build-path.js";

export const integrateResolvingConflicts = (
  project: Project,
  opts: Options
) => {
  if (opts.shouldUseTRPC) {
    addRouterTRPCProvider(project);
    addHonoTRPCHandler(project);
    addRouterTRPCContext(project);
    buildTRPCContext(project, opts.shouldUsePrisma);
  }

  if (opts.shouldUseAuth) {
    addHonoAuthHandler(project);
  }
};

const addRouterTRPCProvider = (project: Project) => {
  const routerFile = project.getSourceFileOrThrow(
    buildAppPath()("lib", "router.tsx")
  );

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
      namedImports: ["QueryClientProvider"],
    },
  ]);

  const createRouterFunc = routerFile
    .getVariableDeclarationOrThrow("createRouter")
    .getInitializerIfKindOrThrow(SyntaxKind.ArrowFunction);

  createRouterFunc.addParameter({
    name: "opts",
    type: "{ trpcLinks?: ReturnType<typeof createLinks> }",
    initializer: "{}",
  });

  

  createRouterFunc.setBodyText(
    `
const queryClient = createQueryClient();
const trpcClient = createTRPCClient(opts.trpcLinks);

const reactClient = trpc.createClient({
links: opts.trpcLinks ? opts.trpcLinks() : createLinks()(),
});

return _createRouter({
routeTree,
context: {
    queryUtils: createTRPCQueryUtils({
    queryClient,
    client: trpcClient,
    }),
},
Wrap: (props) => (
    <trpc.Provider queryClient={queryClient} client={reactClient}>
    <QueryClientProvider client={queryClient}>
        {props.children}
    </QueryClientProvider>
    </trpc.Provider>
),
defaultNotFoundComponent: () => <div>That page was not found!</div>,
defaultPreloadStaleTime: 0,
});
`.trim()
  );

  routerFile.formatText({
    trimTrailingWhitespace: true,
  });
};

const addRouterTRPCContext = (project: Project) => {
  const contextFile = project.getSourceFileOrThrow(
    buildAppPath()("lib", "router-context.ts")
  );

  contextFile.addImportDeclarations([
    {
      moduleSpecifier: "@trpc/react-query/shared",
      namedImports: ["CreateQueryUtils"],
      isTypeOnly: true,
    },
    {
      moduleSpecifier: "~server/routes/__root",
      namedImports: ["AppRouter"],
      isTypeOnly: true,
    },
  ]);

  contextFile.getInterfaceOrThrow("RouterContext").addProperty({
    name: "queryUtils",
    type: "CreateQueryUtils<AppRouter>",
  });
};

const addHonoTRPCHandler = (project: Project) => {
  const honoFile = project.getSourceFileOrThrow(buildServerPath()("hono.ts"));

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

  honoFile.addStatements(`
hono.use("/trpc/*", (ctx) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext: () => createTRPCContext(ctx),
    req: ctx.req.raw,
  })
);
  `);
};

const addHonoAuthHandler = (project: Project) => {
  const honoFile = project.getSourceFileOrThrow(buildServerPath()("hono.ts"));

  honoFile.addImportDeclarations([
    {
      moduleSpecifier: "./auth/auth-routes",
      namedImports: ["authRouter"],
    },
  ]);

  honoFile.addStatements(`hono.route("/auth", authRouter);`);
};

const buildTRPCContext = (project: Project, includePrisma: boolean) => {
  const trpcFile = project.getSourceFileOrThrow(buildServerPath()("trpc.ts"));

  if (includePrisma) {
    trpcFile.addImportDeclaration({
      moduleSpecifier: "./db",
      namedImports: ["prisma"],
    });
  }

  const contextFunc = trpcFile
    .getVariableDeclarationOrThrow("createTRPCContext")
    .getInitializerIfKindOrThrow(SyntaxKind.ArrowFunction);

  contextFunc.setBodyText((writer) => {
    writer.write("return {").indent();

    if (!includePrisma) {
      writer.write("honoCtx: ctx");
    } else {
      writer.writeLine("honoCtx: ctx,").writeLine("prisma");
    }

    writer.writeLine("};");
  });

  contextFunc.formatText();
};
