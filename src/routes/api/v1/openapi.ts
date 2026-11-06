import { createFileRoute } from "@tanstack/react-router";

const spec = {
  openapi: "3.0.3",
  info: {
    title: "Al Khadher Exchange public API",
    version: "1.1.0",
    description:
      "Read-only content API plus transfer-status lookup. Not connected to a bank, card scheme, or international payout network. Rates may be illustrative.",
  },
  paths: {
    "/api/v1/health": { get: { summary: "Service health", responses: { "200": { description: "OK" } } } },
    "/api/v1/rates": { get: { summary: "Exchange board against YER", responses: { "200": { description: "Rates" } } } },
    "/api/v1/branches": { get: { summary: "Active branches and agents", responses: { "200": { description: "Directory" } } } },
    "/api/v1/services": { get: { summary: "Published services", responses: { "200": { description: "Services" } } } },
    "/api/v1/news": { get: { summary: "Published news", responses: { "200": { description: "News" } } } },
    "/api/v1/partners": { get: { summary: "Published transfer partners named by the company.", responses: { "200": { description: "Partners" } } } },
    "/api/v1/transfers/status": {
      post: {
        summary: "Status only. Requires reference and pin. Does not return names or amount.",
        responses: { "200": { description: "Status" }, "404": { description: "Not verified" }, "429": { description: "Rate limited" } },
      },
    },
  },
};

export const Route = createFileRoute("/api/v1/openapi")({
  server: {
    handlers: {
      GET: async () => Response.json(spec),
    },
  },
});
