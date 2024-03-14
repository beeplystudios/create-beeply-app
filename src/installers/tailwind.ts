import path from "path";
import { PKG_ROOT } from "../consts.js";
import {
  buildAppPath,
  buildPathWithBase,
  buildProjectPath,
} from "../helpers/build-path.js";
import fsExtra from "fs-extra";
import { updateFile } from "../helpers/update-file.js";
import { dependencyVersionMap } from "../helpers/dep-map.js";

export const addTailwindFiles = () => {
  const buildTwPath = buildPathWithBase(
    path.join(PKG_ROOT, "template", "extras", "tailwind")
  );

  fsExtra.copyFileSync(
    buildTwPath("tailwind.config.ts"),
    buildProjectPath()("tailwind.config.ts")
  );

  fsExtra.copyFileSync(
    buildTwPath("postcss.config.js"),
    buildProjectPath()("postcss.config.js")
  );

  fsExtra.copyFileSync(
    buildTwPath("globals.css"),
    buildAppPath()("globals.css")
  );

  // updateFile({
  //   path: buildAppPath()("client-entry.tsx"),
  //   prepend: `import "./globals.css";`,
  // });

  PACKAGE_JSON.devDependencies = {
    ...PACKAGE_JSON.devDependencies,
    ...dependencyVersionMap.tailwind,
  };
};
