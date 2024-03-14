import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { trpc } from "~app/lib/trpc";

export const useSignOut = (opts: UseMutationOptions = {}) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  return useMutation({
    mutationKey: ["sign-out"],
    mutationFn: async () => {
      const res = await fetch(`${__APP_URL__}/api/auth/sign-out`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to sign out");
      }
    },
    onSuccess: () => {
      router.invalidate();
      utils.invalidate();
    },
    ...opts,
  });
};
