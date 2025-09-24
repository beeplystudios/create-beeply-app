import * as p from "@clack/prompts";
import { parseName, validateAppName } from "./parse-name.js";

export const getOpts = async () => {
  return p.group(
    {
      name: async () => {
        const input = await p.text({
          message: "What is the your project name?",
          placeholder: "my-beeply-app",
          validate: validateAppName,
        });

        return parseName(input as string);
      },
      shouldUseTanstackQuery: () =>
        p.confirm({ message: "Do you want to use TanStack Query?" }),
      shouldUsePrisma: () =>
        p.confirm({ message: "Do you want to use Prisma?" }),
      shouldUseAuth: async (data) =>
        data.results.shouldUsePrisma
          ? p.confirm({
              message: "Do you want to set up Google OAuth2 with Lucia?",
            })
          : false,
      shouldUseTRPC: () => p.confirm({ message: "Do you want to use TRPC?" }),
      shouldInitGit: () =>
        p.confirm({
          message: "Do you want us to initialize a git repository?",
        }),
    },
    {
      onCancel: () => {
        p.outro("See you later!");
        process.exit(0);
      },
    }
  );
};

export type Options = Awaited<ReturnType<typeof getOpts>>;
