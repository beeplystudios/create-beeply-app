import fsExtra from "fs-extra";
import path from "path";
import { PKG_ROOT } from "../consts.js";
import {
  buildAppPath,
  buildPathWithBase,
  buildProjectPath,
  buildServerPath,
} from "../helpers/build-path.js";

export const addLuciaFiles = (usingTrpc: boolean) => {
  fsExtra.copyFileSync(
    path.join(PKG_ROOT, "template", "extras", "constants.ts"),
    buildProjectPath()("src", "constants.ts")
  );

  const buildAuthPath = buildPathWithBase(
    path.join(PKG_ROOT, "template", "extras", "auth")
  );

  fsExtra.copySync(buildAuthPath("server"), buildServerPath()("auth"));

  if (usingTrpc) {
    fsExtra.copyFileSync(
      buildAuthPath("auth-trpc-middleware.ts"),
      buildServerPath()("auth", "authed-procedure.ts")
    );
  }

  fsExtra.copyFileSync(
    buildAuthPath("client", "sign-in-view.tsx"),
    buildAppPath()("features", "sign-in-view.tsx")
  );

  fsExtra.copyFileSync(
    buildAuthPath("client", "sign-out.tsx"),
    buildAppPath()("features", "sign-out.tsx")
  );

  fsExtra.copyFileSync(
    buildAuthPath("client", "sign-in.tsx"),
    buildAppPath()("routes", "sign-in.tsx")
  );
};
