import fsExtra from "fs-extra";
import { FileTransformer } from "./transformer-type.js";
import { buildProjectPath } from "../helpers/build-path.js";

export const envFileTransformer: FileTransformer = {
  deps: () => true,
  transformer: ({ opts }) => {
    const env: Record<string, string> = {
      APP_URL: `"http://localhost:3000"`,
    };

    if (opts.shouldUseDrizzle) {
      env.DATABASE_URL = `""`;
      env.DATABASE_AUTH_TOKEN = `""`;
    }

    // if (opts.shouldUseAuth) {
    //   env.GOOGLE_CLIENT_ID = `""`;
    //   env.GOOGLE_CLIENT_SECRET = `""`;
    // }

    const envFileStream = fsExtra.createWriteStream(buildProjectPath()(".env"));

    envFileStream.once("open", () => {
      Object.entries(env).forEach(([key, value]) => {
        envFileStream.write(`${key}=${value}\n`);
      });

      envFileStream.end();
    });
  },
};
