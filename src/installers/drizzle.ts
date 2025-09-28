import fsExtra from "fs-extra";
import path from "path";
import { PKG_ROOT } from "../consts.js";
import {
  buildPathWithBase,
  buildProjectPath,
  buildServerPath,
} from "../helpers/build-path.js";

export const addDrizzleFiles = () => {
  const buildDrizzlePath = buildPathWithBase(
    path.join(PKG_ROOT, "template", "extras", "drizzle")
  );

  if (!fsExtra.existsSync(buildServerPath()())) {
    fsExtra.mkdirSync(buildServerPath()());
  }

  fsExtra.mkdirSync(buildServerPath()("db"));

  fsExtra.copyFileSync(
    buildDrizzlePath("db.ts"),
    buildServerPath()("db", "index.ts")
  );

  fsExtra.copyFileSync(
    buildDrizzlePath("schema.ts"),
    buildServerPath()("db", "schema.ts")
  );

  fsExtra.copyFileSync(
    buildDrizzlePath("drizzle.config.ts"),
    buildProjectPath()("drizzle.config.ts")
  );
};
