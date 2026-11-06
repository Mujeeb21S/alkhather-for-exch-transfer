import { createFileRoute, notFound } from "@tanstack/react-router";
import { ManagedArticle } from "@/components/site/article";
import { getManagedPage } from "@/lib/server/fns";

export const Route = createFileRoute("/kyc")({
  loader: async () => {
    const page = await getManagedPage({ data: "kyc" });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.titleAr ?? "اعرف عميلك"} | الخضر للصرافة` },
      { name: "description", content: loaderData?.bodyAr.slice(0, 160) ?? "" },
    ],
  }),
  component: function KycPage() {
    return <ManagedArticle page={Route.useLoaderData()} />;
  },
});
