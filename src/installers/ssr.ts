import path from "path";
import { PKG_ROOT } from "../consts.js";
import {
  buildAppPath,
  buildPathWithBase,
  buildProjectPath,
} from "../helpers/build-path.js";
import fsExtra from "fs-extra";

export const addSSRFiles = () => {
  const buildSSRPath = buildPathWithBase(
    path.join(PKG_ROOT, "template", "extras", "ssr")
  );

  fsExtra.copyFileSync(
    buildSSRPath("ssr-app-config.ts"),
    buildProjectPath()("app.config.ts")
  );

  fsExtra.removeSync(buildProjectPath()("index.html"));

  fsExtra.copyFileSync(
    buildSSRPath("ssr-client-entry.tsx"),
    buildAppPath()("client-entry.tsx")
  );

  fsExtra.copyFileSync(
    buildSSRPath("ssr-server-entry.tsx"),
    buildAppPath()("server-entry.tsx")
  );

  fsExtra.copyFileSync(
    buildSSRPath("dev-style-inject.ts"),
    buildAppPath()("lib", "dev-style-inject.ts")
  );

  fsExtra.copyFileSync(
    buildSSRPath("ssr-root-route-view.tsx"),
    buildAppPath()("features", "root-route.tsx")
  );
};
