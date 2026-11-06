import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getJobs, submitApplication } from "@/lib/server/fns";
import { useI18n } from "@/components/site/shell";
import { EmptyState, ErrorNote, Field, PageIntro, PrimaryButton, inputClass } from "@/components/site/ui";

export const Route = createFileRoute("/careers")({
  loader: () => getJobs(),
  head: () => ({
    meta: [
      { title: "الوظائف | الخضر للصرافة" },
      { name: "description", content: "الوظائف المنشورة لدى الخضر للصرافة والتحويلات." },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  const jobs = Route.useLoaderData();
  const { lang, t } = useI18n();
  const text = (ar: string, en: string) => (lang === "ar" ? ar : en);
  return (
    <div>
      <PageIntro
        kicker={t("العمل", "Work")}
        title={t("الوظائف", "Careers")}
        body={t("لا تُنشر وظيفة إلا بعد أن تعتمدها الإدارة. التقديم يصل إلى سجل الطلبات ولا يُنشئ عقداً.", "A role is published only after an administrator approves it. An application is stored. It does not create a contract.")}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {jobs.length === 0 ? (
          <EmptyState
            title={t("لا شواغر منشورة", "No published roles")}
            body={t("عند فتح وظيفة حقيقية ستظهر هنا مع مدينة التقديم ووصفه.", "When a real role opens it will appear here with its city and description.")}
          />
        ) : (
          <ul className="grid gap-4">
            {jobs.map((job) => <JobCard key={job.id} id={job.id} title={text(job.titleAr, job.titleEn)} city={text(job.cityAr, job.cityEn)} body={text(job.bodyAr, job.bodyEn)} />)}
          </ul>
        )}
      </div>
    </div>
  );
}

function JobCard({ id, title, city, body }: { id: number; title: string; city: string; body: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  return (
    <li className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="font-display text-2xl">{title}</h2>
      {city ? <p className="mt-1 text-sm text-gold">{city}</p> : null}
      <p className="mt-3 whitespace-pre-wrap text-sm text-muted">{body}</p>
      {done ? (
        <p className="mt-4 text-sm">{t("وصل طلبك إلى سجل التوظيف.", "Your application reached the hiring record.")}</p>
      ) : open ? (
        <form
          className="mt-4 grid gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            try {
              await submitApplication({ data: { jobId: id, ...form } });
              setDone(true);
            } catch (err) {
              setError(err instanceof Error ? err.message : t("تعذر الإرسال", "Could not send"));
            }
          }}
        >
          <Field label={t("الاسم", "Name")}><input className={inputClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label={t("الهاتف", "Phone")}><input className={inputClass} required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label={t("البريد", "Email")}><input className={inputClass} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label={t("نبذة", "Note")}><textarea className={`${inputClass} min-h-24 py-3`} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></Field>
          {error ? <ErrorNote>{error}</ErrorNote> : null}
          <PrimaryButton type="submit">{t("إرسال الطلب", "Send application")}</PrimaryButton>
        </form>
      ) : (
        <button type="button" className="mt-4 min-h-11 text-sm text-primary underline-offset-4 hover:underline" onClick={() => setOpen(true)}>
          {t("تقديم", "Apply")}
        </button>
      )}
    </li>
  );
}
