import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/healthcheck")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return json({ message: "ok" });
      },
    },
  },
});
