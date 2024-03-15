import fsExtra from "fs-extra";
import path from "path";
import { PKG_ROOT } from "../consts.js";
import {
  buildAppPath,
  buildPathWithBase,
  buildProjectPath,
  buildServerPath,
} from "../helpers/build-path.js";
import { updateFile } from "../helpers/update-file.js";

const PRISMA_MODELS = `

model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String
  image         String
  sessions      Session[]
  oauthAccounts OAuthAccount[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  user      User     @relation(references: [id], fields: [userId], onDelete: Cascade)
}

model OAuthAccount {
  providerName   String
  providerUserId String
  userId         String
  user           User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([providerName, providerUserId])
}
`;

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

  updateFile({
    path: buildProjectPath()("prisma", "schema.prisma"),
    append: PRISMA_MODELS,
  });
};
