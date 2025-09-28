import ora from "ora";
import path from "path";
import { format } from "prettier";
import { IndentationText, Project, QuoteKind } from "ts-morph";
import { Options } from "../cli/get-opts.js";
import { addBetterAuthFiles } from "../installers/better-auth.js";
import { addDrizzleFiles } from "../installers/drizzle.js";
import { addTRPCFiles } from "../installers/trpc.js";
import { authClientTransformer } from "../transformers/auth-client-transformer.js";
import { createRouterTransformer } from "../transformers/create-router-transformer.js";
import { drizzleSchemaTransformer } from "../transformers/drizzle-schema-transformer.js";
import { envFileTransformer } from "../transformers/env-file-transformer.js";
import { pkgJsonTransformer } from "../transformers/pkg-json-transformer.js";
import { rootRouteTransformer } from "../transformers/root-route-transformer.js";
import { FileTransformer } from "../transformers/transformer-type.js";
import { trpcClientTransformer } from "../transformers/trpc-client-transformer.js";
import { trpcContextTransformer } from "../transformers/trpc-context-transformer.js";
import { buildProjectPath } from "./build-path.js";
import { createBaseTemplate } from "./create-base-template.js";
import { initializeGit } from "./init-git.js";
import { logNextSteps } from "./log-next-steps.js";

const TRANSFORMERS: FileTransformer[] = [
  createRouterTransformer,
  rootRouteTransformer,
  pkgJsonTransformer,
  trpcClientTransformer,
  trpcContextTransformer,
  drizzleSchemaTransformer,
  envFileTransformer,
  authClientTransformer,
];

export const scaffoldProject = async (opts: Options) => {
  globalThis.PROJECT_DIR = path.join(process.cwd(), opts.name.path);

  await createBaseTemplate(PROJECT_DIR);

  const installerSpinner = ora("Installing selected packages").start();

  if (opts.shouldUseTRPC) addTRPCFiles();
  if (opts.shouldUseDrizzle) addDrizzleFiles();
  if (opts.shouldUseAuth) addBetterAuthFiles(opts.shouldUseTRPC);

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
