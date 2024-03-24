import ora from "ora";
import path from "path";
import { IndentationText, Project, QuoteKind } from "ts-morph";
import { Options } from "../cli/get-opts.js";
import { addLuciaFiles } from "../installers/lucia.js";
import { addPrismaFiles } from "../installers/prisma.js";
import { addSSRFiles } from "../installers/ssr.js";
import { addTailwindFiles } from "../installers/tailwind.js";
import { addTRPCFiles } from "../installers/trpc.js";
import { createRouterTransformer } from "../transformers/create-router-transformer.js";
import { envFileTransformer } from "../transformers/env-file-transformer.js";
import { envTypeTransformer } from "../transformers/env-type-transformer.js";
import { homeViewTransformer } from "../transformers/home-view-transformer.js";
import { honoHandlerTransformer } from "../transformers/hono-handler-transformer.js";
import { pkgJsonTransformer } from "../transformers/pkg-json-transformer.js";
import { prismaSchemaTransformer } from "../transformers/prisma-schema-transformer.js";
import { routeTreeTransformer } from "../transformers/route-tree-transformer.js";
import { routerContextTransformer } from "../transformers/router-context-transformer.js";
import { serverEntryTransformer } from "../transformers/server-entry-transformer.js";
import { trpcContextTransformer } from "../transformers/trpc-context-transformer.js";
import { buildProjectPath } from "./build-path.js";
import { createBaseTemplate } from "./create-base-template.js";
import { initializeGit } from "./init-git.js";
import { format } from "prettier";
import { logNextSteps } from "./log-next-steps.js";

const TRANSFORMERS = [
  createRouterTransformer,
  envTypeTransformer,
  honoHandlerTransformer,
  pkgJsonTransformer,
  routeTreeTransformer,
  routerContextTransformer,
  serverEntryTransformer,
  trpcContextTransformer,
  homeViewTransformer,
  prismaSchemaTransformer,
  envFileTransformer,
];

export const scaffoldProject = async (opts: Options) => {
  globalThis.PROJECT_DIR = path.join(process.cwd(), opts.name.path);

  await createBaseTemplate(PROJECT_DIR);

  const installerSpinner = ora("Installing selected packages").start();

  if (opts.shouldSSR) addSSRFiles();
  if (opts.shouldUseTailwind) addTailwindFiles();
  if (opts.shouldUsePrisma) addPrismaFiles();
  if (opts.shouldUseTRPC) addTRPCFiles();
  if (opts.shouldUseAuth) addLuciaFiles(opts.shouldUseTRPC);

  const project = new Project({
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      quoteKind: QuoteKind.Double,
      useTrailingCommas: true,
    },
  });

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

  installerSpinner.succeed("Installed selected packages");

  if (opts.shouldInitGit) {
    await initializeGit(PROJECT_DIR);
  }

  logNextSteps(opts);
};
