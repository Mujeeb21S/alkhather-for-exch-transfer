import { createFileRoute, Link } from "@tanstack/react-router";
import { getPublicHome } from "@/lib/server/fns";
import { useI18n } from "@/components/site/shell";
import { HeadOfficeFigure } from "@/components/site/premises";
import { Panel } from "@/components/site/ui";
import { ServiceMenu } from "@/components/site/services-menu";
import { Fa } from "@/components/site/fa";
import { PARTNER_GROUPS } from "@/lib/partner-groups";
import { formatMoney } from "@/lib/money";
import { Converter, TrackBox } from "@/components/site/tools";

export const Route = createFileRoute("/")({
  loader: () => getPublicHome(),
  head: () => ({
    meta: [
      { title: "الخضر للصرافة والتحويلات" },
      {
        name: "description",
        content:
          "صرافة وتحويلات في الجمهورية اليمنية. تعرّف على الخدمات والفروع، وتابع حالة الحوالة بعد التحقق.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialService",
          name: "الخضر للصرافة والتحويلات",
          alternateName: "Al Khadher Exchange & Money Transfers",
          areaServed: "YE",
          description:
            "شركة محسن الخضر للصرافة والتحويلات. ترخيص رقم 486 من البنك المركزي اليمني، والمكتب الرئيسي في مأرب.",
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  const { lang, t } = useI18n();
  const text = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const reasons: [string, string, string][] = [
    ["location-dot", t("سبع نقاط خدمة", "Seven service points"), t("مركز رئيسي في مأرب، وفروع في حريب والمحطة وصافر ومفرق السد وصنعاء وشبوة.", "A head office in Marib, plus Hareeb, the station, Safer, the dam junction, Sana'a, and Shabwa.")],
    ["shield-halved", t("ترخيص موثّق", "A stated license"), t("ترخيص رقم 486 صادر عن البنك المركزي اليمني بموجب القانون رقم 14 لسنة 2000.", "License No. 486 from the Central Bank of Yemen, under Law No. 14 of 2000.")],
    ["lock", t("خصوصية الحوالة", "Transfer privacy"), t("الاستعلام يُظهر الحالة والعملة ومدينة الاستلام فقط.", "Lookup shows the status, the currency, and the pickup city only.")],
    ["comment-dots", t("شكاوى واضحة", "A clear complaint path"), t("قدّم الشكوى واحتفظ برقمها لمتابعتها مع خدمة العملاء.", "File a complaint and keep its number to follow it with customer service.")],
  ];
  const steps = [
    t("تُنشأ الحوالة في الفرع أو لدى الوكيل، لا من المتصفح.", "The transfer is created at a branch or agent, not in the browser."),
    t("تستلم رقماً مرجعياً ورمز تحقق.", "You receive a reference and a verification code."),
    t("المستفيد يتابع الحالة بعد إدخال الاثنين معاً.", "The beneficiary checks status after entering both."),
    t("الاستلام يتم في نقطة الخدمة بعد التحقق من الهوية.", "Payout happens at the service point after identity is checked."),
  ];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="ledger absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            <p className="rise text-sm text-gold">AL KHADHER EXCHANGE</p>
            <h1 className="rise rise-2 mt-3 font-display text-5xl leading-tight text-ink md:text-6xl">
              {t("صرافة وتحويلات بوضوحٍ يُعتمد عليه", "Exchange and transfers, stated plainly")}
            </h1>
            <p className="rise rise-3 mt-5 max-w-xl text-lg text-muted">
              {t(
                "الخضر للصرافة والتحويلات. تعرّف على الخدمات والفروع، وتابع حالة الحوالة دون كشف أطرافها.",
                "Al Khadher Exchange. See the services and branches, and follow a transfer without exposing its parties.",
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/transfers" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm text-surface shadow-soft transition-colors duration-150 hover:bg-primary-mid">
                <Fa name="magnifying-glass" className="text-gold-soft" />
                {t("استعلام عن حوالة", "Look up a transfer")}
              </Link>
              <Link to="/branches" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-5 text-sm shadow-soft transition-colors duration-150 hover:bg-paper">
                <Fa name="location-dot" className="text-gold" />
                {t("الفروع", "Branches")}
              </Link>
              {data.publication.ratesLive ? (
                <Link to="/rates" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-surface px-5 text-sm text-primary shadow-soft">
                  <Fa name="coins" />
                  {t("الأسعار", "Rates")}
                </Link>
              ) : null}
            </div>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm text-muted">
              <li className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2 shadow-soft"><Fa name="shield-halved" className="text-gold" />{t("ترخيص 486", "License 486")}</li>
              <li className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2 shadow-soft"><Fa name="lock" className="text-gold" />{t("استعلام بلا كشف الأطراف", "Lookup without party details")}</li>
              <li className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2 shadow-soft"><Fa name="bolt" className="text-gold" />{t("متابعة من أي جهاز", "Follow up from any device")}</li>
            </ul>
          </div>
          {data.publication.ratesLive ? (
          <div className="md:col-span-5">
            <div className="soft-card p-5">
              <h2 className="inline-flex items-center gap-2 font-display text-2xl">
                <Fa name="coins" className="text-gold" />
                {t("أسعار الصرف", "Exchange rates")}
              </h2>
              <p className="mt-2 text-xs text-muted">{data.rates.find((rate) => !rate.base)?.updatedAt}</p>
              <ul className="mt-4 grid gap-3">
                {data.rates.filter((rate) => !rate.base).slice(0, 4).map((rate) => (
                  <li key={`${rate.code}-${rate.region}`} className="flex items-center justify-between rounded-2xl bg-paper px-3 py-3">
                    <div>
                      <p className="font-medium">{text(rate.nameAr, rate.nameEn)}</p>
                      <p className="text-xs text-muted">{rate.code}{rate.region ? ` · ${rate.region}` : ""}</p>
                    </div>
                    <p className="text-end tabular-nums">{formatMoney(rate.buy)} / {formatMoney(rate.sell)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          ) : (
          <div className="md:col-span-5">
            <div className="soft-card p-5">
              <h2 className="font-display text-2xl">{t("متابعة حوالة", "Track a transfer")}</h2>
              <p className="mt-2 mb-4 text-sm text-muted">{t("أدخل الرقم والرمز معاً. لا تشارك الرمز مع أحد.", "Enter the reference and the code together. Do not share the code.")}</p>
              <TrackBox />
            </div>
          </div>
          )}
        </div>
      </section>

      <div className="pt-10">
        <HeadOfficeFigure
          priority
          caption={t("المركز الرئيسي", "Head office")}
          address={text(data.settings.addressAr, data.settings.addressEn)}
          alt={t(
            "واجهة المركز الرئيسي لشركة محسن الخضر للصرافة والتحويلات",
            "Facade of the Mohsen Al Khadher Exchange head office",
          )}
        />
      </div>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 lg:grid-cols-2">
        {data.publication.ratesLive ? (
          <Panel>
            <h2 className="mb-3 font-display text-3xl">{t("محول العملات", "Currency converter")}</h2>
            <Converter rates={data.rates} />
          </Panel>
        ) : null}
        <Panel>
          <h2 className="font-display text-3xl">{t("متابعة حوالة", "Track a transfer")}</h2>
          <p className="mt-2 mb-4 text-sm text-muted">
            {t("النتيجة حالة وعملة ومدينة استلام. لا أسماء ولا مبلغ.", "The result is status, currency, and pickup city. No names and no amount.")}
          </p>
          <TrackBox />
        </Panel>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-3xl">{t("خدماتنا", "Our services")}</h2>
        <div className="mt-6">
          <ServiceMenu services={data.services} />
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-3xl">{t("لماذا الخضر", "Why Al Khadher")}</h2>
          <p className="mt-3 max-w-2xl text-muted">
            {t("خدمات في نقاط الشركة، وترخيص معلن، ومتابعة لا تكشف أطراف الحوالة.", "Service at the company's points, a stated license, and follow-up that does not expose the parties.")}
          </p>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {reasons.map(([icon, title, body]) => (
              <li key={title} className="soft-card p-5">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-gold-soft">
                  <Fa name={icon} />
                </span>
                <p className="mt-4 font-medium">{title}</p>
                <p className="mt-1 text-sm text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl">{t("إرسال واستلام", "Send and receive")}</h2>
          <ol className="mt-6 grid gap-4">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm text-surface tabular-nums">{index + 1}</span>
                <p className="pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="font-display text-3xl">{t("شبكة نقاط الخدمة", "Service points")}</h2>
          <ul className="mt-6 grid gap-3">
            {data.branches.map((branch) => (
              <li key={branch.id} className="soft-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-2 font-medium">
                    <Fa name="location-dot" className="text-gold" />
                    {text(branch.nameAr, branch.nameEn)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted">{text(branch.cityAr, branch.cityEn)} — {text(branch.addressAr, branch.addressEn)}</p>
              </li>
            ))}
          </ul>
          <Link to="/branches" className="mt-4 inline-flex text-sm text-primary underline-offset-4 hover:underline">
            {t("كل الدليل", "Full directory")}
          </Link>
        </div>
      </section>

      {data.partners.length ? (
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl">{t("شركاء التحويل", "Transfer partners")}</h2>
          <Link to="/partners" className="text-sm text-primary underline-offset-4 hover:underline">
            {t("كل الشركاء", "All partners")}
          </Link>
        </div>
        <div className="mt-6 grid gap-6">
          {PARTNER_GROUPS.filter((group) => group.kind !== "local_circular").map((group) => {
            const items = data.partners.filter((partner) => partner.kind === group.kind);
            if (!items.length) return null;
            return (
              <div key={group.kind}>
                <h3 className="text-sm text-gold">{text(group.titleAr, group.titleEn)}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {items.map((partner) => (
                    <li key={partner.id} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm">
                      {text(partner.nameAr, partner.nameEn)}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
      ) : null}

      {data.news.length ? (
      <section className="bg-primary-deep text-surface">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-3xl">{t("أخبار وإعلانات", "News and notices")}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {data.news.map((item) => (
              <Link key={item.slug} to="/news/$slug" params={{ slug: item.slug }} className="rounded-2xl border border-white/10 p-5">
                <p className="text-xs text-gold">{item.publishedAt}</p>
                <h3 className="mt-3 font-display text-2xl">{text(item.titleAr, item.titleEn)}</h3>
                <p className="mt-2 text-sm text-gold-soft">{text(item.excerptAr, item.excerptEn)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-3xl">{t("أسئلة متكررة", "Common questions")}</h2>
        <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
          {data.faqs.slice(0, 4).map((faq) => (
            <details key={faq.id} className="px-5 py-4">
              <summary className="cursor-pointer font-medium">{text(faq.questionAr, faq.questionEn)}</summary>
              <p className="mt-2 text-sm text-muted">{text(faq.answerAr, faq.answerEn)}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface px-5 py-6">
          <div>
            <h2 className="font-display text-2xl">{t("تواصل سريع", "A direct note")}</h2>
            <p className="mt-1 text-sm text-muted">{t("نموذج واحد، ويصل إلى صندوق خدمة العملاء.", "One form, delivered to the customer-service queue.")}</p>
          </div>
          <Link to="/contact" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm text-surface">
            {t("افتح النموذج", "Open the form")}
          </Link>
        </div>
      </section>
    </div>
  );
}
