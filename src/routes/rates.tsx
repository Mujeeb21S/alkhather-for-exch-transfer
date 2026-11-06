import { createFileRoute, Outlet, useChildMatches } from "@tanstack/react-router";
import { useState } from "react";
import { Fa } from "@/components/site/fa";
import { getPublicHome } from "@/lib/server/fns";
import { useI18n } from "@/components/site/shell";
import { DemoMark, PageIntro, Panel, inputClass } from "@/components/site/ui";
import { formatMoney } from "@/lib/money";
import type { RateRow } from "@/lib/domain";
import { Converter } from "@/components/site/tools";

export const Route = createFileRoute("/rates")({
  loader: () => getPublicHome(),
  head: () => ({
    meta: [
      { title: "أسعار الصرف | الخضر للصرافة" },
      { name: "description", content: "أسعار الصرف المنشورة لشركة محسن الخضر مقابل الريال اليمني." },
    ],
  }),
  component: RatesPage,
});

function RatesPage() {
  const nested = useChildMatches().length > 0;
  const data = Route.useLoaderData();
  const { rates } = data;
  const { lang, t } = useI18n();
  const text = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const regions = Array.from(new Set(rates.map((rate) => rate.region).filter(Boolean)));
  const [region, setRegion] = useState("");
  const shown = rates.filter((rate) => rate.region === region);
  const latest = shown.find((rate) => !rate.base)?.updatedAt ?? shown[0]?.updatedAt ?? "";
  if (nested) return <Outlet />;
  if (!data.publication.ratesLive) {
    return (
      <div>
        <PageIntro kicker={t("الصرف", "Exchange")} title={t("أسعار الصرف", "Exchange rates")} body={t("لا توجد أسعار منشورة حالياً.", "No rates are published right now.")} />
      </div>
    );
  }

  return (
    <div>
      <PageIntro
        kicker={t("الصرف", "Exchange")}
        title={t("أسعار الصرف", "Exchange rates")}
        body={t(`آخر تحديث: ${latest}`, `Last update: ${latest}`)}
        crumbs={[{ href: "/", label: t("الرئيسية", "Home") }, { href: "/rates", label: t("الأسعار", "Rates") }]}
      />
      <div className="mx-auto flex max-w-6xl flex-wrap gap-3 px-4 pt-8">
        <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm text-surface" onClick={() => shareBoard(shown, latest)}>
          <Fa name="share-nodes" />
          {t("شارك الأسعار", "Share rates")}
        </button>
        <a href="/rates/history" className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-4 text-sm">{t("سجل التغير", "Change history")}</a>
      </div>
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="soft-card overflow-x-auto">
            {regions.length ? (
              <div className="border-b border-line p-3">
                <select className={inputClass} value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option value="">{t("السعر العام", "National board")}</option>
                  {regions.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </div>
            ) : null}
            <table className="w-full min-w-[40rem] text-sm">
              <thead className="text-muted">
                <tr className="border-b border-line">
                  <th className="px-4 py-3 text-start font-medium">{t("العملة", "Currency")}</th>
                  <th className="px-4 py-3 text-start font-medium">{t("الرمز", "Code")}</th>
                  <th className="px-4 py-3 text-end font-medium">{t("شراء", "Buy")}</th>
                  <th className="px-4 py-3 text-end font-medium">{t("بيع", "Sell")}</th>
                  <th className="px-4 py-3 text-end font-medium">{t("التغير", "Change")}</th>
                  <th className="px-4 py-3 text-start font-medium">{t("الاتجاه", "Move")}</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((rate) => (
                  <tr key={`${rate.code}-${rate.region}`} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="grid h-9 min-w-9 place-items-center rounded-xl bg-primary px-2 text-xs text-gold-soft">{rate.code}</span>
                        {text(rate.nameAr, rate.nameEn)}
                        {rate.base ? <DemoMark>{t("أساس", "Base")}</DemoMark> : null}
                        {rate.demo ? <DemoMark>{t("تجريبي", "Sample")}</DemoMark> : null}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{rate.code}</td>
                    <td className="px-4 py-3 text-end tabular-nums">{rate.base ? "—" : formatMoney(rate.buy)}</td>
                    <td className="px-4 py-3 text-end tabular-nums">{rate.base ? "—" : formatMoney(rate.sell)}</td>
                    <td className="px-4 py-3 text-end tabular-nums">{rate.base ? "—" : `${Number(rate.changePct).toFixed(2)}%`}</td>
                    <td className="px-4 py-3">
                      {rate.direction === "up" ? <Fa name="arrow-trend-up" className="text-up" /> : null}
                      {rate.direction === "down" ? <Fa name="arrow-trend-down" className="text-down" /> : null}
                      {rate.direction === "flat" ? <Fa name="minus" className="text-muted" /> : null}
                      <span className="sr-only">{rate.direction}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 inline-flex items-start gap-2 text-sm text-muted">
            <Fa name="circle-info" className="mt-0.5 text-gold" />
            <span>
            {t("آخر تحديث مخزّن:", "Stored update:")} <span className="tabular-nums">{latest}</span>
            {" · "}
            {t("الأساس الريال اليمني.", "Quoted against the Yemeni rial.")}
            </span>
          </p>
        </div>
        <Panel className="lg:col-span-2">
          <h2 className="font-display text-2xl">{t("محول العملات", "Currency converter")}</h2>
          <div className="mt-4">
          <Converter rates={shown.filter((rate) => rate.region === region)} />
          </div>
        </Panel>
      </div>
    </div>
  );
}

async function shareBoard(rows: RateRow[], updated: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 80 + rows.length * 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#0e2a22";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e8d5a3";
  ctx.font = "600 36px Cairo, sans-serif";
  ctx.fillText("الخضر للصرافة — ترخيص 486", 40, 52);
  ctx.font = "400 22px Cairo, sans-serif";
  rows.forEach((row, index) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${row.code}  ${row.buy} / ${row.sell}`, 40, 110 + index * 64);
  });
  ctx.fillStyle = "#e8d5a3";
  ctx.fillText(updated, 40, canvas.height - 24);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return;
  const file = new File([blob], "alkhadher-rates.png", { type: "image/png" });
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: "أسعار الخضر للصرافة" });
    return;
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "alkhadher-rates.png";
  link.click();
  URL.revokeObjectURL(url);
}
