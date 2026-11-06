import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getPublicHome } from "@/lib/server/fns";
import { useI18n } from "@/components/site/shell";
import { PageIntro } from "@/components/site/ui";

export const Route = createFileRoute("/trust")({
  loader: () => getPublicHome(),
  head: () => ({
    meta: [
      { title: "الثقة والأمان | الخضر للصرافة" },
      { name: "description", content: "ترخيص 486 وقنوات الخضر للصرافة الرسمية، وكيف تتحقق من رقم الفرع قبل التعامل." },
      { property: "og:title", content: "الثقة والأمان | الخضر للصرافة" },
    ],
  }),
  component: TrustPage,
});

const TABS = [
  ["license", "الترخيص", "License"],
  ["fraud", "الاحتيال", "Fraud"],
] as const;

function TrustPage() {
  const data = Route.useLoaderData();
  const { lang, t } = useI18n();
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("license");
  const approved = new Set(data.publication.approvedPages);
  const extra = [
    ["privacy", "/privacy", "الخصوصية", "Privacy"],
    ["terms", "/terms", "الشروط", "Terms"],
    ["compliance", "/compliance", "الامتثال", "Compliance"],
    ["aml", "/aml", "مكافحة غسل الأموال", "AML"],
    ["kyc", "/kyc", "اعرف عميلك", "KYC"],
  ].filter(([slug]) => approved.has(slug));
  return (
    <div>
      <PageIntro
        kicker={t("الثقة", "Trust")}
        title={t("الترخيص والأمان", "License and safety")}
        crumbs={[{ href: "/", label: t("الرئيسية", "Home") }, { href: "/trust", label: t("الثقة", "Trust") }]}
      />
      <div className="mx-auto grid max-w-3xl gap-4 px-4 py-12">
        <div className="flex gap-2">
          {TABS.map(([id, ar, en]) => (
            <button key={id} type="button" onClick={() => setTab(id)} className={`min-h-11 rounded-full px-4 text-sm ${tab === id ? "bg-primary text-surface" : "border border-line bg-surface"}`}>
              {lang === "ar" ? ar : en}
            </button>
          ))}
        </div>
        {tab === "license" ? (
          <div className="soft-card grid gap-3 p-5">
            <p>{t("ترخيص رقم 486 صادر عن البنك المركزي اليمني.", "License No. 486, issued by the Central Bank of Yemen.")}</p>
            <p>{t("السند: القانون رقم 14 لسنة 2000.", "Basis: Law No. 14 of 2000.")}</p>
            <p>{t("المكتب الرئيسي: مأرب، الشارع العام، جوار مؤسسة الكهرباء.", "Head office: Marib, Main Street, beside the Electricity Corporation.")}</p>
            {data.settings.foundedOn ? <p>{data.settings.foundedOn}</p> : null}
            {data.settings.licenseImage ? <img src={data.settings.licenseImage} alt={t("شهادة الترخيص", "License certificate")} className="max-h-80 rounded-2xl" /> : null}
          </div>
        ) : (
          <div className="soft-card grid gap-3 p-5 leading-8">
            <p>{t("لا تشارك رمز الحوالة في مكالمة أو رسالة من رقم غير منشور على هذا الموقع.", "Do not share a transfer code on a call or message from a number that is not published on this site.")}</p>
            <p>{t("من يطلب الرمز ثم يطلب تحويل رسم إلى حساب شخصي لإتمام الاستلام، لا تتابعه. الرسم إن وُجد يُذكر في نقطة الخدمة.", "If someone asks for the code and then for a fee sent to a personal account, stop. Any fee is stated at the service point.")}</p>
            <p>{t("رسالة باسم الشركة من رقم لا يطابق صفحة الفروع ليست قناة رسمية.", "A message in the company's name from a number that does not match the branches page is not an official channel.")}</p>
            <p>{t("القنوات الرسمية هي أرقام الفروع المنشورة وخدمة العملاء 712720300 وواتساب الرقم نفسه.", "Official channels are the published branch numbers and customer service 712720300, including WhatsApp on that number.")}</p>
            <p>{t("للتحقق من رقم فرع، طابقه مع صفحة الفروع قبل التحويل.", "To check a branch number, match it with the branches page before you send money.")}</p>
            <Link to="/complaints" className="text-primary underline-offset-4 hover:underline">{t("أبلغ عن اشتباه", "Report a concern")}</Link>
          </div>
        )}
        {extra.length ? (
          <ul className="flex flex-wrap gap-3 text-sm">
            {extra.map(([slug, href, ar, en]) => (
              <li key={slug}><a href={href} className="text-primary underline-offset-4 hover:underline">{lang === "ar" ? ar : en}</a></li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
