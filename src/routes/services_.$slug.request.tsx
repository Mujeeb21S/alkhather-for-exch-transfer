import { createFileRoute, notFound } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { getPublicHome, submitServiceRequest } from "@/lib/server/fns";
import { useI18n } from "@/components/site/shell";
import { ErrorNote, Field, PageIntro, PrimaryButton, inputClass } from "@/components/site/ui";

export const Route = createFileRoute("/services_/$slug/request")({
  loader: async ({ params }) => {
    if (params.slug !== "corporate" && params.slug !== "humanitarian") throw notFound();
    const home = await getPublicHome();
    return { slug: params.slug, channelAr: home.settings.secureChannelAr, channelEn: home.settings.secureChannelEn };
  },
  head: () => ({ meta: [{ title: "طلب خدمة | الخضر للصرافة" }, { name: "description", content: "طلب تواصل للشركات أو المنظمات. لا تُرفع كشوف مستفيدين من الموقع." }] }),
  component: RequestPage,
});

function RequestPage() {
  const data = Route.useLoaderData();
  const { lang, t } = useI18n();
  const key = useRef(Math.random().toString(36).slice(2) + Date.now().toString(36));
  const [form, setForm] = useState({ orgName: "", delegateName: "", phone: "", city: "", need: "", companyWebsite: "" });
  const [error, setError] = useState("");
  const [issued, setIssued] = useState<{ reference: string; pin: string } | null>(null);
  const [pending, setPending] = useState(false);
  const channel = lang === "ar" ? data.channelAr : data.channelEn;
  return (
    <div>
      <PageIntro
        title={data.slug === "corporate" ? t("طلب الشركات", "Corporate request") : t("طلب المنظمات", "Organization request")}
        kicker={t("الخدمات", "Services")}
        body={t("لا يُرفع كشف أسماء من هذه الصفحة.", "Do not upload a list of names from this page.")}
      />
      <form className="mx-auto grid max-w-xl gap-3 px-4 py-12" onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError("");
        try {
          const result = await submitServiceRequest({ data: { ...form, kind: data.slug, idempotencyKey: key.current } });
          if (!result.reference) setError(t("أُرسل الطلب من قبل.", "This request was already sent."));
          else setIssued({ reference: result.reference, pin: result.pin });
        } catch (err) {
          setError(err instanceof Error ? err.message : t("تعذر الإرسال", "Could not send"));
        } finally {
          setPending(false);
        }
      }}>
        {issued ? (
          <div className="soft-card p-5">
            <p className="font-display text-3xl tabular-nums">{issued.reference}</p>
            <p className="mt-2 font-display text-3xl tabular-nums">{issued.pin}</p>
          </div>
        ) : (
          <>
            <Field label={t("اسم الجهة", "Organization")}><input className={inputClass} required value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })} /></Field>
            <Field label={t("المفوّض", "Authorized person")}><input className={inputClass} required value={form.delegateName} onChange={(e) => setForm({ ...form, delegateName: e.target.value })} /></Field>
            <Field label={t("هاتف المفوّض", "Phone")}><input className={inputClass} required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label={t("المدينة", "City")}><input className={inputClass} required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
            <Field label={t("نوع الاحتياج", "Need")}><textarea className={`${inputClass} min-h-28 py-3`} required value={form.need} onChange={(e) => setForm({ ...form, need: e.target.value })} /></Field>
            <input className="hidden" tabIndex={-1} autoComplete="off" value={form.companyWebsite} onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })} />
            {channel ? <p className="text-sm text-muted">{channel}</p> : null}
            {error ? <ErrorNote>{error}</ErrorNote> : null}
            <PrimaryButton type="submit" disabled={pending}>{t("إرسال الطلب", "Send the request")}</PrimaryButton>
          </>
        )}
      </form>
    </div>
  );
}
