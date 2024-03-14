import fsExtra from "fs-extra";
import { Options } from "../cli/get-opts.js";
import path from "path";

let ENV = `
APP_URL="http://localhost:3000"
`;

export const buildAndCommitEnv = (opts: Options) => {
  if (opts.shouldUsePrisma) {
    ENV += `
DATABASE_URL="postgres://postgres:prisma@localhost:5432"
`;
  }

  if (opts.shouldUseAuth) {
    ENV += `
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
`;
  }

  fsExtra.writeFile(path.join(PROJECT_DIR, ".env"), ENV);
};
