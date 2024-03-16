import fsExtra from "fs-extra";
import { FileTransformer } from "./transformer-type.js";
import { buildProjectPath } from "../helpers/build-path.js";

export const envFileTransformer: FileTransformer = {
  deps: (opts) => opts.shouldUsePrisma || (opts.shouldUseAuth as boolean),
  transformer: ({ opts }) => {
    const env: Record<string, string> = {
      APP_URL: `"http://localhost:3000"`,
    };

    if (opts.shouldUsePrisma) {
      env.DATABASE_URL = `"postgres://postgres:prisma@localhost:5432"`;
    }

    if (opts.shouldUseAuth) {
      env.GOOGLE_CLIENT_ID = `""`;
      env.GOOGLE_CLIENT_SECRET = `""`;
    }

    const envFileStream = fsExtra.createWriteStream(buildProjectPath()(".env"));

    envFileStream.once("open", () => {
      Object.entries(env).forEach(([key, value]) => {
        envFileStream.write(`${key}=${value}\n`);
      });

      envFileStream.end();
    });
  },
};
