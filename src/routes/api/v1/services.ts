import { createFileRoute } from "@tanstack/react-router";
import { loadHome } from "@/lib/server/queries.server";

export const Route = createFileRoute("/api/v1/services")({
  server: {
    handlers: {
      GET: async () => {
        const home = await loadHome();
        return Response.json({ services: home.services });
      },
    },
  },
});
