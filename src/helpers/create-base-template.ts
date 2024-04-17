import { select } from "@clack/prompts";
import chalk from "chalk";
import fsExtra from "fs-extra";
import ora from "ora";
import path from "path";
import { PKG_ROOT } from "../consts.js";
import { buildProjectPath } from "./build-path.js";

export const createBaseTemplate = async (projectDir: string) => {
  const spinner = ora(
    `Scaffolding project in ${chalk.greenBright.bold(projectDir)}`
  ).start();

  if (fsExtra.existsSync(projectDir)) {
    if (fsExtra.readdirSync(projectDir).length === 0) {
      spinner.info(
        `${chalk.greenBright.bold(projectDir)} already exists, but is empty, continuing...`
      );
    } else {
      spinner.stopAndPersist();
      const action = await select({
        message: `${chalk.bgRedBright("Warning:")} the directory at ${chalk.greenBright.bold(projectDir)} already exists, and is not empty. How should we proceed?`,
        options: [
          {
            label: "Abort Installation",
            value: "abort",
          },
          {
            label: "Clear Directory and Continue",
            value: "clear",
          },
          {
            label: "Overwrite Conflicting Files",
            value: "overwrite",
          },
        ],
      });

      if (action === "abort") {
        spinner.fail("Aborting installation...");
        process.exit(1);
      }

      if (action === "clear") {
        spinner.info("Clearing directory and continuing...");
        fsExtra.emptyDirSync(projectDir);
      }
    }
  }

  spinner.start();
  fsExtra.copySync(path.join(PKG_ROOT, "template", "base"), projectDir);

  fsExtra.renameSync(
    buildProjectPath()("_gitignore"),
    buildProjectPath()(".gitignore")
  );

  spinner.succeed(
    "Scaffolded project in " + chalk.greenBright.bold(projectDir)
  );
};
