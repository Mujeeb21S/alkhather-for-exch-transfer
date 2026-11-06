import { createFileRoute, notFound } from "@tanstack/react-router";
import { ManagedArticle } from "@/components/site/article";
import { getManagedPage } from "@/lib/server/fns";

export const Route = createFileRoute("/terms")({
  loader: async () => {
    const page = await getManagedPage({ data: "terms" });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.titleAr ?? "الشروط"} | الخضر للصرافة` },
      { name: "description", content: loaderData?.bodyAr.slice(0, 160) ?? "" },
    ],
  }),
  component: function TermsPage() {
    return <ManagedArticle page={Route.useLoaderData()} />;
  },
});
