import * as p from "@clack/prompts";
import chalk from "chalk";

export const getOpts = async () => {
  return p.group(
    {
      name: () =>
        p.text({
          message: "What is the your project name?",
          placeholder: "my-beeply-app",
          defaultValue: "test",
        }),
      shouldSSR: () => p.confirm({ message: "Do you want to use SSR?" }),
      shouldUseTailwind: () =>
        p.confirm({ message: "Do you want to use TailwindCSS?" }),
      shouldUsePrisma: () =>
        p.confirm({ message: "Do you want to use Prisma?" }),
      shouldUseAuth: async (data) =>
        data.results.shouldUsePrisma
          ? p.confirm({
              message: "Do you want to set up Google OAuth2 with Lucia?",
            })
          : false,
      shouldUseTRPC: () => p.confirm({ message: "Do you want to use TRPC?" }),
      // shouldDeploy: () =>
      //   p.confirm({
      //     message: `Do you want us to set up a Dockerfile for deployment to ${chalk.magenta(
      //       "fly.io"
      //     )}?`,
      //   }),
      // shouldInitGit: () =>
      //   p.confirm({
      //     message: "Do you want us to initialize a git repository?",
      //   }),
      // shouldInstallDeps: () =>
      //   p.confirm({ message: "Do you want us to install dependencies?" }),
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
