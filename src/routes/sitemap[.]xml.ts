import { createFileRoute } from "@tanstack/react-router";
import { loadPublicHome } from "@/lib/server/queries.server";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const home = await loadPublicHome();
        const paths = [
          "/",
          "/about",
          "/services",
          "/transfers",
          "/transfers/track",
          "/transfers/receive-guide",
          "/transfers/send-guide",
          "/branches",
          "/partners",
          "/help",
          "/tools",
          "/trust",
          "/contact",
          "/complaints",
          "/news",
          ...(home.publication.ratesLive ? ["/rates", "/rates/history"] : []),
          ...(home.publication.openJobs ? ["/careers"] : []),
          ...home.publication.approvedPages.map((slug) => `/${slug}`),
          ...home.services.map((service) => `/services/${service.slug}`),
          ...home.news.map((item) => `/news/${item.slug}`),
          ...home.branches.filter((branch) => branch.slug).map((branch) => `/branches/${branch.slug}`),
          ...home.partners.filter((partner) => partner.slug).map((partner) => `/transfers/networks/${partner.slug}`),
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join("\n")}
</urlset>`;
        return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
