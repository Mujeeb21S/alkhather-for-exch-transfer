import { createFileRoute, Outlet, useChildMatches } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getPublicHome } from "@/lib/server/fns";
import { useI18n } from "@/components/site/shell";
import { Fa } from "@/components/site/fa";
import { DemoMark, EmptyState, PageIntro, PhoneLines, inputClass } from "@/components/site/ui";
import type { Branch } from "@/lib/domain";
import { mapsSearch, openNow } from "@/lib/phones";

export const Route = createFileRoute("/branches")({
  loader: () => getPublicHome(),
  head: () => ({
    meta: [
      { title: "الفروع والوكلاء | الخضر للصرافة" },
      { name: "description", content: "عناوين فروع الخضر للصرافة وأرقامها في مأرب وصنعاء وشبوة." },
    ],
  }),
  component: BranchesPage,
});

function approvedPin(branch: Branch) {
  return !branch.demo && Boolean(branch.lat) && Boolean(branch.lng);
}

function googleHref(branch: Branch, lang: "ar" | "en") {
  const address = lang === "ar" ? `${branch.addressAr} ${branch.cityAr}` : `${branch.addressEn} ${branch.cityEn}`;
  return mapsSearch(address);
}

function BranchesPage() {
  const nested = useChildMatches().length > 0;
  const { branches } = Route.useLoaderData();
  const { lang, t } = useI18n();
  const text = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [gov, setGov] = useState("all");
  const [city, setCity] = useState("all");
  const [q, setQ] = useState("");
  const govs = Array.from(new Set(branches.map((b) => (lang === "ar" ? b.governorateAr : b.governorateEn))));
  const cities = Array.from(new Set(branches.map((b) => (lang === "ar" ? b.cityAr : b.cityEn))));
  const filtered = useMemo(() => {
    return branches.filter((b) => {
      const g = lang === "ar" ? b.governorateAr : b.governorateEn;
      const c = lang === "ar" ? b.cityAr : b.cityEn;
      const blob = `${b.nameAr} ${b.nameEn} ${b.cityAr} ${b.cityEn} ${b.addressAr} ${b.phone}`.toLowerCase();
      return (gov === "all" || g === gov) && (city === "all" || c === city) && blob.includes(q.trim().toLowerCase());
    });
  }, [branches, gov, city, q, lang]);
  const pins = filtered.filter(approvedPin);
  const [focusId, setFocusId] = useState<number | null>(null);
  const focus = pins.find((branch) => branch.id === focusId) ?? pins[0] ?? null;
  if (nested) return <Outlet />;

  return (
    <div>
      <PageIntro
        kicker={t("الشبكة", "Network")}
        title={t("الفروع والوكلاء", "Branches and agents")}
        body={t("عناوين وأرقام نقاط الخدمة.", "Addresses and phone numbers of the service points.")}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="relative block">
            <Fa name="magnifying-glass" className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-gold" />
            <input className={`${inputClass} ps-10`} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("ابحث بالاسم أو المدينة أو الهاتف", "Search by name, city, or phone")} />
          </label>
          <label className="relative block">
            <Fa name="filter" className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-gold" />
            <select className={`${inputClass} ps-10`} value={gov} onChange={(e) => setGov(e.target.value)}>
              <option value="all">{t("كل المحافظات", "All governorates")}</option>
              {govs.map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>
          <label className="relative block">
            <Fa name="location-dot" className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-gold" />
            <select className={`${inputClass} ps-10`} value={city} onChange={(e) => setCity(e.target.value)} aria-label={t("المدينة", "City")}>
              <option value="all">{t("كل المدن", "All cities")}</option>
              {cities.map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>
        </div>
        <div className="soft-card mt-6 overflow-hidden">
          {focus ? (
            <div>
              <iframe
                title={t("خريطة النقطة المعتمدة", "Approved point map")}
                className="h-72 w-full border-0"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${focus.lat},${focus.lng}`)}&z=15&output=embed`}
              />
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                <p className="inline-flex items-center gap-2"><Fa name="location-dot" className="text-gold" />{text(focus.nameAr, focus.nameEn)}</p>
                <a className="inline-flex items-center gap-2 text-primary underline-offset-4 hover:underline" href={googleHref(focus, lang)} target="_blank" rel="noreferrer">
                  <Fa name="map" />
                  {t("فتح في خرائط جوجل", "Open in Google Maps")}
                </a>
              </div>
            </div>
          ) : (
            <p className="inline-flex items-start gap-2 px-4 py-10 text-sm text-muted">
              <Fa name="map" className="mt-0.5 text-gold" />
              {t("لا توجد إحداثيات لهذه التصفية.", "No coordinates for this filter.")}
            </p>
          )}
        </div>
        {filtered.length === 0 ? (
          <div className="mt-6">
            <EmptyState title={t("لا نتائج", "No matches")} body={t("غيّر البحث أو أزل التصفية.", "Change the search or clear the filter.")} />
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {filtered.map((branch) => {
              const photo = !branch.demo && (/^https:\/\//.test(branch.photoUrl) || branch.photoUrl.startsWith("/")) ? branch.photoUrl : "";
              return (
                <li key={branch.id} className="soft-card p-5">
                  {photo ? <img src={photo} alt="" className="mb-4 aspect-[16/9] w-full rounded-xl object-cover object-center" /> : null}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-gold">
                        {branch.nameAr === "المركز الرئيسي"
                          ? t("المركز الرئيسي", "Head office")
                          : branch.kind === "agent"
                            ? t("وكيل", "Agent")
                            : t("فرع", "Branch")}
                      </p>
                      <h2 className="mt-1 font-display text-2xl">
                        <a href={`/branches/${branch.slug || branch.id}`} className="hover:text-primary">{text(branch.nameAr, branch.nameEn)}</a>
                      </h2>
                    </div>
                    {branch.demo ? <DemoMark>{t("تجريبي", "Sample")}</DemoMark> : null}
                  </div>
                  <p className="mt-3 inline-flex items-start gap-2 text-sm">
                    <Fa name="location-dot" className="mt-0.5 text-gold" />
                    <span>{text(branch.governorateAr, branch.governorateEn)} — {text(branch.cityAr, branch.cityEn)} · {text(branch.addressAr, branch.addressEn)}</span>
                  </p>
                  <div className="mt-3 inline-flex items-start gap-2 text-sm">
                    <Fa name="phone" className="mt-0.5 text-gold" />
                    <div>
                      <p className="text-muted">{t("الهاتف", "Phone")}</p>
                      {branch.phone ? <PhoneLines value={branch.phone} /> : null}
                    </div>
                  </div>
                  {text(branch.hoursAr, branch.hoursEn) ? (
                    <p className="mt-2 inline-flex items-center gap-2 text-sm">
                      <Fa name="clock" className="text-gold" />
                      {text(branch.hoursAr, branch.hoursEn)}
                      {openNow(text(branch.hoursAr, branch.hoursEn)) == null ? "" : openNow(text(branch.hoursAr, branch.hoursEn)) ? t(" · مفتوح الآن", " · Open now") : t(" · مغلق الآن", " · Closed now")}
                    </p>
                  ) : null}
                  {text(branch.servicesAr, branch.servicesEn) ? (
                    <p className="mt-1 text-sm">{t("الخدمات:", "Services:")} {text(branch.servicesAr, branch.servicesEn)}</p>
                  ) : null}
                  <a className="mt-3 inline-flex items-center gap-2 text-sm text-primary" href={googleHref(branch, lang)} target="_blank" rel="noreferrer">
                    <Fa name="map" />
                    {t("افتح في خرائط جوجل", "Open in Google Maps")}
                  </a>
                  {approvedPin(branch) ? (
                    <button type="button" className="mt-2 inline-flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline" onClick={() => setFocusId(branch.id)}>
                      {t("إظهارها على الخريطة", "Show on the map")}
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
