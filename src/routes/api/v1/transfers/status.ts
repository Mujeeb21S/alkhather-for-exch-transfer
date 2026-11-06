import { createFileRoute } from "@tanstack/react-router";
import { trackTransfer } from "@/lib/server/queries.server";

export const Route = createFileRoute("/api/v1/transfers/status")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as { reference?: string; pin?: string } | null;
        if (!body?.reference || !body.pin) {
          return Response.json({ ok: false }, { status: 400 });
        }
        try {
          const result = await trackTransfer(body.reference, body.pin);
          return Response.json(result, { status: result.ok ? 200 : 404 });
        } catch (error) {
          const message = error instanceof Error ? error.message : "limited";
          return Response.json({ ok: false, message }, { status: 429 });
        }
      },
    },
  },
});
