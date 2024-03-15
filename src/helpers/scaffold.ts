import fs from "fs-extra";
import path from "path";
import { format } from "prettier";
import { IndentationText, Project, QuoteKind } from "ts-morph";
import { Options } from "../cli/get-opts.js";
import { PKG_ROOT } from "../consts.js";
import { addLuciaFiles } from "../installers/lucia.js";
import { addPrismaFiles } from "../installers/prisma.js";
import { addSSRFiles } from "../installers/ssr.js";
import { addTailwindFiles } from "../installers/tailwind.js";
import { addTRPCFiles } from "../installers/trpc.js";
import { createRouterTransformer } from "../transformers/create-router-transformer.js";
import { envTypeTransformer } from "../transformers/env-type-transformer.js";
import { honoHandlerTransformer } from "../transformers/hono-handler-transformer.js";
import { pkgJsonTransformer } from "../transformers/pkg-json-transformer.js";
import { rootRouteTransformer } from "../transformers/root-route-transformer.js";
import { routeTreeTransformer } from "../transformers/route-tree-transformer.js";
import { routerContextTransformer } from "../transformers/router-context-transformer.js";
import { serverEntryTransformer } from "../transformers/server-entry-transformer.js";
import { trpcContextTransformer } from "../transformers/trpc-context-transformer.js";
import { buildAndCommitEnv } from "./build-env.js";
import { buildProjectPath } from "./build-path.js";

const TRANSFORMERS = [
  createRouterTransformer,
  envTypeTransformer,
  honoHandlerTransformer,
  pkgJsonTransformer,
  rootRouteTransformer,
  routeTreeTransformer,
  routerContextTransformer,
  serverEntryTransformer,
  trpcContextTransformer,
];

export const scaffoldProject = async (opts: Options) => {
  globalThis.PROJECT_DIR = path.join(process.cwd(), opts.name);

  fs.copySync(path.join(PKG_ROOT, "template", "base"), PROJECT_DIR);

  const project = new Project({
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      quoteKind: QuoteKind.Double,
      useTrailingCommas: true,
    },
  });

  if (opts.shouldSSR) addSSRFiles();
  if (opts.shouldUseTailwind) addTailwindFiles();
  if (opts.shouldUsePrisma) addPrismaFiles();
  if (opts.shouldUseTRPC) addTRPCFiles();
  if (opts.shouldUseAuth) addLuciaFiles(opts.shouldUseTRPC);

  project.addSourceFilesFromTsConfig(
    path.join(buildProjectPath()("tsconfig.json"))
  );

  TRANSFORMERS.filter(({ deps }) => deps(opts)).forEach(({ transformer }) =>
    transformer({ project, opts })
  );

  await Promise.all(
    project
      .getSourceFiles()
      .filter((file) => !file.isSaved())
      .map((file) =>
        (async () => {
          const formattedText = await format(file.getText(), {
            parser: "typescript",
          });

          file.replaceWithText(formattedText);
        })()
      )
  );

  project.saveSync();

  buildAndCommitEnv(opts);
};
