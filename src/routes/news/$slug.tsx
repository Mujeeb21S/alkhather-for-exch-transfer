import { createFileRoute, notFound } from "@tanstack/react-router";
import { getNewsPage } from "@/lib/server/fns";
import { newsKindLabel } from "@/lib/labels";
import { useI18n } from "@/components/site/shell";
import { PageIntro } from "@/components/site/ui";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params }) => {
    const item = await getNewsPage({ data: params.slug });
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.titleAr ?? "خبر"} | الخضر للصرافة` },
      { name: "description", content: loaderData?.excerptAr ?? "خبر من الخضر للصرافة" },
      { property: "og:title", content: loaderData?.titleAr ?? "الخضر للصرافة" },
    ],
  }),
  component: NewsArticle,
});

function NewsArticle() {
  const item = Route.useLoaderData();
  const { lang, t } = useI18n();
  return (
    <div>
      <PageIntro
        kicker={newsKindLabel(item.kind, lang)}
        title={lang === "ar" ? item.titleAr : item.titleEn}
        body={item.publishedAt}
        crumbs={[{ href: "/", label: t("الرئيسية", "Home") }, { href: "/news", label: t("الأخبار", "News") }, { href: `/news/${item.slug}`, label: lang === "ar" ? item.titleAr : item.titleEn }]}
      />
      <article className="mx-auto max-w-3xl whitespace-pre-wrap px-4 py-12 leading-8">
        {lang === "ar" ? item.bodyAr : item.bodyEn}
      </article>
    </div>
  );
}
