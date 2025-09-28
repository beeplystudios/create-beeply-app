import fsExtra from "fs-extra";
import path from "path";
import { PKG_ROOT } from "../consts.js";
import {
  buildAppPath,
  buildPathWithBase,
  buildServerPath,
} from "../helpers/build-path.js";

export const addBetterAuthFiles = (usingTRPC: boolean) => {
  const buildAuthPath = buildPathWithBase(
    path.join(PKG_ROOT, "template", "extras", "better-auth")
  );

  if (!fsExtra.existsSync(buildServerPath()())) {
    fsExtra.mkdirSync(buildServerPath()());
  }

  if (!fsExtra.existsSync(buildAppPath()("lib"))) {
    fsExtra.mkdirSync(buildAppPath()("lib"));
  }

  fsExtra.mkdirSync(buildServerPath()("auth"));

  fsExtra.copyFileSync(
    buildAuthPath("auth-client.ts"),
    buildAppPath()("lib", "auth-client.ts")
  );

  fsExtra.copyFileSync(
    buildAuthPath("auth-config.ts"),
    buildServerPath()("auth", "index.ts")
  );

  fsExtra.copyFileSync(
    buildAuthPath("auth-route.ts"),
    buildAppPath()("routes", "api", "auth.$.ts")
  );

  if (usingTRPC) {
    if (!fsExtra.existsSync(buildServerPath()("trpc", "middleware"))) {
      fsExtra.mkdirSync(buildServerPath()("trpc", "middleware"));

      fsExtra.copyFileSync(
        buildAuthPath("trpc-middleware.ts"),
        buildServerPath()("trpc", "middleware", "auth-middleware.ts")
      );

      fsExtra.copyFileSync(
        buildAuthPath("get-isomorphic-headers.ts"),
        buildAppPath()("lib", "get-isomorphic-headers.ts")
      );
    }
  }
};
