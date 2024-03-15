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

  fsExtra.copyFileSync(
    buildTRPCPath("trpc-server.ts"),
    buildServerPath()("trpc.ts")
  );

  fsExtra.copySync(buildTRPCPath("routes"), buildServerPath()("routes"));

  fsExtra.copyFileSync(
    buildTRPCPath("trpc-client.tsx"),
    buildAppPath()("lib", "trpc.ts")
  );
};
