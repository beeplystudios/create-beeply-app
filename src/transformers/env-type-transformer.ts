import { buildServerPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

export const envTypeTransformer: FileTransformer = {
  deps: (opts) => opts.shouldUseAuth as boolean,
  transformer: ({ project, opts }) => {
    const envTypeFile = project.getSourceFileOrThrow(
      buildServerPath()("env.ts")
    );

    const processEnvInterface = envTypeFile
      .getModuleOrThrow("global")
      .getModuleOrThrow("NodeJS")
      .getInterfaceOrThrow("ProcessEnv");

    if (opts.shouldUseAuth) {
      processEnvInterface.addProperties([
        {
          name: "GOOGLE_CLIENT_ID",
          type: "string",
        },
        {
          name: "GOOGLE_CLIENT_SECRET",
          type: "string",
        },
      ]);
    }
  },
};
