import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/components/site/shell";
import { PageIntro } from "@/components/site/ui";

export const Route = createFileRoute("/transfers/send-guide")({
  head: () => ({ meta: [{ title: "دليل الإرسال | الخضر للصرافة" }, { name: "description", content: "إرسال الحوالة يتم في الفرع، لا من الموقع." }] }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return (
    <div>
      <PageIntro title={t("دليل الإرسال", "How to send")} kicker={t("الحوالات", "Transfers")} crumbs={[{ href: "/", label: t("الرئيسية", "Home") }, { href: "/transfers", label: t("الحوالات", "Transfers") }, { href: "/transfers/send-guide", label: t("الإرسال", "Send") }]} />
      <div className="mx-auto grid max-w-3xl gap-3 px-4 py-12">
        <p className="soft-card p-4">{t("تُنشأ الحوالة في الفرع. يسلّمك الموظف رقماً ورمزاً. لا يُرسل مبلغ من هذه الصفحة.", "A transfer is created at the branch. The teller gives you a reference and a code. This page does not send money.")}</p>
        <Link to="/branches" className="text-primary">{t("اختر الفرع", "Choose a branch")}</Link>
      </div>
    </div>
  );
}
