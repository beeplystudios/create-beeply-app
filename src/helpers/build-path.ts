import path from "path";

export const buildPathWithBase = (base: string) => {
  return (...args: string[]) => path.join(base, ...args);
};

export const buildProjectPath = () => buildPathWithBase(PROJECT_DIR);

export const buildAppPath = () =>
  buildPathWithBase(path.join(PROJECT_DIR, "src"));

export const buildServerPath = () =>
  buildPathWithBase(path.join(PROJECT_DIR, "src", "server"));
