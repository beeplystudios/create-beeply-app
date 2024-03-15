#!/usr/bin/env node
import * as p from "@clack/prompts";
import chalk from "chalk";
import { userInfo } from "node:os";
import { getOpts } from "./cli/get-opts.js";
import { scaffoldProject } from "./helpers/scaffold.js";

declare global {
  var PROJECT_DIR: string;
}

const main = async () => {
  const user = userInfo().username;

  p.intro(
    ` 
    Welcome to create-beeply-app ${chalk.blue(
      user.charAt(0).toLocaleUpperCase() + user.slice(1, user.length)
    )}!
    Let's get you started with a new project using ${chalk.greenBright(
      `TanStack Router`
    )}.
    `
  );

  const result = await getOpts();
  p.outro(JSON.stringify(result, null, 2));

  console.log("SCAFFOLDING PROJECT");
  scaffoldProject(result);
};

main().catch((err) => {
  console.error(err);
});
