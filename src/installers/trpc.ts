import fsExtra from "fs-extra";
import path from "path";
import { Project, SyntaxKind } from "ts-morph";
import { PKG_ROOT } from "../consts.js";
import {
  buildAppPath,
  buildPathWithBase,
  buildServerPath,
} from "../helpers/build-path.js";
import { dependencyVersionMap } from "../helpers/dep-map.js";

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

  // fsExtra.copyFileSync(
  //   buildTRPCPath("create-router-w-trpc.tsx"),
  //   buildAppPath()("lib", "router.tsx")
  // );

  // fsExtra.copyFileSync(
  //   buildTRPCPath("router-context-w-trpc.ts"),
  //   buildAppPath()("lib", "router-context.ts")
  // );

  PACKAGE_JSON.dependencies = {
    ...PACKAGE_JSON.dependencies,
    ...dependencyVersionMap.trpc,
    superjson: dependencyVersionMap.superjson,
  };
};
