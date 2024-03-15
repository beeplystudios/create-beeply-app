import fsExtra from "fs-extra";
import path from "path";
import { PKG_ROOT } from "../consts.js";
import {
  buildPathWithBase,
  buildProjectPath,
  buildServerPath,
} from "../helpers/build-path.js";

export const addPrismaFiles = () => {
  const buildDbPath = buildPathWithBase(
    path.join(PKG_ROOT, "template", "extras", "db")
  );

  fsExtra.copySync(buildDbPath("prisma"), path.join(PROJECT_DIR, "prisma"));
  fsExtra.copyFileSync(
    buildDbPath("docker-compose.yml"),
    buildProjectPath()("docker-compose.yml")
  );
  fsExtra.copyFileSync(buildDbPath("client.ts"), buildServerPath()("db.ts"));
};
