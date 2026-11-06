import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPublicHome } from "@/lib/server/fns";
import { useI18n } from "@/components/site/shell";
import { PageIntro } from "@/components/site/ui";

export const Route = createFileRoute("/transfers/networks/$slug")({
  loader: async ({ params }) => {
    const home = await getPublicHome();
    const partner = home.partners.find((item) => item.slug === params.slug);
    if (!partner) throw notFound();
    return partner;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.nameAr ?? "شبكة"} | الخضر للصرافة` },
      { name: "description", content: "الاستلام عبر نقاط خدمة الخضر للصرافة المنشورة." },
    ],
  }),
  component: Page,
});

function Page() {
  const partner = Route.useLoaderData();
  const { lang, t } = useI18n();
  const name = lang === "ar" ? partner.nameAr : partner.nameEn;
  return (
    <div>
      <PageIntro kicker={t("الشبكات", "Networks")} title={name} body={t("الاستلام يتم في نقاط الخدمة المنشورة بعد التحقق من الهوية والرمز.", "Pickup is at a published service point after identification and the code are checked.")} crumbs={[{ href: "/", label: t("الرئيسية", "Home") }, { href: "/partners", label: t("الشركاء", "Partners") }, { href: `/transfers/networks/${partner.slug}`, label: name }]} />
      <div className="mx-auto flex max-w-3xl gap-4 px-4 py-12">
        <Link to="/branches" className="text-primary">{t("نقاط الخدمة", "Service points")}</Link>
        <Link to="/transfers/track" className="text-primary">{t("تتبع الحوالة", "Track")}</Link>
      </div>
    </div>
  );
}
