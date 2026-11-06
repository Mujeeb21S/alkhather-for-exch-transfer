import { createFileRoute } from "@tanstack/react-router";
import { getRateHistory } from "@/lib/server/fns";
import { useI18n } from "@/components/site/shell";
import { PageIntro } from "@/components/site/ui";

export const Route = createFileRoute("/rates/history")({
  loader: () => getRateHistory(),
  head: () => ({ meta: [{ title: "سجل الأسعار | الخضر للصرافة" }, { name: "description", content: "تغيّر أسعار الصرف المنشورة لشركة محسن الخضر." }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const rows = Route.useLoaderData();
  const { t } = useI18n();
  const codes = Array.from(new Set(rows.map((row) => row.code)));
  return (
    <div>
      <PageIntro
        kicker={t("الصرف", "Exchange")}
        title={t("سجل التغير", "Rate history")}
        crumbs={[{ href: "/", label: t("الرئيسية", "Home") }, { href: "/rates", label: t("الأسعار", "Rates") }, { href: "/rates/history", label: t("السجل", "History") }]}
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12">
        {codes.length === 0 ? null : codes.map((code) => {
          const points = rows.filter((row) => row.code === code);
          const max = Math.max(...points.map((point) => Number(point.sell)), 1);
          return (
            <section key={code} className="soft-card p-5">
              <h2 className="font-display text-2xl">{code}</h2>
              <svg viewBox="0 0 320 80" className="mt-4 h-24 w-full" role="img" aria-label={code}>
                <polyline
                  fill="none"
                  stroke="#0e2a22"
                  strokeWidth="3"
                  points={points.map((point, index) => `${(index / Math.max(points.length - 1, 1)) * 320},${80 - (Number(point.sell) / max) * 70}`).join(" ")}
                />
              </svg>
            </section>
          );
        })}
      </div>
    </div>
  );
}
