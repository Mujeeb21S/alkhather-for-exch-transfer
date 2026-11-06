import { createFileRoute } from "@tanstack/react-router";
import { loadHome } from "@/lib/server/queries.server";

export const Route = createFileRoute("/api/v1/partners")({
  server: {
    handlers: {
      GET: async () => {
        const home = await loadHome();
        return Response.json({
          partners: home.partners.map((partner) => ({
            id: partner.id,
            nameAr: partner.nameAr,
            nameEn: partner.nameEn,
            kind: partner.kind,
            noteAr: partner.noteAr,
            noteEn: partner.noteEn,
            url: partner.url,
            demo: partner.demo,
          })),
        });
      },
    },
  },
});
