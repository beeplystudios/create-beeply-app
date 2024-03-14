import path from "path";
import { PKG_ROOT } from "../consts.js";
import fs from "fs-extra";
import { Options } from "../cli/get-opts.js";
import { addPrismaFiles } from "../installers/prisma.js";
import { commitPkgJson, loadPkgJson } from "./pkg-json.js";
import { addTRPCFiles } from "../installers/trpc.js";
import { addLuciaFiles } from "../installers/lucia.js";
import { buildAndCommitEnv } from "./build-env.js";
import { addTailwindFiles } from "../installers/tailwind.js";
import { IndentationText, Project, QuoteKind } from "ts-morph";
import { buildProjectPath } from "./build-path.js";
import { integrateResolvingConflicts } from "./build-resolve.js";

export const scaffoldProject = async (opts: Options) => {
  globalThis.PROJECT_DIR = path.join(process.cwd(), opts.name);

  fs.copySync(path.join(PKG_ROOT, "template", "base"), PROJECT_DIR);

  loadPkgJson();
  PACKAGE_JSON.name = opts.name;

  const project = new Project({
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      quoteKind: QuoteKind.Double,
      useTrailingCommas: true,
    },
  });

  if (opts.shouldUseTailwind) addTailwindFiles();
  if (opts.shouldUsePrisma) addPrismaFiles();
  if (opts.shouldUseTRPC) addTRPCFiles();
  if (opts.shouldUseAuth) addLuciaFiles();

  project.addSourceFilesFromTsConfig(
    path.join(buildProjectPath()("tsconfig.json"))
  );

  integrateResolvingConflicts(project, opts);

  project.saveSync();

  commitPkgJson();
  buildAndCommitEnv(opts);
};
