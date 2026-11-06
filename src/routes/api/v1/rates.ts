import { createFileRoute } from "@tanstack/react-router";
import { loadHome } from "@/lib/server/queries.server";

export const Route = createFileRoute("/api/v1/rates")({
  server: {
    handlers: {
      GET: async () => {
        const home = await loadHome();
        return Response.json({
          base: "YER",
          illustrative: home.rates.some((rate) => rate.demo),
          updatedAt: home.rates[0]?.updatedAt ?? null,
          rates: home.rates,
        });
      },
    },
  },
});
