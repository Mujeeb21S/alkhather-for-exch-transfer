import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getServicePage } from "@/lib/server/fns";
import { ServiceGlyph, ServicePhoto } from "@/components/site/service-visual";
import { useI18n } from "@/components/site/shell";
import { PageIntro, Panel } from "@/components/site/ui";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const data = await getServicePage({ data: params.slug });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.service.titleAr ?? "خدمة"} | الخضر للصرافة` },
      { name: "description", content: loaderData?.service.summaryAr ?? "" },
    ],
  }),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service, faqs } = Route.useLoaderData();
  const { lang, t } = useI18n();
  const text = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const steps = lang === "ar" ? service.stepsAr : service.stepsEn;
  const reqs = lang === "ar" ? service.requirementsAr : service.requirementsEn;
  const covers = lang === "ar" ? service.coversAr : service.coversEn;
  const related = faqs.filter((faq) => faq.serviceSlug === service.slug);
  return (
    <div>
      <PageIntro kicker={t("خدمة", "Service")} title={text(service.titleAr, service.titleEn)} body={text(service.summaryAr, service.summaryEn)} />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12">
        <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="relative">
            <ServicePhoto slug={service.slug} className="aspect-[16/8] w-full object-cover" />
            <span className="absolute bottom-4 start-4">
              <ServiceGlyph slug={service.slug} className="h-14 w-14" />
            </span>
          </div>
          <figcaption className="px-5 py-3 text-xs text-muted">
            {t("صورة تعبيرية للخدمة، وليست صورة فرع بعينه.", "An illustrative image for the service, not a photo of a specific branch.")}
          </figcaption>
        </figure>
        {service.audienceAr ? (
          <Panel>
            <h2 className="font-display text-2xl">{t("لمن هذه الخدمة", "Who it is for")}</h2>
            <p className="mt-3 text-muted">{text(service.audienceAr, service.audienceEn)}</p>
          </Panel>
        ) : null}
        <Panel>
          <h2 className="font-display text-2xl">{t("تفاصيل الخدمة", "Service details")}</h2>
          <div className="mt-3 grid gap-3 text-muted">
            {text(service.bodyAr, service.bodyEn).split(/\n\n+/).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {service.slug === "individuals" ? (
            <Link to="/branches" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm text-surface">
              {t("دليل الفروع", "Branch directory")}
            </Link>
          ) : null}
          {service.slug === "currency-convert" ? (
            <Link to="/rates" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm text-surface">
              {t("افتح لوحة التحويل", "Open the converter")}
            </Link>
          ) : null}
          {service.slug === "track-transfer" ? (
            <Link to="/transfers" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm text-surface">
              {t("تتبع الحوالة", "Track a transfer")}
            </Link>
          ) : null}
          {service.slug === "suggestions" ? (
            <Link to="/complaints" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm text-surface">
              {t("قدّم شكوى أو مقترحاً", "Send a complaint or suggestion")}
            </Link>
          ) : null}
          {service.slug === "corporate" || service.slug === "humanitarian" ? (
            <a href={`/services/${service.slug}/request`} className="mt-5 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm text-surface">
              {t("قدّم طلباً", "Send a request")}
            </a>
          ) : null}
          {service.slug.startsWith("aid-") ? (
            <a href="/services/humanitarian/request" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm text-surface">
              {t("قدّم طلب المنظمة", "Send an organization request")}
            </a>
          ) : null}
        </Panel>
        {covers.length ? (
          <Panel>
            <h2 className="font-display text-2xl">{t("ماذا تشمل", "What it covers")}</h2>
            <ul className="mt-4 grid gap-2 md:grid-cols-2">
              {covers.map((item) => (
                <li key={item} className="border-s-2 border-gold ps-3">{item}</li>
              ))}
            </ul>
          </Panel>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Panel>
            <h2 className="font-display text-2xl">{t("خطوات التنفيذ", "Steps")}</h2>
            <ol className="mt-4 grid gap-3">
              {steps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="tabular-nums text-gold">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Panel>
          <Panel>
            <h2 className="font-display text-2xl">{t("الشروط والمتطلبات", "Requirements")}</h2>
            <ul className="mt-4 grid gap-2">
              {reqs.map((item) => (
                <li key={item} className="border-s-2 border-gold ps-3">{item}</li>
              ))}
            </ul>
          </Panel>
        </div>
        <Panel>
          <h2 className="font-display text-2xl">{t("الرسوم", "Fees")}</h2>
          <p className="mt-3 text-muted">{text(service.feesAr, service.feesEn)}</p>
        </Panel>
        {related.length ? (
          <Panel>
            <h2 className="font-display text-2xl">{t("أسئلة هذه الخدمة", "Questions on this service")}</h2>
            <div className="mt-4 divide-y divide-line">
              {related.map((faq) => (
                <details key={faq.id} className="py-3">
                  <summary className="cursor-pointer font-medium">{text(faq.questionAr, faq.questionEn)}</summary>
                  <p className="mt-2 text-sm text-muted">{text(faq.answerAr, faq.answerEn)}</p>
                </details>
              ))}
            </div>
          </Panel>
        ) : null}
      </div>
    </div>
  );
}
