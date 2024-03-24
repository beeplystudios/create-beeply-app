import chalk from "chalk";
import { Options } from "../cli/get-opts.js";

export const logNextSteps = (opts: Options) => {
  const steps = ["Install packages"];

  if (opts.shouldUseAuth) {
    steps.push(
      `Edit ${chalk.blueBright(".env")} to add your ${chalk.greenBright("GOOGLE_CLIENT_ID")} and ${chalk.greenBright("GOOGLE_CLIENT_SECRET")}`
    );
  }

  if (opts.shouldUsePrisma) {
    steps.push(
      "Run your development database with `docker compose up` and sync your schema by running the `db:push` script"
    );
  }

  steps.push("Start your dev server by running the `dev` script`");

  steps.forEach((step, index) => {
    console.log(`\n${chalk.greenBright(index + 1)}. ${step}`);
  });
};
