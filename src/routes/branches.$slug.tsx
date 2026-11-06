import { createFileRoute, notFound } from "@tanstack/react-router";
import { getPublicBranch } from "@/lib/server/fns";
import { useI18n } from "@/components/site/shell";
import { PageIntro, PhoneLines } from "@/components/site/ui";
import { mapsSearch, openNow } from "@/lib/phones";
import { Fa } from "@/components/site/fa";

export const Route = createFileRoute("/branches/$slug")({
  loader: async ({ params }) => {
    const branch = await getPublicBranch({ data: params.slug });
    if (!branch) throw notFound();
    return branch;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.nameAr ?? "فرع"} | الخضر للصرافة` },
      { name: "description", content: loaderData ? `${loaderData.addressAr}. ${loaderData.phone}` : "فرع الخضر للصرافة" },
    ],
    scripts: loaderData ? [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: loaderData.nameAr,
        address: loaderData.addressAr,
        telephone: loaderData.phone,
      }),
    }] : [],
  }),
  component: BranchPage,
});

function BranchPage() {
  const branch = Route.useLoaderData();
  const { lang, t } = useI18n();
  const text = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const open = openNow(text(branch.hoursAr, branch.hoursEn));
  return (
    <div>
      <PageIntro
        kicker={text(branch.cityAr, branch.cityEn)}
        title={text(branch.nameAr, branch.nameEn)}
        body={text(branch.addressAr, branch.addressEn)}
        crumbs={[{ href: "/", label: t("الرئيسية", "Home") }, { href: "/branches", label: t("الفروع", "Branches") }, { href: `/branches/${branch.slug}`, label: text(branch.nameAr, branch.nameEn) }]}
      />
      <div className="mx-auto grid max-w-3xl gap-4 px-4 py-12">
        {branch.photoUrl ? <img src={branch.photoUrl} alt="" className="w-full rounded-3xl object-cover" /> : null}
        <PhoneLines value={branch.phone} />
        {branch.hoursAr ? <p>{text(branch.hoursAr, branch.hoursEn)}{open == null ? "" : open ? t(" · مفتوح الآن", " · Open now") : t(" · مغلق الآن", " · Closed now")}</p> : null}
        <a className="inline-flex min-h-11 items-center gap-2 text-primary" href={mapsSearch(`${text(branch.addressAr, branch.addressEn)} ${text(branch.cityAr, branch.cityEn)}`)}>
          <Fa name="location-dot" />
          {t("افتح في خرائط جوجل", "Open in Google Maps")}
        </a>
        <a className="inline-flex min-h-11 items-center gap-2 text-primary" href="https://wa.me/967712720300">
          <Fa name="whatsapp" brand />
          {t("واتساب خدمة العملاء", "Customer-service WhatsApp")}
        </a>
      </div>
    </div>
  );
}
