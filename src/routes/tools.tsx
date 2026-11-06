import { createFileRoute } from "@tanstack/react-router";
import { getPublication } from "@/lib/server/fns";
import { useI18n } from "@/components/site/shell";
import { Fa } from "@/components/site/fa";
import { PageIntro } from "@/components/site/ui";

export const Route = createFileRoute("/tools")({
  loader: () => getPublication(),
  head: () => ({
    meta: [
      { title: "أدوات المتابعة | الخضر للصرافة" },
      { name: "description", content: "تتبع الحوالة، ودليل الإرسال والاستلام، وتقديم شكوى لدى الخضر للصرافة." },
    ],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  const data = Route.useLoaderData();
  const { t } = useI18n();
  const items = [
    ["/transfers/track", "magnifying-glass", t("تتبع حوالة", "Track a transfer"), t("الحالة والعملة ومدينة الاستلام فقط.", "Status, currency, and pickup city only.")],
    ["/transfers/receive-guide", "hand-holding-dollar", t("دليل الاستلام", "How to receive"), t("خطوات الاستلام في نقطة الخدمة.", "How pickup works at a service point.")],
    ["/transfers/send-guide", "paper-plane", t("دليل الإرسال", "How to send"), t("الحوالة تُنشأ في الفرع، لا من الموقع.", "A transfer is created at a branch, not on the site.")],
    ["/complaints", "comment-dots", t("شكوى أو مقترح", "Complaint or suggestion"), t("رقم متابعة بعد التسجيل.", "A follow-up number after you file it.")],
    ...(data.ratesLive
      ? [["/rates", "coins", t("الأسعار والمحوّل", "Rates and converter"), t("الأسعار المعتمدة حالياً.", "Rates currently published.")] as const]
      : []),
  ] as const;
  return (
    <div>
      <PageIntro
        kicker={t("أدوات", "Tools")}
        title={t("متابعة وتواصل", "Follow-up and contact")}
        crumbs={[{ href: "/", label: t("الرئيسية", "Home") }, { href: "/tools", label: t("أدوات", "Tools") }]}
      />
      <ul className="mx-auto grid max-w-3xl gap-3 px-4 py-12">
        {items.map(([href, icon, title, body]) => (
          <li key={href}>
            <a href={href} className="soft-card flex items-start gap-3 p-4">
              <Fa name={icon} className="mt-1 text-gold" />
              <span>
                <span className="block font-medium">{title}</span>
                <span className="mt-1 block text-sm text-muted">{body}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
