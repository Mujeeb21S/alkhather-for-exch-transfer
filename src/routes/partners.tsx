import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getPublicHome } from "@/lib/server/fns";
import { PARTNER_GROUPS } from "@/lib/partner-groups";
import { useI18n } from "@/components/site/shell";
import { PageIntro, inputClass } from "@/components/site/ui";

export const Route = createFileRoute("/partners")({
  loader: () => getPublicHome(),
  head: () => ({
    meta: [
      { title: "الشركاء | الخضر للصرافة" },
      { name: "description", content: "شبكات التحويل الدولية والإقليمية والمحلية التي أعلنتها شركة محسن الخضر." },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  const { partners } = Route.useLoaderData();
  const { lang, t } = useI18n();
  const text = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");
  const groups = PARTNER_GROUPS.filter((group) => group.kind !== "local_circular");
  const visible = useMemo(() => partners.filter((partner) => {
    const blob = `${partner.nameAr} ${partner.nameEn} ${partner.country ?? ""}`.toLowerCase();
    return (kind === "all" || partner.kind === kind) && blob.includes(q.trim().toLowerCase());
  }), [partners, q, kind]);
  return (
    <div>
      <PageIntro
        kicker={t("الشبكة", "Network")}
        title={t("شركاء التحويل", "Transfer partners")}
        crumbs={[{ href: "/", label: t("الرئيسية", "Home") }, { href: "/partners", label: t("الشركاء", "Partners") }]}
      />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12">
        <div className="grid gap-3 md:grid-cols-2">
          <input className={inputClass} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t("بحث", "Search")} placeholder={t("ابحث بالاسم", "Search by name")} />
          <select className={inputClass} value={kind} onChange={(e) => setKind(e.target.value)} aria-label={t("النوع", "Type")}>
            <option value="all">{t("كل الأنواع", "All types")}</option>
            {groups.map((group) => <option key={group.kind} value={group.kind}>{text(group.titleAr, group.titleEn)}</option>)}
          </select>
        </div>
        {groups.map((group) => {
          const items = visible.filter((partner) => partner.kind === group.kind);
          if (!items.length) return null;
          return (
            <section key={group.kind}>
              <h2 className="font-display text-3xl">{text(group.titleAr, group.titleEn)}</h2>
              <p className="mt-2 max-w-3xl text-sm text-muted">{text(group.bodyAr, group.bodyEn)}</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((partner) => {
                  const name = text(partner.nameAr, partner.nameEn);
                  return (
                    <li key={partner.id}>
                      <a href={partner.slug ? `/transfers/networks/${partner.slug}` : "/partners"} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
                        {partner.logoUrl ? (
                          <img src={partner.logoUrl} alt="" className="h-11 w-11 rounded-2xl object-contain" />
                        ) : (
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary font-display text-lg text-gold-soft">{name.trim().charAt(0)}</span>
                        )}
                        <p className="font-medium">{name}</p>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
