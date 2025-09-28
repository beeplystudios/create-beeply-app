import chalk from "chalk";
import { Options } from "../cli/get-opts.js";

export const logNextSteps = (opts: Options) => {
  const steps = ["Install packages"];

  if (opts.shouldUseDrizzle) {
    steps.push(
      `Edit ${chalk.blueBright(".env")} to add your ${chalk.greenBright("DATABASE_URL")} and ${chalk.greenBright("DATABASE_AUTH_TOKEN")}`
    );
  }

  if (opts.shouldUseAuth) {
    steps.push(
      `Edit ${chalk.blueBright(".env")} to add your ${chalk.greenBright("GOOGLE_CLIENT_ID")} and ${chalk.greenBright("GOOGLE_CLIENT_SECRET")}`
    );
  }

  steps.push("Start your dev server by running the `dev` script`");

  steps.forEach((step, index) => {
    console.log(`\n${chalk.greenBright(index + 1)}. ${step}`);
  });
};
