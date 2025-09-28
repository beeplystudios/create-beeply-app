import fsExtra from "fs-extra";
import path from "path";
import { buildProjectPath } from "../helpers/build-path.js";
import { dependencyVersionMap } from "../helpers/dep-map.js";
import { FileTransformer } from "./transformer-type.js";
import { getVersion } from "../helpers/get-version.js";

export const pkgJsonTransformer: FileTransformer = {
  deps: () => true,
  transformer: ({ opts }) => {
    let pkgJson = fsExtra.readJSONSync(path.join(PROJECT_DIR, "package.json"));

    const dependencies = {};

    if (opts.shouldUseDrizzle) {
      Object.assign(dependencies, dependencyVersionMap.drizzle);
      pkgJson.devDependencies = {
        ...pkgJson.devDependencies,
        ...dependencyVersionMap.drizzleDev,
      };
    }

    if (opts.shouldUseAuth) {
      Object.assign(dependencies, dependencyVersionMap.betterAuth);
    }

    if (opts.shouldUseTRPC)
      Object.assign(dependencies, dependencyVersionMap.trpc);

    if (opts.shouldUseTanstackQuery)
      Object.assign(dependencies, dependencyVersionMap.tanstackQuery);

    if (opts.shouldUseTRPC || opts.shouldUseTanstackQuery)
      Object.assign(dependencies, {
        superjson: dependencyVersionMap.superjson,
      });

    if (opts.shouldUseTRPC && opts.shouldUseTanstackQuery) {
      Object.assign(dependencies, dependencyVersionMap.trpcTanstackQuery);
    }

    pkgJson.dependencies = {
      ...pkgJson.dependencies,
      ...dependencies,
    };

    pkgJson = {
      name: opts.name.appName,
      ...pkgJson,
      beeplyAppMeta: {
        initVersion: getVersion(),
      },
    };

    fsExtra.writeJSONSync(buildProjectPath()("package.json"), pkgJson, {
      spaces: 2,
    });
  },
};
