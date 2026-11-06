import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/components/site/shell";
import { PageIntro } from "@/components/site/ui";

export const Route = createFileRoute("/transfers/receive-guide")({
  head: () => ({ meta: [{ title: "دليل الاستلام | الخضر للصرافة" }, { name: "description", content: "كيف تستلم حوالة من نقطة خدمة تابعة للخضر للصرافة." }] }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const steps = [
    t("راجع حالة الحوالة بالرقم والرمز.", "Check the transfer with its reference and code."),
    t("توجّه إلى مدينة الاستلام الظاهرة بعد التحقق.", "Go to the pickup city shown after verification."),
    t("أبرز هويتك والرمز في نقطة الخدمة.", "Show your identification and the code at the service point."),
  ];
  return (
    <div>
      <PageIntro title={t("دليل الاستلام", "How to receive")} kicker={t("الحوالات", "Transfers")} crumbs={[{ href: "/", label: t("الرئيسية", "Home") }, { href: "/transfers", label: t("الحوالات", "Transfers") }, { href: "/transfers/receive-guide", label: t("الاستلام", "Receive") }]} />
      <ol className="mx-auto grid max-w-3xl gap-3 px-4 py-12">
        {steps.map((step) => <li key={step} className="soft-card p-4">{step}</li>)}
        <Link to="/branches" className="text-primary">{t("نقاط الخدمة", "Service points")}</Link>
      </ol>
    </div>
  );
}
