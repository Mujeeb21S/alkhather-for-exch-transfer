import { createFileRoute, Link, Outlet, useChildMatches } from "@tanstack/react-router";
import { useI18n } from "@/components/site/shell";
import { Fa } from "@/components/site/fa";
import { TrackBox } from "@/components/site/tools";
import { PageIntro, Panel } from "@/components/site/ui";

export const Route = createFileRoute("/transfers")({
  head: () => ({
    meta: [
      { title: "الحوالات | الخضر للصرافة" },
      { name: "description", content: "استعلام عن حالة حوالة بالرقم ورمز التحقق. لا تُعرض أسماء الأطراف ولا المبلغ." },
    ],
  }),
  component: TransfersPage,
});

function TransfersPage() {
  const nested = useChildMatches().length > 0;
  const { t } = useI18n();
  const steps = [
    t("احتفظ بالرقم المرجعي ورمز التحقق الصادرين من نقطة الخدمة.", "Keep the reference and verification code issued at the service point."),
    t("أدخلهما معاً. النتيجة حالة وعملة ومدينة استلام إن وُجدت.", "Enter both. The result is status, currency, and payout city if any."),
    t("عند الجاهزية أظهر الهوية والرمز في المدينة الظاهرة.", "When it is ready, show identification and the code in the city shown."),
    t("إن وُجدت مشكلة استخدم مركز الشكاوى، لا تشارك الرمز في قناة غير معروفة.", "If there is a problem use the complaints desk. Do not share the code on an unknown channel."),
  ];
  if (nested) return <Outlet />;
  return (
    <div>
      <PageIntro
        kicker={t("متابعة", "Follow-up")}
        title={t("حالة الحوالة", "Transfer status")}
        crumbs={[{ href: "/", label: t("الرئيسية", "Home") }, { href: "/transfers", label: t("الحوالات", "Transfers") }]}
        body={t(
          "يظهر بعد التحقق: الحالة، العملة، مدينة الاستلام، وتاريخ التحديث، مع تعليمات عامة. لا يظهر الاسم ولا المبلغ.",
          "After verification you see status, currency, payout city, and the update time, plus general instructions. Name and amount stay hidden.",
        )}
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-1 inline-flex items-center gap-2 font-display text-2xl">
            <Fa name="lock" className="text-gold" />
            {t("الاستعلام", "Lookup")}
          </h2>
          <p className="mb-4 rounded-2xl bg-gold-soft/40 px-3 py-3 text-sm text-primary">
            <Fa name="shield-halved" className="me-2" />
            {t("الخصوصية: يُطلب الرقم والرمز معاً. لا يُعرض الاسم ولا المبلغ ولا بيانات الطرف الآخر.", "Privacy: both the reference and the code are required. Name, amount, and the other party stay hidden.")}
          </p>
          <TrackBox />
        </Panel>
        <Panel>
          <h2 className="inline-flex items-center gap-2 font-display text-2xl">
            <Fa name="circle-question" className="text-gold" />
            {t("كيف يتم الاستلام", "How pickup works")}
          </h2>
          <ol className="mt-4 grid gap-3">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs text-surface tabular-nums">{index + 1}</span>
                <span className="pt-1">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link to="/transfers/receive-guide" className="text-primary underline-offset-4 hover:underline">{t("دليل الاستلام", "Receive guide")}</Link>
            <Link to="/transfers/send-guide" className="text-primary underline-offset-4 hover:underline">{t("دليل الإرسال", "Send guide")}</Link>
            <Link to="/tools" className="text-primary underline-offset-4 hover:underline">{t("كل الأدوات", "All tools")}</Link>
          </p>
        </Panel>
      </div>
    </div>
  );
}
