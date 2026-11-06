import { createFileRoute, notFound } from "@tanstack/react-router";
import { ManagedArticle } from "@/components/site/article";
import { getManagedPage } from "@/lib/server/fns";

export const Route = createFileRoute("/privacy")({
  loader: async () => {
    const page = await getManagedPage({ data: "privacy" });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.titleAr ?? "الخصوصية"} | الخضر للصرافة` },
      { name: "description", content: loaderData?.bodyAr.slice(0, 160) ?? "" },
    ],
  }),
  component: function PrivacyPage() {
    return <ManagedArticle page={Route.useLoaderData()} />;
  },
});
