import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { getPublicHome, submitInquiry } from "@/lib/server/fns";
import { useI18n } from "@/components/site/shell";
import { ErrorNote, Field, PageIntro, Panel, PhoneLines, PrimaryButton, inputClass } from "@/components/site/ui";

export const Route = createFileRoute("/contact")({
  loader: () => getPublicHome(),
  head: () => ({
    meta: [
      { title: "تواصل | الخضر للصرافة" },
      { name: "description", content: "تواصل مع الخضر للصرافة. خدمة العملاء 712720300." },
      { property: "og:title", content: "تواصل | الخضر للصرافة" },
    ],
  }),
  component: ContactPage,
});

const TOPICS = [
  ["general", "استفسار عام", "General"],
  ["rates", "أسعار الصرف", "Rates"],
  ["transfer", "حوالة", "Transfer"],
  ["branch", "فرع أو وكيل", "Branch or agent"],
  ["corporate", "شركات وتجار", "Corporate"],
  ["complaint", "ملاحظة أو شكوى", "Complaint"],
] as const;

function ContactPage() {
  const { settings } = Route.useLoaderData();
  const { lang, t } = useI18n();
  const text = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const key = useRef(Math.random().toString(36).slice(2) + Date.now().toString(36));
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    topic: "general",
    message: "",
    companyWebsite: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      await submitInquiry({ data: { ...form, idempotencyKey: key.current } });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("تعذر الإرسال", "Could not send"));
    } finally {
      setPending(false);
    }
  }

  const channels = [
    [t("الهاتف", "Phone"), settings.phone],
    [t("البريد", "Email"), settings.email],
    [t("العنوان", "Address"), text(settings.addressAr, settings.addressEn)],
    [t("واتساب", "WhatsApp"), settings.whatsapp],
  ].filter(([, value]) => value.trim());

  return (
    <div>
      <PageIntro
        kicker={t("خدمة العملاء", "Customer desk")}
        title={t("تواصل معنا", "Contact")}
        body={text(settings.replySlaAr, settings.replySlaEn) || t("خدمة العملاء 712720300.", "Customer service 712720300.")}
        crumbs={[{ href: "/", label: t("الرئيسية", "Home") }, { href: "/contact", label: t("تواصل", "Contact") }]}
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 lg:grid-cols-5">
        <Panel className="lg:col-span-3">
          {done ? (
            <p className="text-lg">{t("وصل طلبك.", "Your request arrived.")}</p>
          ) : (
            <form className="grid gap-3" onSubmit={onSubmit}>
              <Field label={t("الاسم", "Name")}>
                <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </Field>
              <Field label={t("الهاتف", "Phone")}>
                <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </Field>
              <Field label={t("البريد، اختياري", "Email, optional")}>
                <input className={inputClass} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label={t("نوع الاستفسار", "Topic")}>
                <select className={inputClass} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                  {TOPICS.map(([id, ar, en]) => <option key={id} value={id}>{lang === "ar" ? ar : en}</option>)}
                </select>
              </Field>
              <Field label={t("الرسالة", "Message")}>
                <textarea className={`${inputClass} min-h-32 py-3`} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </Field>
              <input className="hidden" tabIndex={-1} autoComplete="off" value={form.companyWebsite} onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })} />
              {error ? <ErrorNote>{error}</ErrorNote> : null}
              <PrimaryButton type="submit" disabled={pending}>{pending ? t("جارٍ الإرسال…", "Sending…") : t("إرسال", "Send")}</PrimaryButton>
            </form>
          )}
        </Panel>
        <Panel className="lg:col-span-2">
          <p className="font-display text-3xl">712720300</p>
          <p className="mt-1 text-sm text-muted">{t("خدمة العملاء", "Customer service")}</p>
          <div className="mt-4 flex gap-3">
            <a href="tel:+967712720300" className="text-primary">{t("اتصال", "Call")}</a>
            <a href="https://wa.me/967712720300" className="text-primary">WhatsApp</a>
          </div>
          {channels.length ? (
            <ul className="mt-6 grid gap-3 text-sm">
              {channels.map(([label, value]) => <li key={label}><span className="text-muted">{label}</span><div>{value}</div></li>)}
            </ul>
          ) : null}
          <details className="mt-6 text-sm">
            <summary className="cursor-pointer font-medium">{t("أرقام الإدارة", "Administration numbers")}</summary>
            <PhoneLines value={"06304990 06304991 711555724 777555724"} />
          </details>
        </Panel>
      </div>
    </div>
  );
}
