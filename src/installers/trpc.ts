import fsExtra from "fs-extra";
import path from "path";
import { PKG_ROOT } from "../consts.js";
import {
  buildAppPath,
  buildPathWithBase,
  buildServerPath,
} from "../helpers/build-path.js";

export const addTRPCFiles = () => {
  const buildTRPCPath = buildPathWithBase(
    path.join(PKG_ROOT, "template", "extras", "trpc")
  );

  fsExtra.mkdirSync(buildServerPath()("trpc"));

  fsExtra.copyFileSync(
    buildTRPCPath("trpc-config.ts"),
    buildServerPath()("trpc", "trpc-config.ts")
  );

  fsExtra.copyFileSync(
    buildTRPCPath("trpc-route.ts"),
    buildAppPath()("routes", "api", "trpc.$.ts")
  );

  fsExtra.copyFileSync(
    buildTRPCPath("trpc-client.ts"),
    buildAppPath()("lib", "trpc-client.ts")
  );

  fsExtra.copySync(
    buildTRPCPath("routes"),
    buildServerPath()("trpc", "routes")
  );

  // fsExtra.copyFileSync(
  //   buildTRPCPath("trpc-client.tsx"),
  //   buildAppPath()("lib", "trpc.ts")
  // );
};
