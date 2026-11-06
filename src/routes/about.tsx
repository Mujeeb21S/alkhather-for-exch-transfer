import { createFileRoute } from "@tanstack/react-router";
import { getPublicHome } from "@/lib/server/fns";
import { useI18n } from "@/components/site/shell";
import { PageIntro } from "@/components/site/ui";
import { HeadOfficeFigure } from "@/components/site/premises";

export const Route = createFileRoute("/about")({
  loader: () => getPublicHome(),
  head: () => ({
    meta: [
      { title: "من نحن | الخضر للصرافة" },
      {
        name: "description",
        content:
          "شركة محسن الخضر للصرافة والتحويلات النقدية. ترخيص رقم 486 من البنك المركزي اليمني، والمكتب الرئيسي في مأرب.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { settings } = Route.useLoaderData();
  const { lang, t } = useI18n();
  const text = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const principles = [
    [t("الالتزام", "Commitment"), text(settings.commitmentAr, settings.commitmentEn)],
    [t("الأمانة", "Trust"), text(settings.valuesAr, settings.valuesEn)],
    [t("الاحترام", "Respect"), text(settings.respectAr, settings.respectEn)],
    [t("الوضوح والشفافية", "Clarity"), text(settings.transparencyAr, settings.transparencyEn)],
  ];
  const facts = [
    [t("الترخيص", "License"), t("486 — البنك المركزي اليمني", "486 — Central Bank of Yemen")],
    [t("السند النظامي", "Legal basis"), t("القانون رقم 14 لسنة 2000", "Law No. 14 of 2000")],
    [t("المكتب الرئيسي", "Head office"), text(settings.addressAr, settings.addressEn)],
  ];

  return (
    <div>
      <PageIntro
        kicker={t("شركة محسن الخضر للصرافة والتحويلات النقدية", "Mohsen Al Khadher Exchange & Cash Transfers")}
        title={t("من نحن", "About")}
        body={text(settings.aboutAr, settings.aboutEn)}
      />
      <div className="pt-8">
        <HeadOfficeFigure
          caption={t("المركز الرئيسي", "Head office")}
          address={text(settings.addressAr, settings.addressEn)}
          alt={t(
            "واجهة المركز الرئيسي لشركة محسن الخضر للصرافة والتحويلات",
            "Facade of the Mohsen Al Khadher Exchange head office",
          )}
        />
      </div>
      <div className="mx-auto grid max-w-6xl gap-3 px-4 py-8 md:grid-cols-3">
        {facts.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line bg-surface px-5 py-4">
            <p className="text-xs text-gold">{label}</p>
            <p className="mt-1 font-medium">{value}</p>
          </div>
        ))}
      </div>
      <div className="mx-auto grid max-w-6xl gap-4 px-4 pb-4 md:grid-cols-2">
        <article className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-display text-2xl">{t("الرسالة", "Mission")}</h2>
          <Prose text={text(settings.missionAr, settings.missionEn)} />
        </article>
        <article className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-display text-2xl">{t("الرؤية", "Vision")}</h2>
          <Prose text={text(settings.visionAr, settings.visionEn)} />
        </article>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-4">
        <article className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-display text-2xl">{t("الأهداف", "Aims")}</h2>
          <Prose text={text(settings.goalsAr, settings.goalsEn)} />
        </article>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-4">
        <h2 className="font-display text-3xl">{t("القيم والمبادئ", "Values and principles")}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {principles.map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="font-display text-2xl">{title}</h3>
              <Prose text={body} />
            </article>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4">
        <article className="rounded-2xl bg-primary-deep p-6 text-surface">
          <h2 className="font-display text-3xl">{t("استراتيجية الشركة", "Company strategy")}</h2>
          <div className="mt-3 grid gap-3 text-gold-soft leading-7">
            {paragraphs(text(settings.strategyAr, settings.strategyEn)).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </article>
        <article className="rounded-2xl border border-gold bg-gold-soft/30 p-5">
          <h2 className="font-display text-2xl">{t("الترخيص والبيانات القانونية", "License and legal data")}</h2>
          <Prose text={text(settings.legalAr, settings.legalEn)} />
        </article>
      </div>
    </div>
  );
}

function paragraphs(text: string) {
  return text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

function Prose({ text }: { text: string }) {
  const lines = paragraphs(text);
  const numbered = lines.length > 1 && lines.every((line) => /^\d+[\.\)]/.test(line));
  if (numbered) {
    return (
      <ol className="mt-3 grid list-decimal gap-3 ps-5 leading-7 text-muted">
        {lines.map((line) => (
          <li key={line}>{line.replace(/^\d+[\.\)]\s*/, "")}</li>
        ))}
      </ol>
    );
  }
  return (
    <div className="mt-3 grid gap-3 leading-7 text-muted">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}
