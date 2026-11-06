import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/health")({
  server: {
    handlers: {
      GET: async () =>
        Response.json({
          ok: true,
          service: "alkhadher",
          financialRails: false,
          note: "No bank or payout-network connection is configured.",
        }),
    },
  },
});
