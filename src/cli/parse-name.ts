/**
 * This logic is taken entirely from create-t3-app
 * @link https://github.com/t3-oss/create-t3-app/blob/main/cli/src/utils/parseNameAndPath.ts
 *
 * Didn't want to rewrite the same logic for parsing the name and path of the app,
 * so I just copied it over.
 */

import { basename, resolve } from "path";

const removeTrailingSlash = (input: string) => {
  if (input.length > 1 && input.endsWith("/")) {
    input = input.slice(0, -1);
  }

  return input;
};

export const parseName = (rawInput: string) => {
  const input = removeTrailingSlash(rawInput);

  const paths = input.split("/");

  let appName = paths[paths.length - 1]!;

  if (appName === ".") {
    const parsedCwd = resolve(process.cwd());
    appName = basename(parsedCwd);
  }

  // If the first part is a @, it's a scoped package
  const indexOfDelimiter = paths.findIndex((p) => p.startsWith("@"));
  if (paths.findIndex((p) => p.startsWith("@")) !== -1) {
    appName = paths.slice(indexOfDelimiter).join("/");
  }

  const path = paths.filter((p) => !p.startsWith("@")).join("/");

  return {
    appName,
    path,
  };
};

const validationRegExp =
  /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

//Validate a string against allowed package.json names
export const validateAppName = (rawInput: string) => {
  const input = removeTrailingSlash(rawInput);
  const paths = input.split("/");

  // If the first part is a @, it's a scoped package
  const indexOfDelimiter = paths.findIndex((p) => p.startsWith("@"));

  let appName = paths[paths.length - 1];
  if (paths.findIndex((p) => p.startsWith("@")) !== -1) {
    appName = paths.slice(indexOfDelimiter).join("/");
  }

  if (input === "." || validationRegExp.test(appName ?? "")) {
    return;
  } else {
    return "App name must consist of only lowercase alphanumeric characters, '-', and '_'";
  }
};
