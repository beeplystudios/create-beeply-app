import fsExtra from "fs-extra";
import { FileTransformer } from "./transformer-type.js";
import { buildProjectPath } from "../helpers/build-path.js";

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

export const prismaSchemaTransformer: FileTransformer = {
  deps: (opts) => opts.shouldUseAuth as boolean,
  transformer: () => {
    const schemaPath = buildProjectPath()("prisma", "schema.prisma");
    const file = fsExtra.readFileSync(schemaPath);

    fsExtra.writeFileSync(
      schemaPath,
      `${file.toString()}
      ${PRISMA_MODELS}
      `
    );
  },
};
