import { createFileRoute, notFound } from "@tanstack/react-router";
import { ManagedArticle } from "@/components/site/article";
import { getManagedPage } from "@/lib/server/fns";

export const Route = createFileRoute("/compliance")({
  loader: async () => {
    const page = await getManagedPage({ data: "compliance" });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.titleAr ?? "الامتثال"} | الخضر للصرافة` },
      { name: "description", content: loaderData?.bodyAr.slice(0, 160) ?? "" },
    ],
  }),
  component: function CompliancePage() {
    return <ManagedArticle page={Route.useLoaderData()} />;
  },
});
