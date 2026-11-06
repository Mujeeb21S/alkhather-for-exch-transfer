import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  attachTransfer,
  createTicket,
  myNotices,
  myTickets,
  myTransfers,
  readNotice,
  saveProfile,
  syncProfile,
} from "@/lib/server/fns";
import type { Notice, OwnedTransfer, Profile, Ticket } from "@/lib/domain";
import { useI18n } from "@/components/site/shell";
import { DemoMark, EmptyState, ErrorNote, Field, PrimaryButton, inputClass } from "@/components/site/ui";
import { formatMoney } from "@/lib/money";
import { roleLabel, statusLabel } from "@/lib/labels";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "بوابة العميل | الخضر للصرافة" },
      { name: "description", content: "الملف الشخصي، الحوالات المرتبطة، الإشعارات، وطلبات الدعم." },
    ],
  }),
  component: PortalPage,
});

type Tab = "home" | "transfers" | "notices" | "support" | "profile";

function PortalPage() {
  const { user, isPending } = useCurrentUserState();
  const { lang, t } = useI18n();
  const [tab, setTab] = useState<Tab>("home");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transfers, setTransfers] = useState<OwnedTransfer[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    let gone = false;
    setLoading(true);
    syncProfile({ data: { name: user.displayName ?? "" } })
      .then(async (next) => {
        if (gone) return;
        setProfile(next);
        const [a, b, c] = await Promise.all([myTransfers(), myNotices(), myTickets()]);
        if (gone) return;
        setTransfers(a);
        setNotices(b);
        setTickets(c);
      })
      .catch((err: unknown) => {
        if (!gone) setError(err instanceof Error ? err.message : "Error");
      })
      .finally(() => {
        if (!gone) setLoading(false);
      });
    return () => {
      gone = true;
    };
  }, [user?.id, user?.displayName]);

  if (isPending || (user && loading && !profile)) {
    return <div className="mx-auto max-w-5xl px-4 py-12"><div className="h-48 animate-pulse rounded-2xl bg-line" /></div>;
  }
  if (!user) return <RedirectToSignIn />;

  const tabs: [Tab, string][] = [
    ["home", t("ملخص", "Overview")],
    ["transfers", t("حوالاتي", "Transfers")],
    ["notices", t("الإشعارات", "Notices")],
    ["support", t("الدعم", "Support")],
    ["profile", t("الملف", "Profile")],
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm text-gold">{t("بوابة العميل", "Customer portal")}</p>
      <h1 className="mt-2 font-display text-4xl">{profile?.displayName || user.displayName || t("حسابي", "My account")}</h1>
      <p className="mt-2 text-sm text-muted">
        {t("الدور:", "Role:")} {roleLabel(profile?.role ?? "customer", lang)}.{" "}
        {t("التحقق برسالة نصية غير مفعّل حتى اعتماد مزوّد رسائل. رقم الهاتف المحفوظ ليس رقماً موثّقاً.", "SMS verification is off until a message provider is approved. A saved phone is not a verified phone.")}
      </p>
      {error ? <div className="mt-4"><ErrorNote>{error}</ErrorNote></div> : null}
      <div className="mt-6 flex gap-2 overflow-x-auto">
        {tabs.map(([id, label]) => (
          <button key={id} type="button" onClick={() => setTab(id)} className={`min-h-11 shrink-0 rounded-full px-4 text-sm ${tab === id ? "bg-primary text-surface" : "border border-line bg-surface"}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab === "home" ? (
          <div className="grid gap-4 md:grid-cols-3">
            <Stat label={t("حوالات مرتبطة", "Linked transfers")} value={String(transfers.length)} />
            <Stat label={t("إشعارات غير مقروءة", "Unread notices")} value={String(notices.filter((n) => !n.readAt).length)} />
            <Stat label={t("طلبات دعم", "Support requests")} value={String(tickets.length)} />
          </div>
        ) : null}
        {tab === "transfers" ? (
          <TransfersPanel
            rows={transfers}
            onLinked={setTransfers}
            lang={lang}
          />
        ) : null}
        {tab === "notices" ? <NoticesPanel rows={notices} onChange={setNotices} /> : null}
        {tab === "support" ? <SupportPanel rows={tickets} onChange={setTickets} /> : null}
        {tab === "profile" && profile ? <ProfilePanel profile={profile} onChange={setProfile} /> : null}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-display text-4xl tabular-nums">{value}</p>
    </div>
  );
}

function TransfersPanel({
  rows,
  onLinked,
  lang,
}: {
  rows: OwnedTransfer[];
  onLinked: (rows: OwnedTransfer[]) => void;
  lang: "ar" | "en";
}) {
  const { t } = useI18n();
  const [reference, setReference] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <div className="grid gap-4">
      <form
        className="grid gap-3 rounded-2xl border border-line bg-surface p-5 md:grid-cols-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setPending(true);
          setError("");
          try {
            onLinked(await attachTransfer({ data: { reference, pin } }));
            setReference("");
            setPin("");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Error");
          } finally {
            setPending(false);
          }
        }}
      >
        <Field label={t("رقم الحوالة", "Reference")}><input className={inputClass} value={reference} onChange={(e) => setReference(e.target.value)} /></Field>
        <Field label={t("رمز التحقق", "Code")}><input className={inputClass} value={pin} onChange={(e) => setPin(e.target.value)} /></Field>
        <div className="self-end">
          <PrimaryButton type="submit" disabled={pending}>{t("ربط بالحساب", "Link to account")}</PrimaryButton>
        </div>
        {error ? <div className="md:col-span-3"><ErrorNote>{error}</ErrorNote></div> : null}
      </form>
      {rows.length === 0 ? (
        <EmptyState title={t("لا حوالات مرتبطة", "No linked transfers")} body={t("الربط يتم برقم ورمز صحيحين. بعدها تظهر التفاصيل لصاحب الحساب فقط.", "Linking needs a valid reference and code. Details then appear only for this account.")} />
      ) : (
        <ul className="grid gap-3">
          {rows.map((row) => (
            <li key={row.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium tabular-nums">{row.reference}</p>
                <span>{statusLabel(row.status, lang)}</span>
                {row.demo ? <DemoMark>{t("تجريبي", "Sample")}</DemoMark> : null}
              </div>
              <p className="mt-2 tabular-nums">{formatMoney(row.amount)} {row.currency}</p>
              <p className="text-sm text-muted">{row.senderName} → {row.beneficiaryName}</p>
              <p className="text-sm text-muted">{lang === "ar" ? row.pickupCityAr : row.pickupCityEn} · {row.updatedAt}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NoticesPanel({ rows, onChange }: { rows: Notice[]; onChange: (rows: Notice[]) => void }) {
  const { lang, t } = useI18n();
  if (!rows.length) return <EmptyState title={t("لا إشعارات", "No notices")} body={t("يصل إشعار عند ربط حوالة أو عند رد الدعم.", "A notice arrives when a transfer is linked or support replies.")} />;
  return (
    <ul className="grid gap-3">
      {rows.map((row) => (
        <li key={row.id} className="rounded-2xl border border-line bg-surface p-5">
          <p className="font-medium">{lang === "ar" ? row.titleAr : row.titleEn}</p>
          <p className="mt-2 text-sm text-muted">{lang === "ar" ? row.bodyAr : row.bodyEn}</p>
          <p className="mt-2 text-xs text-muted tabular-nums">{row.createdAt}</p>
          {!row.readAt ? (
            <button type="button" className="mt-3 text-sm text-primary" onClick={() => void readNotice({ data: row.id }).then(onChange)}>
              {t("تعليم كمقروء", "Mark read")}
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function SupportPanel({ rows, onChange }: { rows: Ticket[]; onChange: (rows: Ticket[]) => void }) {
  const { t } = useI18n();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const key = `t-${subject.length}-${body.length}-${rows.length}`;
  return (
    <div className="grid gap-4">
      <form
        className="grid gap-3 rounded-2xl border border-line bg-surface p-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setPending(true);
          setError("");
          try {
            onChange(await createTicket({ data: { subject, body, key: `${Date.now()}-${subject.slice(0, 12)}` } }));
            setSubject("");
            setBody("");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Error");
          } finally {
            setPending(false);
          }
        }}
      >
        <Field label={t("الموضوع", "Subject")}><input className={inputClass} value={subject} onChange={(e) => setSubject(e.target.value)} /></Field>
        <Field label={t("التفاصيل", "Details")}><textarea className={`${inputClass} min-h-28 py-3`} value={body} onChange={(e) => setBody(e.target.value)} /></Field>
        {error ? <ErrorNote>{error}</ErrorNote> : null}
        <PrimaryButton type="submit" disabled={pending}>{t("إرسال طلب", "Send request")}</PrimaryButton>
        <span className="hidden">{key}</span>
      </form>
      <ul className="grid gap-3">
        {rows.map((row) => (
          <li key={row.id} className="rounded-2xl border border-line bg-surface p-5">
            <p className="font-medium">{row.subject}</p>
            <p className="mt-2 text-sm">{row.body}</p>
            <p className="mt-2 text-xs text-muted">{row.status} · {row.createdAt}</p>
            {row.reply ? <p className="mt-3 rounded-xl bg-paper p-3 text-sm">{row.reply}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProfilePanel({ profile, onChange }: { profile: Profile; onChange: (p: Profile) => void }) {
  const { t } = useI18n();
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [phone, setPhone] = useState(profile.phone);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  return (
    <form
      className="grid max-w-lg gap-3 rounded-2xl border border-line bg-surface p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setOk(false);
        try {
          onChange(await saveProfile({ data: { displayName, phone } }));
          setOk(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Error");
        }
      }}
    >
      <Field label={t("الاسم الظاهر", "Display name")}><input className={inputClass} value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></Field>
      <Field label={t("الهاتف", "Phone")}><input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
      {error ? <ErrorNote>{error}</ErrorNote> : null}
      {ok ? <p className="text-sm text-up">{t("حُفظ الملف. الهاتف غير موثّق.", "Saved. The phone is not verified.")}</p> : null}
      <PrimaryButton type="submit">{t("حفظ", "Save")}</PrimaryButton>
    </form>
  );
}
