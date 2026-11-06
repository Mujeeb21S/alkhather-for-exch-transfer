import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { adminNetworksAct, adminNetworksDesk } from "@/lib/server/fns";
import { useI18n } from "@/components/site/shell";
import { ErrorNote, Field, PrimaryButton, inputClass } from "@/components/site/ui";

export const Route = createFileRoute("/admin/networks")({
  head: () => ({
    meta: [
      { title: "شبكات التحويل والشركاء | الخضر للصرافة" },
      { name: "description", content: "وحدة إدارة شبكات التحويل والشركاء الماليين والتسويات." },
    ],
  }),
  component: NetworksDesk,
});

type Desk = Awaited<ReturnType<typeof adminNetworksDesk>>;
type Row = Record<string, unknown>;

const SECTIONS = [
  ["dash", "المؤشرات"],
  ["networks", "الشبكات"],
  ["partners", "الشركاء"],
  ["links", "العلاقات"],
  ["corridors", "الممرات"],
  ["fees", "العمولات"],
  ["balances", "الأرصدة والتسويات"],
  ["agreements", "الاتفاقيات"],
  ["tech", "الربط التقني"],
  ["services", "خدمات الشبكات"],
  ["reports", "التقارير"],
] as const;

const KINDS: Record<string, string> = {
  local_ye: "محلية يمنية",
  international: "دولية",
  regional: "إقليمية",
  banking: "مصرفية",
  ewallet: "إلكترونية / محافظ",
};
const PTR: Record<string, string> = {
  exchange: "شركة صرافة",
  bank_local: "بنك محلي",
  bank_intl: "بنك دولي",
  mto: "شركة تحويل",
  ewallet: "محفظة إلكترونية",
  agent: "وكيل معتمد",
  correspondent: "مراسل مالي",
  intermediary: "مؤسسة وسيطة",
};
const STATUS: Record<string, string> = {
  active: "نشطة",
  inactive: "غير نشطة",
  pending: "قيد التفعيل",
  suspended: "معلقة مؤقتاً",
  stopped: "متوقفة",
  expired: "منتهية الاتفاقية",
};
const SVC: Record<string, string> = {
  send: "إرسال حوالة",
  receive: "استلام حوالة",
  account: "تحويل بين الحسابات",
  bank: "تحويل إلى حساب بنكي",
  wallet: "تحويل إلى محفظة",
  international: "تحويل دولي",
  local: "تحويل محلي",
  inquiry: "استعلام عن حوالة",
  cancel: "إلغاء وفق شروط الشبكة",
  refund: "استرداد وفق شروط الشبكة",
};

function s(row: Row, key: string) {
  return String(row[key] ?? "");
}
function n(row: Row, key: string) {
  return Number(row[key] ?? 0);
}
function on(row: Row, key: string) {
  return Boolean(row[key]);
}

function NetworksDesk() {
  const { user, isPending } = useCurrentUserState();
  const { t } = useI18n();
  const [desk, setDesk] = useState<Desk | null>(null);
  const [error, setError] = useState("");
  const [section, setSection] = useState<(typeof SECTIONS)[number][0]>("dash");
  const [includeDemo, setIncludeDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    let gone = false;
    adminNetworksDesk()
      .then((data) => {
        if (!gone) setDesk(data);
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
  }, [user?.id]);

  async function act(action: Record<string, unknown>) {
    setError("");
    const next = await adminNetworksAct({ data: action });
    if (next && typeof next === "object" && "networks" in next) setDesk(next as Desk);
    return next;
  }

  if (isPending || (user && loading)) return <div className="mx-auto max-w-6xl px-4 py-12"><div className="h-48 animate-pulse rounded-2xl bg-line" /></div>;
  if (!user) return <RedirectToSignIn />;
  if (!desk) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <ErrorNote>{error || t("تعذر فتح الوحدة", "The module could not be opened")}</ErrorNote>
        <Link to="/admin" className="mt-4 inline-flex text-sm text-primary">العودة للوحة الإدارة</Link>
      </div>
    );
  }

  const live = (row: Row) => includeDemo || !on(row, "is_demo");
  const networks = (desk.networks as Row[]).filter(live);
  const partners = (desk.partners as Row[]).filter(live);
  const transfers = (desk.transfers as Row[]).filter(live);
  const agreements = (desk.agreements as Row[]).filter(live);
  const posted = transfers.filter((row) => s(row, "status") === "posted");
  const expiring = agreements.filter((row) => {
    if (s(row, "status") !== "active" || !s(row, "ends_on")) return false;
    const days = (Date.parse(s(row, "ends_on")) - Date.now()) / 86400000;
    return days >= 0 && days <= n(row, "alert_days");
  });
  const partnerDues = sumSigned(desk.entries as Row[], "PTR:", includeDemo, true);
  const floats = sumSigned(desk.entries as Row[], "NET:", includeDemo, false);
  const commissions = posted.reduce((sum, row) => sum + Number(s(row, "company_share") || 0), 0);
  const pendingSettlements = (desk.settlements as Row[]).filter((row) => live(row) && s(row, "status") !== "approved").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/admin" className="text-sm text-primary">لوحة الإدارة</Link>
      <h1 className="mt-2 font-display text-4xl">شبكات التحويل والشركاء</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        السجل التشغيلي للشبكات والشركاء والممرات والعمولات والتسويات. منفصل عن شركاء الصفحة العامة. السجل التجريبي لا يدخل المؤشرات إلا إذا أظهرته. لا تُحذف القيود المالية، ومفتاح الربط لا يُعرض بعد حفظه.
      </p>
      <label className="mt-4 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={includeDemo} onChange={(event) => setIncludeDemo(event.target.checked)} />
        إظهار السجلات التجريبية
      </label>
      {error ? <div className="mt-4"><ErrorNote>{error}</ErrorNote></div> : null}
      {desk.vaultDemo ? <p className="mt-3 text-xs text-muted">مفاتيح الربط تُشفَّر بمفتاح تجريبي لأن NETWORK_VAULT_KEY غير مضبوط. لا يُستخدم هذا المفتاح في الإنتاج.</p> : null}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {SECTIONS.map(([id, label]) => (
          <button key={id} type="button" onClick={() => setSection(id)} className={`min-h-11 shrink-0 rounded-full px-4 text-sm ${section === id ? "bg-primary text-surface" : "border border-line bg-surface"}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {section === "dash" ? (
          <Dashboard
            tiles={[
              ["شبكات مسجلة", networks.length],
              ["شبكات محلية", networks.filter((row) => s(row, "kind") === "local_ye").length],
              ["شبكات دولية", networks.filter((row) => s(row, "kind") === "international").length],
              ["شركات صرافة", partners.filter((row) => s(row, "kind") === "exchange").length],
              ["بنوك شريكة", partners.filter((row) => s(row, "kind") === "bank_local" || s(row, "kind") === "bank_intl").length],
              ["وكلاء ومراسلون", partners.filter((row) => s(row, "kind") === "agent" || s(row, "kind") === "correspondent").length],
              ["شبكات نشطة", networks.filter((row) => s(row, "status") === "active").length],
              ["شبكات موقوفة", networks.filter((row) => s(row, "status") === "stopped" || s(row, "status") === "suspended").length],
              ["حوالات مرحّلة", posted.length],
              ["عمولات مكتسبة", commissions.toFixed(2)],
              ["مستحقات شركاء", partnerDues.toFixed(2)],
              ["أرصدة لدى الشبكات", floats.toFixed(2)],
              ["تسويات معلقة", pendingSettlements],
              ["اتفاقيات قاربت على الانتهاء", expiring.length],
            ]}
            byKind={countBy(networks, (row) => KINDS[s(row, "kind")] || s(row, "kind"))}
            byCountry={countBy(partners, (row) => s(row, "country") || "غير محددة")}
            byNetwork={volumeBy(posted, networks)}
            months={monthBars(posted)}
            expiring={expiring}
          />
        ) : null}
        {section === "networks" ? <NetworkForm desk={desk} rows={desk.networks as Row[]} act={act} error={setError} /> : null}
        {section === "partners" ? <PartnerForm rows={desk.partners as Row[]} act={act} error={setError} /> : null}
        {section === "links" ? <LinkForm desk={desk} act={act} error={setError} /> : null}
        {section === "corridors" ? <CorridorForm desk={desk} act={act} error={setError} /> : null}
        {section === "fees" ? <FeeForm desk={desk} act={act} error={setError} /> : null}
        {section === "balances" ? <BalanceDesk desk={desk} includeDemo={includeDemo} act={act} error={setError} /> : null}
        {section === "agreements" ? <AgreementForm desk={desk} expiring={expiring} act={act} error={setError} /> : null}
        {section === "tech" ? <TechForm desk={desk} act={act} error={setError} /> : null}
        {section === "services" ? <ServiceMatrix desk={desk} act={act} error={setError} /> : null}
        {section === "reports" ? <Reports desk={desk} includeDemo={includeDemo} /> : null}
      </div>
    </div>
  );
}

function sumSigned(entries: Row[], prefix: string, includeDemo: boolean, creditNormal: boolean) {
  return entries.reduce((sum, row) => {
    if (!s(row, "account_code").startsWith(prefix)) return sum;
    if (!includeDemo && on(row, "is_demo")) return sum;
    const debit = Number(s(row, "debit") || 0);
    const credit = Number(s(row, "credit") || 0);
    return sum + (creditNormal ? credit - debit : debit - credit);
  }, 0);
}

function countBy(rows: Row[], label: (row: Row) => string) {
  const map = new Map<string, number>();
  for (const row of rows) map.set(label(row), (map.get(label(row)) ?? 0) + 1);
  return [...map.entries()].map(([name, value]) => ({ name, value }));
}

function volumeBy(transfers: Row[], networks: Row[]) {
  const names = new Map(networks.map((row) => [n(row, "id"), s(row, "name_ar")]));
  const map = new Map<string, number>();
  for (const row of transfers) {
    const name = names.get(n(row, "network_id")) || "شبكة";
    map.set(name, (map.get(name) ?? 0) + Number(s(row, "amount") || 0));
  }
  return [...map.entries()].map(([name, value]) => ({ name, value }));
}

function monthBars(transfers: Row[]) {
  const map = new Map<string, { out: number; in: number }>();
  for (const row of transfers) {
    const month = s(row, "created_at").slice(0, 7) || "—";
    const bag = map.get(month) ?? { out: 0, in: 0 };
    const amount = Number(s(row, "amount") || 0);
    if (s(row, "direction") === "in") bag.in += amount;
    else bag.out += amount;
    map.set(month, bag);
  }
  return [...map.entries()].map(([name, value]) => ({ name, value: value.out + value.in, hint: `صادر ${value.out.toFixed(0)} / وارد ${value.in.toFixed(0)}` }));
}

function Dashboard({
  tiles,
  byKind,
  byCountry,
  byNetwork,
  months,
  expiring,
}: {
  tiles: [string, number | string][];
  byKind: { name: string; value: number }[];
  byCountry: { name: string; value: number }[];
  byNetwork: { name: string; value: number }[];
  months: { name: string; value: number; hint: string }[];
  expiring: Row[];
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 font-display text-3xl tabular-nums">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="توزيع الشبكات حسب النوع"><Bars items={byKind} /></Panel>
        <Panel title="توزيع الشركاء حسب الدولة"><Bars items={byCountry} /></Panel>
        <Panel title="حجم التحويلات حسب الشبكة"><Bars items={byNetwork} /></Panel>
        <Panel title="الصادر والوارد عبر الزمن"><Bars items={months} /></Panel>
      </div>
      <Panel title="اتفاقيات قاربت على الانتهاء">
        {expiring.length === 0 ? <p className="text-sm text-muted">لا اتفاقية تشغيلية تنتهي خلال مهلة التنبيه.</p> : (
          <ul className="grid gap-2 text-sm">
            {expiring.map((row) => <li key={s(row, "id")}>{s(row, "code")} — حتى {s(row, "ends_on")}</li>)}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function Bars({ items }: { items: { name: string; value: number; hint?: string }[] }) {
  const max = Math.max(1, ...items.map((item) => item.value));
  if (!items.length) return <p className="text-sm text-muted">لا بيانات ضمن هذا المرشح.</p>;
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item.name}>
          <div className="flex justify-between gap-3 text-sm">
            <span>{item.name}</span>
            <span className="tabular-nums text-muted">{item.hint || item.value}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-paper">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(4, (item.value / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-4">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function useForm(initial: Record<string, string>) {
  const [form, setForm] = useState(initial);
  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  return { form, set, reset: setForm };
}

function NetworkForm({ rows, act, error }: { desk: Desk; rows: Row[]; act: (action: Record<string, unknown>) => Promise<unknown>; error: (msg: string) => void }) {
  const blank = { id: "", code: "", nameAr: "", nameEn: "", logoUrl: "", kind: "local_ye", country: "", ownerName: "", operatorName: "", website: "", phone: "", email: "", address: "", coverage: "", currencies: "", transferTypes: "", feeNote: "", commissionNote: "", startedOn: "", agreementEndsOn: "", status: "pending", notes: "", demo: "" };
  const { form, set, reset } = useForm(blank);
  return (
    <div className="grid gap-4">
      <Panel title={form.id ? `تعديل شبكة ${form.code}` : "شبكة جديدة"}>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="الرقم التعريفي"><input className={inputClass} value={form.code} onChange={(e) => set("code", e.target.value)} /></Field>
          <Field label="الاسم بالعربية"><input className={inputClass} value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} /></Field>
          <Field label="الاسم بالإنجليزية"><input className={inputClass} value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} /></Field>
          <Field label="رابط الشعار"><input className={inputClass} value={form.logoUrl} onChange={(e) => set("logoUrl", e.target.value)} placeholder="https://" /></Field>
          <Field label="النوع"><Select value={form.kind} onChange={(value) => set("kind", value)} options={KINDS} /></Field>
          <Field label="الحالة"><Select value={form.status} onChange={(value) => set("status", value)} options={STATUS} /></Field>
          <Field label="الدولة الرئيسية"><input className={inputClass} value={form.country} onChange={(e) => set("country", e.target.value)} /></Field>
          <Field label="الشركة المالكة"><input className={inputClass} value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} /></Field>
          <Field label="الشركة المشغلة"><input className={inputClass} value={form.operatorName} onChange={(e) => set("operatorName", e.target.value)} /></Field>
          <Field label="الموقع"><input className={inputClass} value={form.website} onChange={(e) => set("website", e.target.value)} /></Field>
          <Field label="الهاتف"><input className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
          <Field label="البريد"><input className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="العنوان"><input className={inputClass} value={form.address} onChange={(e) => set("address", e.target.value)} /></Field>
          <Field label="دول التغطية"><input className={inputClass} value={form.coverage} onChange={(e) => set("coverage", e.target.value)} /></Field>
          <Field label="العملات"><input className={inputClass} value={form.currencies} onChange={(e) => set("currencies", e.target.value)} placeholder="YER,SAR" /></Field>
          <Field label="أنواع الحوالات"><input className={inputClass} value={form.transferTypes} onChange={(e) => set("transferTypes", e.target.value)} /></Field>
          <Field label="رسوم التحويل"><input className={inputClass} value={form.feeNote} onChange={(e) => set("feeNote", e.target.value)} /></Field>
          <Field label="نظام العمولة"><input className={inputClass} value={form.commissionNote} onChange={(e) => set("commissionNote", e.target.value)} /></Field>
          <Field label="بدء التعامل"><input className={inputClass} type="date" value={form.startedOn} onChange={(e) => set("startedOn", e.target.value)} /></Field>
          <Field label="انتهاء الاتفاقية"><input className={inputClass} type="date" value={form.agreementEndsOn} onChange={(e) => set("agreementEndsOn", e.target.value)} /></Field>
          <Field label="ملاحظات"><input className={inputClass} value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.demo === "1"} onChange={(e) => set("demo", e.target.checked ? "1" : "")} /> سجل تجريبي</label>
        </div>
        <div className="mt-4 flex gap-2">
          <PrimaryButton onClick={() => act({ type: "save-network", ...form, id: Number(form.id || 0), demo: form.demo === "1" }).catch((err: unknown) => error(err instanceof Error ? err.message : "Error"))}>حفظ</PrimaryButton>
          <button type="button" className="min-h-11 rounded-full border border-line px-4 text-sm" onClick={() => reset(blank)}>جديد</button>
        </div>
      </Panel>
      <Table
        columns={["الرمز", "الاسم", "النوع", "الحالة", "الدولة"]}
        rows={rows.map((row) => [s(row, "code"), s(row, "name_ar"), KINDS[s(row, "kind")] || "", STATUS[s(row, "status")] || "", s(row, "country") + (on(row, "is_demo") ? " · تجريبي" : "")])}
        onPick={(index) => {
          const row = rows[index];
          reset({
            id: s(row, "id"), code: s(row, "code"), nameAr: s(row, "name_ar"), nameEn: s(row, "name_en"), logoUrl: s(row, "logo_url"),
            kind: s(row, "kind"), country: s(row, "country"), ownerName: s(row, "owner_name"), operatorName: s(row, "operator_name"),
            website: s(row, "website"), phone: s(row, "phone"), email: s(row, "email"), address: s(row, "address"), coverage: s(row, "coverage"),
            currencies: s(row, "currencies"), transferTypes: s(row, "transfer_types"), feeNote: s(row, "fee_note"), commissionNote: s(row, "commission_note"),
            startedOn: s(row, "started_on").slice(0, 10), agreementEndsOn: s(row, "agreement_ends_on").slice(0, 10), status: s(row, "status"), notes: s(row, "notes"),
            demo: on(row, "is_demo") ? "1" : "",
          });
        }}
      />
    </div>
  );
}

function PartnerForm({ rows, act, error }: { rows: Row[]; act: (action: Record<string, unknown>) => Promise<unknown>; error: (msg: string) => void }) {
  const blank = { id: "", code: "", tradeName: "", legalName: "", logoUrl: "", kind: "exchange", country: "", city: "", address: "", phones: "", email: "", website: "", contactName: "", contactInfo: "", licenseNo: "", regulator: "", relationStartedOn: "", agreementOn: "", agreementEndsOn: "", status: "pending", documents: "", notes: "", demo: "" };
  const { form, set, reset } = useForm(blank);
  return (
    <div className="grid gap-4">
      <Panel title={form.id ? `ملف ${form.tradeName}` : "شريك جديد"}>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="رقم الشريك"><input className={inputClass} value={form.code} onChange={(e) => set("code", e.target.value)} /></Field>
          <Field label="الاسم التجاري"><input className={inputClass} value={form.tradeName} onChange={(e) => set("tradeName", e.target.value)} /></Field>
          <Field label="الاسم القانوني"><input className={inputClass} value={form.legalName} onChange={(e) => set("legalName", e.target.value)} /></Field>
          <Field label="الشعار"><input className={inputClass} value={form.logoUrl} onChange={(e) => set("logoUrl", e.target.value)} /></Field>
          <Field label="النوع"><Select value={form.kind} onChange={(value) => set("kind", value)} options={PTR} /></Field>
          <Field label="الحالة"><Select value={form.status} onChange={(value) => set("status", value)} options={STATUS} /></Field>
          <Field label="الدولة"><input className={inputClass} value={form.country} onChange={(e) => set("country", e.target.value)} /></Field>
          <Field label="المدينة"><input className={inputClass} value={form.city} onChange={(e) => set("city", e.target.value)} /></Field>
          <Field label="العنوان"><input className={inputClass} value={form.address} onChange={(e) => set("address", e.target.value)} /></Field>
          <Field label="الهواتف"><input className={inputClass} value={form.phones} onChange={(e) => set("phones", e.target.value)} /></Field>
          <Field label="البريد"><input className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="الموقع"><input className={inputClass} value={form.website} onChange={(e) => set("website", e.target.value)} /></Field>
          <Field label="المسؤول"><input className={inputClass} value={form.contactName} onChange={(e) => set("contactName", e.target.value)} /></Field>
          <Field label="بيانات التواصل"><input className={inputClass} value={form.contactInfo} onChange={(e) => set("contactInfo", e.target.value)} /></Field>
          <Field label="رقم الترخيص"><input className={inputClass} value={form.licenseNo} onChange={(e) => set("licenseNo", e.target.value)} placeholder="إن وُجد" /></Field>
          <Field label="الجهة الرقابية"><input className={inputClass} value={form.regulator} onChange={(e) => set("regulator", e.target.value)} /></Field>
          <Field label="بدء العلاقة"><input className={inputClass} type="date" value={form.relationStartedOn} onChange={(e) => set("relationStartedOn", e.target.value)} /></Field>
          <Field label="تاريخ الاتفاقية"><input className={inputClass} type="date" value={form.agreementOn} onChange={(e) => set("agreementOn", e.target.value)} /></Field>
          <Field label="انتهاء الاتفاقية"><input className={inputClass} type="date" value={form.agreementEndsOn} onChange={(e) => set("agreementEndsOn", e.target.value)} /></Field>
          <Field label="مستندات (روابط)"><input className={inputClass} value={form.documents} onChange={(e) => set("documents", e.target.value)} /></Field>
          <Field label="ملاحظات"><input className={inputClass} value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.demo === "1"} onChange={(e) => set("demo", e.target.checked ? "1" : "")} /> تجريبي</label>
        </div>
        <div className="mt-4">
          <PrimaryButton onClick={() => act({ type: "save-partner", ...form, id: Number(form.id || 0), demo: form.demo === "1" }).catch((err: unknown) => error(err instanceof Error ? err.message : "Error"))}>حفظ الشريك</PrimaryButton>
        </div>
      </Panel>
      <Table
        columns={["الرقم", "الاسم", "النوع", "الدولة", "الحالة"]}
        rows={rows.map((row) => [s(row, "code"), s(row, "trade_name"), PTR[s(row, "kind")] || "", s(row, "country"), STATUS[s(row, "status")] || ""])}
        onPick={(index) => {
          const row = rows[index];
          reset({
            id: s(row, "id"), code: s(row, "code"), tradeName: s(row, "trade_name"), legalName: s(row, "legal_name"), logoUrl: s(row, "logo_url"),
            kind: s(row, "kind"), country: s(row, "country"), city: s(row, "city"), address: s(row, "address"), phones: s(row, "phones"),
            email: s(row, "email"), website: s(row, "website"), contactName: s(row, "contact_name"), contactInfo: s(row, "contact_info"),
            licenseNo: s(row, "license_no"), regulator: s(row, "regulator"), relationStartedOn: s(row, "relation_started_on").slice(0, 10),
            agreementOn: s(row, "agreement_on").slice(0, 10), agreementEndsOn: s(row, "agreement_ends_on").slice(0, 10), status: s(row, "status"),
            documents: s(row, "documents"), notes: s(row, "notes"), demo: on(row, "is_demo") ? "1" : "",
          });
        }}
      />
    </div>
  );
}

function nameOf(rows: Row[], id: string, key = "name_ar") {
  return s(rows.find((row) => s(row, "id") === id) || {}, key);
}

function LinkForm({ desk, act, error }: { desk: Desk; act: (action: Record<string, unknown>) => Promise<unknown>; error: (msg: string) => void }) {
  const networks = desk.networks as Row[];
  const partners = desk.partners as Row[];
  const links = desk.links as Row[];
  const blank = { id: "", networkId: "", partnerId: "", services: "send,receive", currencies: "", minAmount: "", maxAmount: "", agreementRef: "", status: "active", notes: "", branchIds: "" };
  const { form, set, reset } = useForm(blank);
  return (
    <div className="grid gap-4">
      <Panel title="ربط شبكة بشريك">
        <p className="mb-3 text-sm text-muted">شبكة واحدة تتصل بعدة شركاء، والشريك بعدة شبكات وفروع. كل علاقة تحتفظ بخدماتها وعملاتها وحدودها.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="الشبكة"><EntitySelect rows={networks} labelKey="name_ar" value={form.networkId} onChange={(value) => set("networkId", value)} /></Field>
          <Field label="الشريك"><EntitySelect rows={partners} labelKey="trade_name" value={form.partnerId} onChange={(value) => set("partnerId", value)} /></Field>
          <Field label="الخدمات"><input className={inputClass} value={form.services} onChange={(e) => set("services", e.target.value)} /></Field>
          <Field label="العملات"><input className={inputClass} value={form.currencies} onChange={(e) => set("currencies", e.target.value)} /></Field>
          <Field label="الحد الأدنى"><input className={inputClass} value={form.minAmount} onChange={(e) => set("minAmount", e.target.value)} /></Field>
          <Field label="الحد الأعلى"><input className={inputClass} value={form.maxAmount} onChange={(e) => set("maxAmount", e.target.value)} /></Field>
          <Field label="مرجع الاتفاقية"><input className={inputClass} value={form.agreementRef} onChange={(e) => set("agreementRef", e.target.value)} /></Field>
          <Field label="الفروع (أرقام مفصولة)"><input className={inputClass} value={form.branchIds} onChange={(e) => set("branchIds", e.target.value)} placeholder={(desk.branches as Row[]).map((row) => `${s(row, "id")} ${s(row, "name_ar")}`).join(" · ")} /></Field>
          <Field label="الحالة"><Select value={form.status} onChange={(value) => set("status", value)} options={{ active: "نشطة", inactive: "غير نشطة", pending: "قيد التفعيل", suspended: "معلقة" }} /></Field>
          <Field label="ملاحظات"><input className={inputClass} value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
        </div>
        <div className="mt-4"><PrimaryButton onClick={() => act({ type: "save-link", ...form, id: Number(form.id || 0) }).catch((err: unknown) => error(err instanceof Error ? err.message : "Error"))}>حفظ العلاقة</PrimaryButton></div>
      </Panel>
      <Table
        columns={["الشبكة", "الشريك", "الخدمات", "الفروع", "الحالة"]}
        rows={links.map((row) => [nameOf(networks, s(row, "network_id")), nameOf(partners, s(row, "partner_id"), "trade_name"), s(row, "services"), s(row, "branch_ids"), s(row, "status")])}
        onPick={(index) => {
          const row = links[index];
          reset({ id: s(row, "id"), networkId: s(row, "network_id"), partnerId: s(row, "partner_id"), services: s(row, "services"), currencies: s(row, "currencies"), minAmount: s(row, "min_amount"), maxAmount: s(row, "max_amount"), agreementRef: s(row, "agreement_ref"), status: s(row, "status"), notes: s(row, "notes"), branchIds: s(row, "branch_ids") });
        }}
      />
    </div>
  );
}

function CorridorForm({ desk, act, error }: { desk: Desk; act: (action: Record<string, unknown>) => Promise<unknown>; error: (msg: string) => void }) {
  const networks = desk.networks as Row[];
  const partners = desk.partners as Row[];
  const rows = desk.corridors as Row[];
  const blank = { id: "", sendCountry: "", recvCountry: "", networkId: "", sendPartnerId: "", recvPartnerId: "", currencies: "", minAmount: "", maxAmount: "", feeNote: "", etaNote: "", status: "inactive", demo: "" };
  const { form, set, reset } = useForm(blank);
  return (
    <div className="grid gap-4">
      <Panel title="ممر تحويل">
        <p className="mb-3 text-sm text-muted">مثال الشكل: السعودية ← اليمن. لا يُفعَّل الممر إلا بعد ربطه بشبكة وشريك تعتمدهما الشركة. زمن التنفيذ يُكتب كما هو متفق، ولا يُفترض رقم.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="دولة الإرسال"><input className={inputClass} value={form.sendCountry} onChange={(e) => set("sendCountry", e.target.value)} /></Field>
          <Field label="دولة الاستلام"><input className={inputClass} value={form.recvCountry} onChange={(e) => set("recvCountry", e.target.value)} /></Field>
          <Field label="الشبكة"><EntitySelect rows={networks} labelKey="name_ar" value={form.networkId} onChange={(value) => set("networkId", value)} /></Field>
          <Field label="الشريك المرسل"><EntitySelect rows={partners} labelKey="trade_name" value={form.sendPartnerId} onChange={(value) => set("sendPartnerId", value)} allowEmpty /></Field>
          <Field label="الشريك المستلم"><EntitySelect rows={partners} labelKey="trade_name" value={form.recvPartnerId} onChange={(value) => set("recvPartnerId", value)} allowEmpty /></Field>
          <Field label="العملات"><input className={inputClass} value={form.currencies} onChange={(e) => set("currencies", e.target.value)} /></Field>
          <Field label="الحد الأدنى"><input className={inputClass} value={form.minAmount} onChange={(e) => set("minAmount", e.target.value)} /></Field>
          <Field label="الحد الأعلى"><input className={inputClass} value={form.maxAmount} onChange={(e) => set("maxAmount", e.target.value)} /></Field>
          <Field label="رسوم الممر"><input className={inputClass} value={form.feeNote} onChange={(e) => set("feeNote", e.target.value)} /></Field>
          <Field label="زمن التنفيذ المتوقع"><input className={inputClass} value={form.etaNote} onChange={(e) => set("etaNote", e.target.value)} /></Field>
          <Field label="الحالة"><Select value={form.status} onChange={(value) => set("status", value)} options={{ active: "نشط", inactive: "غير نشط" }} /></Field>
        </div>
        <div className="mt-4"><PrimaryButton onClick={() => act({ type: "save-corridor", ...form, id: Number(form.id || 0) }).catch((err: unknown) => error(err instanceof Error ? err.message : "Error"))}>حفظ الممر</PrimaryButton></div>
      </Panel>
      <Table
        columns={["من", "إلى", "الشبكة", "الحالة"]}
        rows={rows.map((row) => [`${s(row, "send_country")} ←`, s(row, "recv_country"), nameOf(networks, s(row, "network_id")), s(row, "status") + (on(row, "is_demo") ? " · تجريبي" : "")])}
        onPick={(index) => {
          const row = rows[index];
          reset({ id: s(row, "id"), sendCountry: s(row, "send_country"), recvCountry: s(row, "recv_country"), networkId: s(row, "network_id"), sendPartnerId: s(row, "send_partner_id"), recvPartnerId: s(row, "recv_partner_id"), currencies: s(row, "currencies"), minAmount: s(row, "min_amount"), maxAmount: s(row, "max_amount"), feeNote: s(row, "fee_note"), etaNote: s(row, "eta_note"), status: s(row, "status"), demo: "" });
        }}
      />
    </div>
  );
}

function FeeForm({ desk, act, error }: { desk: Desk; act: (action: Record<string, unknown>) => Promise<unknown>; error: (msg: string) => void }) {
  const plans = desk.plans as Row[];
  const blank = { replacesId: "", networkId: "", partnerId: "", serviceCode: "send", currency: "YER", country: "", side: "send", kind: "percent", minAmount: "0", maxAmount: "", percent: "0", fixed: "0", companyShare: "100", startsOn: "", endsOn: "", tierMin: "", tierMax: "", tierPercent: "0", tierFixed: "0" };
  const { form, set } = useForm(blank);
  const [preview, setPreview] = useState("");
  return (
    <div className="grid gap-4">
      <Panel title="اتفاقية عمولة">
        <p className="mb-3 text-sm text-muted">التعديل ينشئ نسخة جديدة ويغلق السابقة. العمليات القديمة تحتفظ بالعمولة المحسوبة وقتها ولا تتغير.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="الشبكة"><EntitySelect rows={desk.networks as Row[]} labelKey="name_ar" value={form.networkId} onChange={(value) => set("networkId", value)} /></Field>
          <Field label="الشريك (اختياري)"><EntitySelect rows={desk.partners as Row[]} labelKey="trade_name" value={form.partnerId} onChange={(value) => set("partnerId", value)} allowEmpty /></Field>
          <Field label="الخدمة"><Select value={form.serviceCode} onChange={(value) => set("serviceCode", value)} options={SVC} /></Field>
          <Field label="الجهة"><Select value={form.side} onChange={(value) => set("side", value)} options={{ send: "إرسال", receive: "استلام" }} /></Field>
          <Field label="النوع"><Select value={form.kind} onChange={(value) => set("kind", value)} options={{ fixed: "ثابتة", percent: "نسبة", tiered: "متدرجة" }} /></Field>
          <Field label="العملة"><input className={inputClass} value={form.currency} onChange={(e) => set("currency", e.target.value)} /></Field>
          <Field label="الدولة"><input className={inputClass} value={form.country} onChange={(e) => set("country", e.target.value)} /></Field>
          <Field label="من مبلغ"><input className={inputClass} value={form.minAmount} onChange={(e) => set("minAmount", e.target.value)} /></Field>
          <Field label="إلى مبلغ"><input className={inputClass} value={form.maxAmount} onChange={(e) => set("maxAmount", e.target.value)} /></Field>
          <Field label="النسبة %"><input className={inputClass} value={form.percent} onChange={(e) => set("percent", e.target.value)} /></Field>
          <Field label="القيمة الثابتة"><input className={inputClass} value={form.fixed} onChange={(e) => set("fixed", e.target.value)} /></Field>
          <Field label="حصة الشركة %"><input className={inputClass} value={form.companyShare} onChange={(e) => set("companyShare", e.target.value)} /></Field>
          <Field label="يبدأ"><input className={inputClass} type="date" value={form.startsOn} onChange={(e) => set("startsOn", e.target.value)} /></Field>
          <Field label="ينتهي"><input className={inputClass} type="date" value={form.endsOn} onChange={(e) => set("endsOn", e.target.value)} /></Field>
        </div>
        {form.kind === "tiered" ? (
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            <Field label="شريحة من"><input className={inputClass} value={form.tierMin} onChange={(e) => set("tierMin", e.target.value)} /></Field>
            <Field label="شريحة إلى"><input className={inputClass} value={form.tierMax} onChange={(e) => set("tierMax", e.target.value)} /></Field>
            <Field label="نسبة الشريحة"><input className={inputClass} value={form.tierPercent} onChange={(e) => set("tierPercent", e.target.value)} /></Field>
            <Field label="ثابت الشريحة"><input className={inputClass} value={form.tierFixed} onChange={(e) => set("tierFixed", e.target.value)} /></Field>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <PrimaryButton onClick={() => act({
            type: "save-plan",
            ...form,
            replacesId: Number(form.replacesId || 0),
            tiers: form.kind === "tiered" ? [{ minAmount: form.tierMin || 0, maxAmount: form.tierMax, percent: form.tierPercent, fixed: form.tierFixed }] : [],
          }).catch((err: unknown) => error(err instanceof Error ? err.message : "Error"))}>حفظ نسخة</PrimaryButton>
        </div>
        {preview ? <p className="mt-3 text-sm">{preview}</p> : null}
      </Panel>
      <Table
        columns={["#", "الشبكة", "النوع", "العملة", "حصة الشركة", "سارية"]}
        rows={plans.map((row) => [s(row, "id"), nameOf(desk.networks as Row[], s(row, "network_id")), s(row, "kind"), s(row, "currency"), s(row, "company_share"), on(row, "active") ? "نعم" : "مغلقة"])}
        onPick={(index) => {
          const row = plans[index];
          set("replacesId", s(row, "id"));
          set("networkId", s(row, "network_id"));
          set("partnerId", s(row, "partner_id"));
          set("kind", s(row, "kind"));
          set("currency", s(row, "currency"));
          set("percent", s(row, "percent"));
          set("fixed", s(row, "fixed_amount"));
          set("companyShare", s(row, "company_share"));
          setPreview(`ستُغلق الخطة ${s(row, "id")} عند الحفظ، ولن تتغير عمولات العمليات السابقة.`);
        }}
      />
    </div>
  );
}

function BalanceDesk({ desk, includeDemo, act, error }: { desk: Desk; includeDemo: boolean; act: (action: Record<string, unknown>) => Promise<unknown>; error: (msg: string) => void }) {
  const entries = (desk.entries as Row[]).filter((row) => includeDemo || !on(row, "is_demo"));
  const holds = (desk.holds as Row[]).filter((row) => (includeDemo || !on(row, "is_demo")) && s(row, "status") === "active");
  const balances = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of entries) {
      if (!s(row, "account_code").startsWith("NET:")) continue;
      map.set(s(row, "account_code"), (map.get(s(row, "account_code")) ?? 0) + Number(s(row, "debit") || 0) - Number(s(row, "credit") || 0));
    }
    return [...map.entries()];
  }, [entries]);
  const blank = { idempotencyKey: "", networkId: "", currency: "YER", amount: "", kind: "deposit", note: "", costCenter: "" };
  const { form, set } = useForm(blank);
  const transfer = { idempotencyKey: "", networkId: "", direction: "out", currency: "YER", amount: "", status: "posted", sendPartnerId: "", recvPartnerId: "", note: "", costCenter: "" };
  const [tx, setTx] = useState(transfer);
  const [settlement, setSettlement] = useState({ code: "", networkId: "", partnerId: "", currency: "YER", periodStart: "", periodEnd: "", statementAmount: "", note: "", documents: "", costCenter: "", diffNote: "" });
  return (
    <div className="grid gap-4">
      <Panel title="أرصدة الشبكات">
        <p className="mb-3 text-sm text-muted">الرصيد = افتتاحي + إيداع + وارد − سحب − صادر. المتاح = الرصيد − المحجوز. المستحق للشريك يظهر في حساب PTR ضمن القيود. هذه قيود الوحدة، وليست ترحيلاً إلى نظام محاسبي خارجي.</p>
        <Table columns={["الحساب", "الرصيد", "محجوز"]} rows={balances.map(([code, value]) => {
          const held = holds.filter((row) => `NET:${s(row, "network_id")}:${s(row, "currency")}` === code).reduce((sum, row) => sum + Number(s(row, "amount") || 0), 0);
          return [code, value.toFixed(2), held.toFixed(2)];
        })} />
      </Panel>
      <Panel title="حركة رصيد">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="مفتاح منع التكرار"><input className={inputClass} value={form.idempotencyKey} onChange={(e) => set("idempotencyKey", e.target.value)} placeholder="dep-20261106-1" /></Field>
          <Field label="الشبكة"><EntitySelect rows={desk.networks as Row[]} labelKey="name_ar" value={form.networkId} onChange={(value) => set("networkId", value)} /></Field>
          <Field label="النوع"><Select value={form.kind} onChange={(value) => set("kind", value)} options={{ deposit: "إيداع", withdrawal: "سحب", opening: "رصيد افتتاحي" }} /></Field>
          <Field label="العملة"><input className={inputClass} value={form.currency} onChange={(e) => set("currency", e.target.value)} /></Field>
          <Field label="المبلغ"><input className={inputClass} value={form.amount} onChange={(e) => set("amount", e.target.value)} /></Field>
          <Field label="مركز التكلفة"><input className={inputClass} value={form.costCenter} onChange={(e) => set("costCenter", e.target.value)} /></Field>
          <Field label="بيان"><input className={inputClass} value={form.note} onChange={(e) => set("note", e.target.value)} /></Field>
        </div>
        <div className="mt-4"><PrimaryButton onClick={() => act({ type: "post-movement", ...form }).catch((err: unknown) => error(err instanceof Error ? err.message : "Error"))}>ترحيل الحركة</PrimaryButton></div>
      </Panel>
      <Panel title="حوالة عبر الشبكة">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="مرجع فريد"><input className={inputClass} value={tx.idempotencyKey} onChange={(e) => setTx({ ...tx, idempotencyKey: e.target.value })} /></Field>
          <Field label="الشبكة"><EntitySelect rows={desk.networks as Row[]} labelKey="name_ar" value={tx.networkId} onChange={(value) => setTx({ ...tx, networkId: value })} /></Field>
          <Field label="الاتجاه"><Select value={tx.direction} onChange={(value) => setTx({ ...tx, direction: value })} options={{ out: "صادرة", in: "واردة" }} /></Field>
          <Field label="الحالة"><Select value={tx.status} onChange={(value) => setTx({ ...tx, status: value })} options={{ posted: "مرحّلة", failed: "فاشلة", rejected: "مرفوضة" }} /></Field>
          <Field label="العملة"><input className={inputClass} value={tx.currency} onChange={(e) => setTx({ ...tx, currency: e.target.value })} /></Field>
          <Field label="المبلغ"><input className={inputClass} value={tx.amount} onChange={(e) => setTx({ ...tx, amount: e.target.value })} /></Field>
          <Field label="شريك الإرسال"><EntitySelect rows={desk.partners as Row[]} labelKey="trade_name" value={tx.sendPartnerId} onChange={(value) => setTx({ ...tx, sendPartnerId: value })} allowEmpty /></Field>
          <Field label="شريك الاستلام"><EntitySelect rows={desk.partners as Row[]} labelKey="trade_name" value={tx.recvPartnerId} onChange={(value) => setTx({ ...tx, recvPartnerId: value })} allowEmpty /></Field>
          <Field label="ملاحظة"><input className={inputClass} value={tx.note} onChange={(e) => setTx({ ...tx, note: e.target.value })} /></Field>
        </div>
        <p className="mt-2 text-xs text-muted">العمولة تُحسب من الاتفاقية السارية عند الترحيل. إعادة نفس المرجع لا تنشئ قيداً ثانياً. الفشل والرفض لا يرحّلان قيداً.</p>
        <div className="mt-4"><PrimaryButton onClick={() => act({ type: "post-transfer", ...tx }).catch((err: unknown) => error(err instanceof Error ? err.message : "Error"))}>تسجيل</PrimaryButton></div>
      </Panel>
      <Table
        columns={["المرجع", "الاتجاه", "المبلغ", "العمولة", "حصة الشركة", "الحالة"]}
        rows={(desk.transfers as Row[]).map((row) => [s(row, "reference"), s(row, "direction"), s(row, "amount"), s(row, "fee"), s(row, "company_share"), s(row, "status")])}
      />
      <Panel title="تسوية">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="الرمز"><input className={inputClass} value={settlement.code} onChange={(e) => setSettlement({ ...settlement, code: e.target.value })} /></Field>
          <Field label="الشبكة"><EntitySelect rows={desk.networks as Row[]} labelKey="name_ar" value={settlement.networkId} onChange={(value) => setSettlement({ ...settlement, networkId: value })} /></Field>
          <Field label="الشريك"><EntitySelect rows={desk.partners as Row[]} labelKey="trade_name" value={settlement.partnerId} onChange={(value) => setSettlement({ ...settlement, partnerId: value })} allowEmpty /></Field>
          <Field label="العملة"><input className={inputClass} value={settlement.currency} onChange={(e) => setSettlement({ ...settlement, currency: e.target.value })} /></Field>
          <Field label="من"><input className={inputClass} type="date" value={settlement.periodStart} onChange={(e) => setSettlement({ ...settlement, periodStart: e.target.value })} /></Field>
          <Field label="إلى"><input className={inputClass} type="date" value={settlement.periodEnd} onChange={(e) => setSettlement({ ...settlement, periodEnd: e.target.value })} /></Field>
          <Field label="مبلغ كشف الشريك"><input className={inputClass} value={settlement.statementAmount} onChange={(e) => setSettlement({ ...settlement, statementAmount: e.target.value })} /></Field>
          <Field label="ملاحظة الفرق"><input className={inputClass} value={settlement.diffNote} onChange={(e) => setSettlement({ ...settlement, diffNote: e.target.value })} /></Field>
          <Field label="مستندات"><input className={inputClass} value={settlement.documents} onChange={(e) => setSettlement({ ...settlement, documents: e.target.value })} /></Field>
        </div>
        <p className="mt-2 text-xs text-muted">مبلغ النظام يُجمع من حصص الشركاء المرحّلة في الفترة. الاعتماد يرحّل القيد مرة واحدة، ولا يجوز لمن أنشأ المسودة أن يعتمدها.</p>
        <div className="mt-4"><PrimaryButton onClick={() => act({ type: "save-settlement", ...settlement }).catch((err: unknown) => error(err instanceof Error ? err.message : "Error"))}>إنشاء مسودة</PrimaryButton></div>
      </Panel>
      <Table
        columns={["الرمز", "النظام", "الكشف", "الفرق", "الحالة"]}
        rows={(desk.settlements as Row[]).map((row) => [s(row, "code"), s(row, "system_amount"), s(row, "statement_amount"), s(row, "difference"), s(row, "status")])}
        onPick={(index) => {
          const row = (desk.settlements as Row[])[index];
          if (s(row, "status") === "approved") return;
          act({ type: "approve-settlement", id: n(row, "id") }).catch((err: unknown) => error(err instanceof Error ? err.message : "Error"));
        }}
      />
      <p className="text-xs text-muted">النقر على تسوية غير معتمدة يرسلها للاعتماد.</p>
    </div>
  );
}

function AgreementForm({ desk, expiring, act, error }: { desk: Desk; expiring: Row[]; act: (action: Record<string, unknown>) => Promise<unknown>; error: (msg: string) => void }) {
  const rows = desk.agreements as Row[];
  const blank = { id: "", code: "", networkId: "", partnerId: "", kind: "تعامل", signedOn: "", startsOn: "", endsOn: "", terms: "", commissionNote: "", limitsNote: "", obligations: "", documents: "", status: "draft", alertDays: "30" };
  const { form, set, reset } = useForm(blank);
  return (
    <div className="grid gap-4">
      {expiring.length ? <Panel title="تنبيه"><ul className="text-sm">{expiring.map((row) => <li key={s(row, "id")}>{s(row, "code")} تنتهي {s(row, "ends_on")}</li>)}</ul></Panel> : null}
      <Panel title="اتفاقية">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="رقم الاتفاقية"><input className={inputClass} value={form.code} onChange={(e) => set("code", e.target.value)} /></Field>
          <Field label="النوع"><input className={inputClass} value={form.kind} onChange={(e) => set("kind", e.target.value)} /></Field>
          <Field label="الشبكة"><EntitySelect rows={desk.networks as Row[]} labelKey="name_ar" value={form.networkId} onChange={(value) => set("networkId", value)} allowEmpty /></Field>
          <Field label="الشريك"><EntitySelect rows={desk.partners as Row[]} labelKey="trade_name" value={form.partnerId} onChange={(value) => set("partnerId", value)} allowEmpty /></Field>
          <Field label="التوقيع"><input className={inputClass} type="date" value={form.signedOn} onChange={(e) => set("signedOn", e.target.value)} /></Field>
          <Field label="البداية"><input className={inputClass} type="date" value={form.startsOn} onChange={(e) => set("startsOn", e.target.value)} /></Field>
          <Field label="الانتهاء"><input className={inputClass} type="date" value={form.endsOn} onChange={(e) => set("endsOn", e.target.value)} /></Field>
          <Field label="مهلة التنبيه بالأيام"><input className={inputClass} value={form.alertDays} onChange={(e) => set("alertDays", e.target.value)} /></Field>
          <Field label="الحالة"><Select value={form.status} onChange={(value) => set("status", value)} options={{ draft: "مسودة", active: "سارية", expired: "منتهية", terminated: "منهية" }} /></Field>
          <Field label="الشروط"><input className={inputClass} value={form.terms} onChange={(e) => set("terms", e.target.value)} /></Field>
          <Field label="العمولات"><input className={inputClass} value={form.commissionNote} onChange={(e) => set("commissionNote", e.target.value)} /></Field>
          <Field label="الحدود"><input className={inputClass} value={form.limitsNote} onChange={(e) => set("limitsNote", e.target.value)} /></Field>
          <Field label="الالتزامات"><input className={inputClass} value={form.obligations} onChange={(e) => set("obligations", e.target.value)} /></Field>
          <Field label="المستندات"><input className={inputClass} value={form.documents} onChange={(e) => set("documents", e.target.value)} /></Field>
        </div>
        <div className="mt-4"><PrimaryButton onClick={() => act({ type: "save-agreement", ...form, id: Number(form.id || 0) }).catch((err: unknown) => error(err instanceof Error ? err.message : "Error"))}>حفظ</PrimaryButton></div>
      </Panel>
      <Table columns={["الرقم", "النوع", "الانتهاء", "الحالة"]} rows={rows.map((row) => [s(row, "code"), s(row, "kind"), s(row, "ends_on"), s(row, "status")])} onPick={(index) => {
        const row = rows[index];
        reset({ id: s(row, "id"), code: s(row, "code"), networkId: s(row, "network_id"), partnerId: s(row, "partner_id"), kind: s(row, "kind"), signedOn: s(row, "signed_on").slice(0, 10), startsOn: s(row, "starts_on").slice(0, 10), endsOn: s(row, "ends_on").slice(0, 10), terms: s(row, "terms"), commissionNote: s(row, "commission_note"), limitsNote: s(row, "limits_note"), obligations: s(row, "obligations"), documents: s(row, "documents"), status: s(row, "status"), alertDays: s(row, "alert_days") });
      }} />
    </div>
  );
}

function TechForm({ desk, act, error }: { desk: Desk; act: (action: Record<string, unknown>) => Promise<unknown>; error: (msg: string) => void }) {
  const rows = desk.integrations as Row[];
  const blank = { networkId: "", provider: "", mode: "manual", apiBase: "", sandboxBase: "", secret: "", errorNote: "", log: "" };
  const { form, set } = useForm(blank);
  return (
    <div className="grid gap-4">
      <Panel title="ربط تقني">
        <p className="mb-3 text-sm text-muted">الوضع اليدوي هو المسار العامل حتى تُسلَّم بيئة الربط. لا يُجرى اتصال خارجي من هذه الشاشة، ولا يُعاد إظهار المفتاح بعد حفظه.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="الشبكة"><EntitySelect rows={desk.networks as Row[]} labelKey="name_ar" value={form.networkId} onChange={(value) => set("networkId", value)} /></Field>
          <Field label="المزود"><input className={inputClass} value={form.provider} onChange={(e) => set("provider", e.target.value)} /></Field>
          <Field label="الوسيلة"><Select value={form.mode} onChange={(value) => set("mode", value)} options={{ manual: "إدخال يدوي", rest: "REST API", webhook: "Webhooks", file: "ملفات تبادل", direct: "ربط مباشر" }} /></Field>
          <Field label="عنوان API"><input className={inputClass} value={form.apiBase} onChange={(e) => set("apiBase", e.target.value)} /></Field>
          <Field label="بيئة التجربة"><input className={inputClass} value={form.sandboxBase} onChange={(e) => set("sandboxBase", e.target.value)} /></Field>
          {desk.caps.secrets ? <Field label="مفتاح جديد"><input className={inputClass} type="password" value={form.secret} onChange={(e) => set("secret", e.target.value)} autoComplete="off" /></Field> : <p className="text-sm text-muted">حفظ المفتاح لمدير النظام فقط.</p>}
          <Field label="ملاحظة خطأ"><input className={inputClass} value={form.errorNote} onChange={(e) => set("errorNote", e.target.value)} /></Field>
          <Field label="سجل"><input className={inputClass} value={form.log} onChange={(e) => set("log", e.target.value)} /></Field>
        </div>
        <div className="mt-4"><PrimaryButton onClick={() => act({ type: "save-integration", ...form }).then(() => set("secret", "")).catch((err: unknown) => error(err instanceof Error ? err.message : "Error"))}>حفظ الربط</PrimaryButton></div>
      </Panel>
      <Table columns={["الشبكة", "الوسيلة", "الحالة", "تلميح المفتاح", "آخر خطأ"]} rows={rows.map((row) => [nameOf(desk.networks as Row[], s(row, "network_id")), s(row, "mode"), s(row, "status"), s(row, "secret_hint"), s(row, "last_error")])} />
      <Panel title="سجل الأخطاء">
        <ul className="grid gap-1 text-sm">{(desk.logs as Row[]).map((row) => <li key={s(row, "id")}>{s(row, "created_at")} — {s(row, "message")}</li>)}</ul>
      </Panel>
    </div>
  );
}

function ServiceMatrix({ desk, act, error }: { desk: Desk; act: (action: Record<string, unknown>) => Promise<unknown>; error: (msg: string) => void }) {
  const services = desk.services as Row[];
  return (
    <Panel title="خدمات كل شبكة">
      <p className="mb-3 text-sm text-muted">الخدمة لا تُعد متاحة إلا إذا فُعّلت واعتُمدت. الإلغاء والاسترداد يبقيان وفق شروط الشبكة ولا يُنفَّذان آلياً من هنا.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-line text-start"><th className="py-2">الشبكة</th>{Object.values(SVC).map((label) => <th key={label} className="px-2 py-2 font-medium">{label}</th>)}</tr></thead>
          <tbody>
            {(desk.networks as Row[]).map((network) => (
              <tr key={s(network, "id")} className="border-b border-line">
                <td className="py-2">{s(network, "name_ar")}</td>
                {Object.keys(SVC).map((code) => {
                  const row = services.find((item) => s(item, "network_id") === s(network, "id") && s(item, "service_code") === code);
                  const enabled = row ? on(row, "enabled") : false;
                  const approved = row ? on(row, "approved") : false;
                  return (
                    <td key={code} className="px-2 py-2">
                      <button
                        type="button"
                        className="underline-offset-2 hover:underline"
                        onClick={() => act({ type: "set-service", networkId: n(network, "id"), serviceCode: code, enabled: !enabled, approved: !enabled ? false : approved }).catch((err: unknown) => error(err instanceof Error ? err.message : "Error"))}
                      >
                        {enabled ? (approved ? "معتمدة" : "مفعلة") : "موقفة"}
                      </button>
                      {enabled && !approved && desk.caps.approve ? (
                        <button type="button" className="mt-1 block text-xs text-primary" onClick={() => act({ type: "set-service", networkId: n(network, "id"), serviceCode: code, enabled: true, approved: true }).catch((err: unknown) => error(err instanceof Error ? err.message : "Error"))}>اعتماد</button>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function Reports({ desk, includeDemo }: { desk: Desk; includeDemo: boolean }) {
  const [kind, setKind] = useState("networks");
  const networks = (desk.networks as Row[]).filter((row) => includeDemo || !on(row, "is_demo"));
  const partners = (desk.partners as Row[]).filter((row) => includeDemo || !on(row, "is_demo"));
  const transfers = (desk.transfers as Row[]).filter((row) => includeDemo || !on(row, "is_demo"));
  const settlements = (desk.settlements as Row[]).filter((row) => includeDemo || !on(row, "is_demo"));
  const views: Record<string, { title: string; columns: string[]; rows: string[][] }> = {
    networks: { title: "جميع الشبكات", columns: ["الرمز", "الاسم", "النوع", "الحالة"], rows: networks.map((row) => [s(row, "code"), s(row, "name_ar"), KINDS[s(row, "kind")] || "", STATUS[s(row, "status")] || ""]) },
    partners: { title: "الشركاء", columns: ["الرقم", "الاسم", "النوع", "الدولة"], rows: partners.map((row) => [s(row, "code"), s(row, "trade_name"), PTR[s(row, "kind")] || "", s(row, "country")]) },
    activity: { title: "النشطة والمتوقفة", columns: ["الاسم", "الحالة"], rows: networks.map((row) => [s(row, "name_ar"), STATUS[s(row, "status")] || ""]) },
    byNetwork: { title: "حوالات حسب الشبكة", columns: ["الشبكة", "العدد", "المبلغ"], rows: volumeBy(transfers, networks).map((item) => [item.name, String(transfers.filter((row) => nameOf(networks, s(row, "network_id")) === item.name).length), item.value.toFixed(2)]) },
    byCountry: { title: "حوالات حسب الدولة", columns: ["ممر", "مبلغ"], rows: (desk.corridors as Row[]).map((row) => [`${s(row, "send_country")} → ${s(row, "recv_country")}`, s(row, "status")]) },
    byPartner: { title: "حوالات حسب الشريك", columns: ["المرجع", "شريك الإرسال", "المبلغ"], rows: transfers.map((row) => [s(row, "reference"), nameOf(partners, s(row, "send_partner_id"), "trade_name"), s(row, "amount")]) },
    fees: { title: "العمولات", columns: ["المرجع", "الرسم", "حصة الشركة", "حصة الشريك"], rows: transfers.map((row) => [s(row, "reference"), s(row, "fee"), s(row, "company_share"), s(row, "partner_share")]) },
    balances: { title: "أرصدة", columns: ["الحساب", "مدين", "دائن"], rows: (desk.entries as Row[]).filter((row) => includeDemo || !on(row, "is_demo")).map((row) => [s(row, "account_code"), s(row, "debit"), s(row, "credit")]) },
    settlements: { title: "التسويات", columns: ["الرمز", "النظام", "الكشف", "الحالة"], rows: settlements.map((row) => [s(row, "code"), s(row, "system_amount"), s(row, "statement_amount"), s(row, "status")]) },
    diffs: { title: "الفروقات", columns: ["الرمز", "الفرق"], rows: settlements.filter((row) => Number(s(row, "difference") || 0) !== 0).map((row) => [s(row, "code"), s(row, "difference")]) },
    agreements: { title: "الاتفاقيات", columns: ["الرقم", "الانتهاء", "الحالة"], rows: (desk.agreements as Row[]).map((row) => [s(row, "code"), s(row, "ends_on"), s(row, "status")]) },
    performance: { title: "أداء الشبكات", columns: ["الشبكة", "مرحّل", "فاشل أو مرفوض"], rows: networks.map((row) => [s(row, "name_ar"), String(transfers.filter((item) => s(item, "network_id") === s(row, "id") && s(item, "status") === "posted").length), String(transfers.filter((item) => s(item, "network_id") === s(row, "id") && (s(item, "status") === "failed" || s(item, "status") === "rejected")).length)]) },
    serviceReport: { title: "الخدمات المتاحة", columns: ["الشبكة", "الخدمة", "الحالة"], rows: (desk.services as Row[]).filter((row) => on(row, "enabled") && on(row, "approved")).map((row) => [nameOf(networks, s(row, "network_id")), SVC[s(row, "service_code")] || s(row, "service_code"), "معتمدة"]) },
    failed: { title: "المرفوضة والفاشلة", columns: ["المرجع", "الحالة", "المبلغ"], rows: transfers.filter((row) => ["failed", "rejected", "void"].includes(s(row, "status"))).map((row) => [s(row, "reference"), s(row, "status"), s(row, "amount")]) },
  };
  const view = views[kind];
  return (
    <Panel title="مركز التقارير">
      <div className="mb-4 flex flex-wrap gap-2">
        <select className={inputClass} value={kind} onChange={(event) => setKind(event.target.value)}>
          {Object.entries(views).map(([id, item]) => <option key={id} value={id}>{item.title}</option>)}
        </select>
        <button type="button" className="min-h-11 rounded-full border border-line px-4 text-sm" onClick={() => downloadCsv(view.title, [view.columns, ...view.rows])}>Excel</button>
        <button type="button" className="min-h-11 rounded-full border border-line px-4 text-sm" onClick={() => window.print()}>طباعة / PDF</button>
      </div>
      <Table columns={view.columns} rows={view.rows} />
    </Panel>
  );
}

function downloadCsv(title: string, rows: string[][]) {
  const body = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${body}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function Table({ columns, rows, onPick }: { columns: string[]; rows: string[][]; onPick?: (index: number) => void }) {
  const [query, setQuery] = useState("");
  const shown = rows.filter((row) => row.join(" ").includes(query));
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <div className="p-3">
        <input className={inputClass} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="بحث" />
      </div>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-line">{columns.map((column) => <th key={column} className="px-3 py-2 text-start font-medium">{column}</th>)}</tr></thead>
        <tbody>
          {shown.map((row, index) => (
            <tr key={`${row.join("-")}-${index}`} className="border-b border-line last:border-0" onClick={() => onPick?.(rows.indexOf(row))}>
              {row.map((cell, cellIndex) => <td key={cellIndex} className="px-3 py-2">{cell}</td>)}
            </tr>
          ))}
          {shown.length === 0 ? <tr><td className="px-3 py-4 text-muted" colSpan={columns.length}>لا صفوف.</td></tr> : null}
        </tbody>
      </table>
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: Record<string, string> }) {
  return (
    <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>
      {Object.entries(options).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
    </select>
  );
}

function EntitySelect({ rows, labelKey, value, onChange, allowEmpty = false }: { rows: Row[]; labelKey: string; value: string; onChange: (value: string) => void; allowEmpty?: boolean }) {
  return (
    <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>
      {allowEmpty ? <option value="">—</option> : <option value="">اختر</option>}
      {rows.map((row) => <option key={s(row, "id")} value={s(row, "id")}>{s(row, labelKey)}{on(row, "is_demo") ? " (تجريبي)" : ""}</option>)}
    </select>
  );
}
