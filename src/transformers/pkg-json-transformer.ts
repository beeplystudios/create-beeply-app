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

    // if (opts.shouldUseAuth) {
    //   Object.assign(
    //     dependencies,
    //     dependencyVersionMap.lucia,
    //     dependencyVersionMap.typebox
    //   );
    // }

    if (opts.shouldUsePrisma) {
      pkgJson.scripts = {
        ...pkgJson.scripts,
        postinstall: "prisma generate",
        "db:push": "prisma db push",
        "db:reset": "prisma migrate reset && prisma db push",
      };

      pkgJson.devDependencies = {
        ...pkgJson.devDependencies,
        prisma: dependencyVersionMap.prisma,
      };
    }

    if (opts.shouldUseTRPC)
      Object.assign(dependencies, dependencyVersionMap.trpc);

    if (opts.shouldUseTanstackQuery)
      Object.assign(dependencies, dependencyVersionMap.tanstackQuery);

    if (opts.shouldUseTRPC || opts.shouldUseTanstackQuery)
      Object.assign(dependencies, {
        superjson: dependencyVersionMap.superjson,
      });

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
