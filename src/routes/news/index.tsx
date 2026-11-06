import { createFileRoute, Link } from "@tanstack/react-router";
import { getPublicHome } from "@/lib/server/fns";
import { useI18n } from "@/components/site/shell";
import { PageIntro } from "@/components/site/ui";
import { newsKindLabel } from "@/lib/labels";

export const Route = createFileRoute("/news/")({
  loader: () => getPublicHome(),
  head: () => ({
    meta: [
      { title: "الأخبار | الخضر للصرافة" },
      { name: "description", content: "أخبار وإعلانات وتنبيهات الخضر للصرافة." },
    ],
  }),
  component: NewsIndex,
});

function NewsIndex() {
  const { news } = Route.useLoaderData();
  const { lang, t } = useI18n();
  return (
    <div>
      <PageIntro kicker={t("المحتوى", "Editorial")} title={t("الأخبار والإعلانات", "News and notices")} />
      <ul className="mx-auto grid max-w-6xl gap-4 px-4 py-12">
        {news.map((item) => (
          <li key={item.slug}>
            <Link to="/news/$slug" params={{ slug: item.slug }} className="block rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-center gap-2 text-xs text-gold">
                <span className="tabular-nums">{item.publishedAt}</span>
                <span>{newsKindLabel(item.kind, lang)}</span>
              </div>
              <h2 className="mt-2 font-display text-3xl">{lang === "ar" ? item.titleAr : item.titleEn}</h2>
              <p className="mt-2 text-muted">{lang === "ar" ? item.excerptAr : item.excerptEn}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
