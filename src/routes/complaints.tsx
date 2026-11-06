import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { lookupComplaint, submitComplaint } from "@/lib/server/fns";
import type { ComplaintTrack } from "@/lib/domain";
import { useI18n } from "@/components/site/shell";
import { ErrorNote, Field, PageIntro, Panel, PrimaryButton, inputClass } from "@/components/site/ui";

export const Route = createFileRoute("/complaints")({
  head: () => ({
    meta: [
      { title: "الشكاوى | الخضر للصرافة" },
      { name: "description", content: "تقديم شكوى ومتابعة حالتها بالرقم والرمز. الرد لا يظهر إلا بعد التحقق." },
    ],
  }),
  component: ComplaintsPage,
});

const TOPICS = [
  ["service", "خدمة", "Service"],
  ["transfer", "حوالة", "Transfer"],
  ["branch", "فرع أو وكيل", "Branch or agent"],
  ["staff", "موظف", "Staff"],
  ["fraud", "اشتباه احتيال", "Suspected fraud"],
  ["other", "أخرى", "Other"],
] as const;

const STATUS: Record<string, [string, string]> = {
  received: ["وُجدت", "Received"],
  reviewing: ["قيد المراجعة", "In review"],
  closed: ["مغلقة", "Closed"],
};

function ComplaintsPage() {
  const { lang, t } = useI18n();
  const key = useRef(Math.random().toString(36).slice(2) + Date.now().toString(36));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [issued, setIssued] = useState<{ reference: string; pin: string } | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", topic: "service", message: "", companyWebsite: "" });
  const [trackRef, setTrackRef] = useState("");
  const [trackPin, setTrackPin] = useState("");
  const [trackError, setTrackError] = useState("");
  const [track, setTrack] = useState<ComplaintTrack | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      const result = await submitComplaint({ data: { ...form, idempotencyKey: key.current } });
      if (result.duplicate || !result.reference) {
        setError(t("أُرسل هذا النموذج من قبل. إن لم تحتفظ بالرمز قدّم طلباً جديداً من جلسة أخرى.", "This form was already sent. If you did not keep the code, submit again from a new session."));
        return;
      }
      setIssued({ reference: result.reference, pin: result.pin });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("تعذر الإرسال", "Could not send"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <PageIntro
        kicker={t("خدمة العملاء", "Customer desk")}
        title={t("الشكاوى والبلاغات", "Complaints")}
        body={t(
          "يُحفظ الطلب لدى خدمة العملاء. يظهر الرقم والرمز مرة واحدة. المتابعة لا تكشف نص الشكوى للزائر، بل الحالة والرد.",
          "The request is kept by customer service. The reference and code are shown once. Follow-up does not reveal the complaint text to a visitor, only the status and reply.",
        )}
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 lg:grid-cols-2">
        <Panel>
          {issued ? (
            <div>
              <h2 className="font-display text-2xl">{t("احتفظ بهذين الرقمين", "Keep both numbers")}</h2>
              <p className="mt-3 text-sm text-muted">{t("لن يُعرض الرمز مرة أخرى.", "The code will not be shown again.")}</p>
              <p className="mt-4 font-display text-3xl tabular-nums" id="complaint-ref">{issued.reference}</p>
              <p className="mt-1 font-display text-3xl tabular-nums">{issued.pin}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="min-h-11 rounded-full border border-line px-4 text-sm" onClick={() => navigator.clipboard.writeText(`${issued.reference} ${issued.pin}`)}>
                  {t("نسخ", "Copy")}
                </button>
                <button type="button" className="min-h-11 rounded-full border border-line px-4 text-sm" onClick={() => window.print()}>
                  {t("طباعة الإيصال", "Print the receipt")}
                </button>
              </div>
            </div>
          ) : (
            <form className="grid gap-3" onSubmit={onSubmit}>
              <Field label={t("الاسم", "Name")}>
                <input className={inputClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label={t("الهاتف", "Phone")}>
                <input className={inputClass} required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </Field>
              <Field label={t("البريد، اختياري", "Email, optional")}>
                <input className={inputClass} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label={t("النوع", "Topic")}>
                <select className={inputClass} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                  {TOPICS.map(([id, ar, en]) => <option key={id} value={id}>{lang === "ar" ? ar : en}</option>)}
                </select>
              </Field>
              <Field label={t("التفاصيل", "Details")}>
                <textarea className={`${inputClass} min-h-32 py-3`} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </Field>
              <label className="absolute -left-[9999px]" aria-hidden="true">
                Website
                <input tabIndex={-1} autoComplete="off" value={form.companyWebsite} onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })} />
              </label>
              {error ? <ErrorNote>{error}</ErrorNote> : null}
              <PrimaryButton type="submit" disabled={pending}>{pending ? t("جارٍ الإرسال…", "Sending…") : t("تسجيل الشكوى", "File the complaint")}</PrimaryButton>
            </form>
          )}
        </Panel>
        <Panel>
          <h2 className="font-display text-2xl">{t("متابعة شكوى", "Track a complaint")}</h2>
          <form
            className="mt-4 grid gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setTrackError("");
              setTrack(null);
              try {
                const next = await lookupComplaint({ data: { reference: trackRef, pin: trackPin } });
                setTrack(next);
                if (!next.ok) setTrackError(t("تعذر التحقق.", "Could not verify."));
              } catch (err) {
                setTrackError(err instanceof Error ? err.message : t("تعذر الاستعلام", "Lookup failed"));
              }
            }}
          >
            <Field label={t("رقم الشكوى", "Complaint number")}>
              <input className={inputClass} value={trackRef} onChange={(e) => setTrackRef(e.target.value)} autoComplete="off" />
            </Field>
            <Field label={t("الرمز", "Code")}>
              <input className={inputClass} value={trackPin} onChange={(e) => setTrackPin(e.target.value)} inputMode="numeric" autoComplete="off" />
            </Field>
            {trackError ? <ErrorNote>{trackError}</ErrorNote> : null}
            <PrimaryButton type="submit">{t("عرض الحالة", "Show status")}</PrimaryButton>
          </form>
          {track?.ok ? (
            <div className="mt-4 rounded-2xl bg-paper p-4">
              <p className="font-display text-3xl">{lang === "ar" ? STATUS[track.status]?.[0] : STATUS[track.status]?.[1]}</p>
              <p className="mt-2 text-sm">{track.reply || t("لا رد منشوراً بعد.", "No reply published yet.")}</p>
              <p className="mt-2 text-xs tabular-nums text-muted">{track.createdAt}</p>
            </div>
          ) : null}
        </Panel>
      </div>
    </div>
  );
}
