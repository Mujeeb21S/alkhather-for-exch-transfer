import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getPublicHome } from "@/lib/server/fns";
import { useI18n } from "@/components/site/shell";
import { PageIntro, inputClass } from "@/components/site/ui";

export const Route = createFileRoute("/help")({
  loader: () => getPublicHome(),
  head: ({ loaderData }) => ({
    meta: [
      { title: "المساعدة | الخضر للصرافة" },
      { name: "description", content: "أسئلة عن الأسعار والحوالات والفروع وخدمات المنظمات لدى الخضر للصرافة." },
      { property: "og:title", content: "المساعدة | الخضر للصرافة" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: (loaderData?.faqs ?? []).slice(0, 20).map((faq) => ({
            "@type": "Question",
            name: faq.questionAr,
            acceptedAnswer: { "@type": "Answer", text: faq.answerAr },
          })),
        }),
      },
    ],
  }),
  component: HelpPage,
});

const TABS = [
  ["all", "الكل", "All"],
  ["rates", "الأسعار", "Rates"],
  ["transfers", "الحوالات", "Transfers"],
  ["branches", "الفروع", "Branches"],
  ["aid", "المنظمات", "Organizations"],
] as const;

function HelpPage() {
  const data = Route.useLoaderData();
  const { lang, t } = useI18n();
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("all");
  const [query, setQuery] = useState("");
  const faqs = useMemo(() => data.faqs.filter((faq) => {
    const topicOk = tab === "all" || faq.topic === tab;
    const blob = `${faq.questionAr} ${faq.questionEn} ${faq.answerAr}`.toLowerCase();
    return topicOk && blob.includes(query.trim().toLowerCase());
  }), [data.faqs, query, tab]);
  return (
    <div>
      <PageIntro
        kicker={t("المساعدة", "Help")}
        title={t("الأسئلة والإرشاد", "Questions and guidance")}
        crumbs={[{ href: "/", label: t("الرئيسية", "Home") }, { href: "/help", label: t("المساعدة", "Help") }]}
      />
      <div className="mx-auto grid max-w-3xl gap-4 px-4 py-12">
        <input className={inputClass} value={query} onChange={(e) => setQuery(e.target.value)} aria-label={t("بحث", "Search")} placeholder={t("ابحث في الأسئلة", "Search the questions")} />
        <div className="flex gap-2 overflow-x-auto">
          {TABS.map(([id, ar, en]) => (
            <button key={id} type="button" onClick={() => setTab(id)} className={`min-h-11 shrink-0 rounded-full px-4 text-sm ${tab === id ? "bg-primary text-surface" : "border border-line bg-surface"}`}>
              {lang === "ar" ? ar : en}
            </button>
          ))}
        </div>
        <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {faqs.map((faq) => (
            <details key={faq.id} className="px-5 py-4">
              <summary className="cursor-pointer text-lg font-medium">{lang === "ar" ? faq.questionAr : faq.questionEn}</summary>
              <p className="mt-2 text-muted">{lang === "ar" ? faq.answerAr : faq.answerEn}</p>
            </details>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link to="/news" className="text-primary underline-offset-4 hover:underline">{t("الأخبار", "News")}</Link>
          <Link to="/transfers" className="text-primary underline-offset-4 hover:underline">{t("متابعة حوالة", "Track a transfer")}</Link>
          <Link to="/complaints" className="text-primary underline-offset-4 hover:underline">{t("شكوى", "Complaint")}</Link>
        </div>
        {data.guides.length ? (
          <ul className="grid gap-3">
            {data.guides.map((guide) => (
              <li key={guide.slug}>
                <Link to="/news/$slug" params={{ slug: guide.slug }} className="block rounded-2xl border border-line bg-surface p-4">
                  {lang === "ar" ? guide.titleAr : guide.titleEn}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
