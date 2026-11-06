import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/site/shell";
import { PageIntro, Panel } from "@/components/site/ui";

type Spec = {
  info?: { title?: string; version?: string; description?: string };
  paths?: Record<string, Record<string, { summary?: string }>>;
};

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: "واجهة التكامل | الخضر للصرافة" },
      { name: "description", content: "واجهة قراءة عامة للأسعار والفروع والخدمات، واستعلام حالة الحوالة." },
    ],
  }),
  component: DevelopersPage,
});

function DevelopersPage() {
  const { t } = useI18n();
  const [spec, setSpec] = useState<Spec | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    void fetch("/api/v1/openapi")
      .then((res) => res.json())
      .then((body: Spec) => setSpec(body))
      .catch(() => undefined);
  }, []);
  const rows = [
    ["GET", "/api/v1/health", t("جاهزية الخدمة", "Liveness")],
    ["GET", "/api/v1/rates", t("لوحة الأسعار كما تحفظها الإدارة", "The rate board as saved by staff")],
    ["GET", "/api/v1/branches", t("الفروع والوكلاء النشطون", "Active branches and agents")],
    ["GET", "/api/v1/services", t("الخدمات المنشورة", "Published services")],
    ["GET", "/api/v1/news", t("الأخبار المنشورة", "Published news")],
    ["GET", "/api/v1/partners", t("الشركاء المنشورون", "Published partners")],
    ["POST", "/api/v1/transfers/status", t("حالة حوالة بالرقم والرمز، بلا أسماء ولا مبلغ", "Transfer status by reference and code, no names or amount")],
    ["GET", "/api/v1/openapi", t("وصف OpenAPI", "OpenAPI description")],
  ];
  return (
    <div>
      <PageIntro
        kicker="API"
        title={t("واجهة التكامل", "Integration surface")}
        crumbs={[{ href: "/", label: t("الرئيسية", "Home") }, { href: "/developers", label: t("للمطورين", "Developers") }]}
        body={t(
          "قراءة عامة. لا تنفّذ قيداً مالياً ولا تنشئ حوالة.",
          "Public reads. They do not post a ledger entry and they do not create a transfer.",
        )}
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12">
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[36rem] text-sm">
            <tbody>
              {rows.map(([method, path, note]) => (
                <tr key={path} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-gold">{method}</td>
                  <td className="px-4 py-3 tabular-nums">{path}</td>
                  <td className="px-4 py-3 text-muted">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Panel>
          <h2 className="font-display text-2xl">OpenAPI {spec?.info?.version ?? ""}</h2>
          <p className="mt-2 text-sm text-muted">{spec?.info?.description}</p>
          <div className="mt-4 grid gap-2">
            {Object.entries(spec?.paths ?? {}).map(([path, methods]) =>
              Object.entries(methods).map(([method, operation]) => {
                const id = `${method} ${path}`;
                return (
                  <div key={id} className="rounded-xl border border-line">
                    <button type="button" className="flex min-h-11 w-full items-center gap-3 px-3 text-start text-sm" aria-expanded={open === id} onClick={() => setOpen(open === id ? null : id)}>
                      <span className="font-medium uppercase text-gold">{method}</span>
                      <span className="tabular-nums">{path}</span>
                    </button>
                    {open === id ? <p className="border-t border-line px-3 py-3 text-sm text-muted">{operation.summary}</p> : null}
                  </div>
                );
              }),
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
