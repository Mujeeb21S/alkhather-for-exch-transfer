import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/components/site/shell";
import { PageIntro, Panel } from "@/components/site/ui";
import { TrackBox } from "@/components/site/tools";

export const Route = createFileRoute("/transfers/track")({
  head: () => ({ meta: [{ title: "تتبع حوالة | الخضر للصرافة" }, { name: "description", content: "استعلم عن حالة حوالة بالرقم والرمز. لا تُعرض الأسماء ولا المبلغ." }] }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return (
    <div>
      <PageIntro title={t("تتبع حوالتك", "Track your transfer")} kicker={t("الحوالات", "Transfers")} body={t("لا تشارك الرمز. النتيجة حالة وعملة ومدينة استلام فقط.", "Do not share the code. The result is status, currency, and pickup city only.")} crumbs={[{ href: "/", label: t("الرئيسية", "Home") }, { href: "/transfers/track", label: t("التتبع", "Track") }]} />
      <div className="mx-auto max-w-xl px-4 py-12"><Panel><TrackBox /></Panel></div>
    </div>
  );
}
