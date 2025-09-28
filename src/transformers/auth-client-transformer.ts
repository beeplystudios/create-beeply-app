import { buildAppPath } from "../helpers/build-path.js";
import { FileTransformer } from "./transformer-type.js";

const TS_QUERY_OPTIONS = `
export const signInOptions = mutationOptions({
  mutationKey: ["user-sign-in"],
  mutationFn: async () => {
    const res = await authClient.signIn.social({ provider: "google" });

    if (!res.data) {
      throw new Error(JSON.stringify(res.error));
    }
  },
  onSuccess: (_, __, ___, { client }) => {
    client.invalidateQueries();
  },
});

export const signOutOptions = mutationOptions({
  mutationKey: ["user-sign-out"],
  mutationFn: async () => {
    const res = await authClient.signOut();

    if (!res.data) {
      throw new Error(JSON.stringify(res.error));
    }
  },
  onSuccess: (_, __, ___, { client }) => {
    client.invalidateQueries();
  },
});
`;

export const authClientTransformer: FileTransformer = {
  deps: (opts) =>
    (opts.shouldUseAuth as boolean) && opts.shouldUseTanstackQuery,
  transformer: ({ project, opts }) => {
    const clientFile = project.getSourceFileOrThrow(
      buildAppPath()("lib", "auth-client.ts")
    );

    clientFile.addImportDeclaration({
      moduleSpecifier: "@tanstack/react-query",
      namedImports: ["mutationOptions"],
    });

    clientFile.insertText(clientFile.getFullWidth(), TS_QUERY_OPTIONS);
  },
};
