import { createFileRoute, notFound } from "@tanstack/react-router";
import { ManagedArticle } from "@/components/site/article";
import { getManagedPage } from "@/lib/server/fns";

export const Route = createFileRoute("/fraud")({
  loader: async () => {
    const page = await getManagedPage({ data: "fraud" });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.titleAr ?? "التحذير من الاحتيال"} | الخضر للصرافة` },
      { name: "description", content: loaderData?.bodyAr.slice(0, 160) ?? "" },
    ],
  }),
  component: function FraudPage() {
    return <ManagedArticle page={Route.useLoaderData()} />;
  },
});
