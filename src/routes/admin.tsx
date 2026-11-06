import { createFileRoute, Link, Outlet, useChildMatches } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  adminAddRate,
  adminAudit,
  adminBranches,
  adminComplaints,
  adminCreateTransfer,
  adminCustomers,
  adminInquiryStatus,
  adminInquiries,
  adminJobs,
  adminNews,
  adminPages,
  adminPartners,
  adminRates,
  adminReplyComplaint,
  adminReplyTicket,
  adminSaveBranch,
  adminSaveJob,
  adminSaveNews,
  adminSavePage,
  adminSavePartner,
  adminSaveService,
  adminSaveSettings,
  adminServices,
  adminSetRole,
  adminServiceRequests,
  adminSettings,
  adminStaff,
  adminTickets,
  adminTransferStatus,
  adminTransfers,
  adminUpdateRate,
  bootstrapAdmin,
  getAdminOverview,
  syncProfile,
} from "@/lib/server/fns";
import type {
  AdminTransfer,
  AuditRow,
  Branch,
  ComplaintRow,
  Inquiry,
  JobPost,
  ManagedPage,
  Partner,
  Profile,
  RateRow,
  Service,
  SiteSettings,
  StaffRow,
  Ticket,
} from "@/lib/domain";
import { useI18n } from "@/components/site/shell";
import { ErrorNote, Field, PrimaryButton, inputClass } from "@/components/site/ui";
import { can, roleLabel, statusLabel, ROLES } from "@/lib/labels";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة | الخضر للصرافة" },
      { name: "description", content: "إدارة محتوى وأسعار وفروع وطلبات الخضر للصرافة." },
    ],
  }),
  component: AdminPage,
});

type NewsRow = Awaited<ReturnType<typeof adminNews>>[number];

function AdminPage() {
  const nested = useChildMatches().length > 0;
  const { user, isPending } = useCurrentUserState();
  const { lang, t } = useI18n();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof getAdminOverview>> | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  async function refresh(name: string) {
    const next = await syncProfile({ data: { name } });
    setProfile(next);
    if (can(next.role, "read")) setOverview(await getAdminOverview());
    else setOverview(null);
  }

  useEffect(() => {
    if (!user?.id) return;
    let gone = false;
    refresh(user.displayName ?? "")
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

  if (nested) return <Outlet />;

  if (isPending || (user && loading)) {
    return <div className="mx-auto max-w-6xl px-4 py-12"><div className="h-48 animate-pulse rounded-2xl bg-line" /></div>;
  }
  if (!user) return <RedirectToSignIn />;
  if (!profile) return error ? <div className="mx-auto max-w-xl px-4 py-12"><ErrorNote>{error}</ErrorNote></div> : null;

  if (!can(profile.role, "read")) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <h1 className="font-display text-4xl">{t("لوحة الإدارة", "Admin")}</h1>
        <p className="mt-3 text-muted">
          {t("حسابك بدور عميل. إن لم يوجد مدير نظام بعد، يمكن تعيين أول مدير مرة واحدة من هذا الحساب.", "This account is a customer. If no system admin exists yet, this account can take that role once.")}
        </p>
        {error ? <div className="mt-4"><ErrorNote>{error}</ErrorNote></div> : null}
        <div className="mt-6">
          <PrimaryButton
            onClick={() => {
              setError("");
              void bootstrapAdmin()
                .then(() => refresh(user.displayName ?? ""))
                .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error"));
            }}
          >
            {t("تعيين أول مدير للنظام", "Claim the first system admin")}
          </PrimaryButton>
        </div>
      </div>
    );
  }

  const tabs = [
    ["overview", t("المؤشرات", "Overview"), "read"],
    ["rates", t("الأسعار", "Rates"), "rates"],
    ["branches", t("الفروع", "Branches"), "branches"],
    ["services", t("الخدمات", "Services"), "content"],
    ["news", t("الأخبار", "News"), "content"],
    ["pages", t("الصفحات", "Pages"), "content"],
    ["partners", t("الشركاء", "Partners"), "content"],
    ["jobs", t("الوظائف", "Jobs"), "content"],
    ["settings", t("الهوية والتواصل", "Identity"), "content"],
    ["inquiries", t("التواصل", "Inquiries"), "support"],
    ["complaints", t("الشكاوى", "Complaints"), "support"],
    ["requests", t("طلبات الخدمات", "Service requests"), "support"],
    ["customers", t("العملاء", "Customers"), "support"],
    ["tickets", t("الدعم", "Support"), "support"],
    ["transfers", t("الحوالات", "Transfers"), "support"],
    ["staff", t("الصلاحيات", "Roles"), "*"],
    ["audit", t("التدقيق", "Audit"), "audit"],
  ].filter(([, , perm]) => perm === "*" ? profile.role === "system_admin" : can(profile.role, perm));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm text-gold">{roleLabel(profile.role, lang)}</p>
      <h1 className="mt-1 font-display text-4xl">{t("لوحة الإدارة", "Admin console")}</h1>
      {can(profile.role, "networks") ? (
        <Link to="/admin/networks" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm text-surface">
          {t("شبكات التحويل والشركاء", "Transfer networks and partners")}
        </Link>
      ) : null}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {tabs.map(([id, label]) => (
          <button key={id} type="button" onClick={() => setTab(id)} className={`min-h-11 shrink-0 rounded-full px-4 text-sm ${tab === id ? "bg-primary text-surface" : "border border-line bg-surface"}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab === "overview" && overview ? (
          <div className="grid gap-4 md:grid-cols-4">
            <Tile label={t("تواصل جديد", "New inquiries")} value={overview.newInquiries} />
            <Tile label={t("دعم مفتوح", "Open tickets")} value={overview.openTickets} />
            <Tile label={t("نقاط نشطة", "Active points")} value={overview.activeBranches} />
            <Tile label={t("أخبار منشورة", "Published news")} value={overview.publishedNews} />
          </div>
        ) : null}
        {tab === "rates" ? <RatesDesk /> : null}
        {tab === "branches" ? <BranchDesk /> : null}
        {tab === "services" ? <ServiceDesk /> : null}
        {tab === "news" ? <NewsDesk /> : null}
        {tab === "pages" ? <PagesDesk /> : null}
        {tab === "partners" ? <PartnersDesk /> : null}
        {tab === "jobs" ? <JobsDesk /> : null}
        {tab === "settings" ? <SettingsDesk /> : null}
        {tab === "inquiries" ? <InquiryDesk /> : null}
        {tab === "complaints" ? <ComplaintsDesk /> : null}
        {tab === "requests" ? <RequestsDesk /> : null}
        {tab === "customers" ? <CustomersDesk /> : null}
        {tab === "tickets" ? <TicketDesk /> : null}
        {tab === "transfers" ? <TransferDesk /> : null}
        {tab === "staff" ? <StaffDesk /> : null}
        {tab === "audit" ? <AuditDesk /> : null}
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-display text-4xl tabular-nums">{value}</p>
    </div>
  );
}

function DeskError({ error }: { error: string }) {
  if (!error) return null;
  return <div className="mb-3"><ErrorNote>{error}</ErrorNote></div>;
}

function RatesDesk() {
  const { t } = useI18n();
  const [rows, setRows] = useState<RateRow[]>([]);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({ code: "", nameAr: "", nameEn: "", buy: "1", sell: "1", region: "" });
  useEffect(() => {
    void adminRates().then(setRows).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
  }, []);
  return (
    <div className="grid gap-4">
      <DeskError error={error} />
      {rows.map((row) => (
        <RateEditor key={row.id} row={row} onSaved={setRows} onError={setError} />
      ))}
      <form
        className="grid gap-2 rounded-2xl border border-line bg-surface p-4 md:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault();
          void adminAddRate({ data: draft }).then(setRows).catch((err: unknown) => setError(err instanceof Error ? err.message : "Error"));
        }}
      >
        <input className={inputClass} placeholder="USD" value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} />
        <input className={inputClass} placeholder={t("الاسم عربي", "Arabic name")} value={draft.nameAr} onChange={(e) => setDraft({ ...draft, nameAr: e.target.value })} />
        <input className={inputClass} placeholder={t("الاسم إنجليزي", "English name")} value={draft.nameEn} onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })} />
        <input className={inputClass} aria-label={t("شراء", "Buy")} value={draft.buy} onChange={(e) => setDraft({ ...draft, buy: e.target.value })} />
        <input className={inputClass} aria-label={t("بيع", "Sell")} value={draft.sell} onChange={(e) => setDraft({ ...draft, sell: e.target.value })} />
        <input className={inputClass} placeholder={t("المنطقة، فارغة للعام", "Region, blank if national")} value={draft.region} onChange={(e) => setDraft({ ...draft, region: e.target.value })} />
        <PrimaryButton type="submit">{t("إضافة عملة تجريبية", "Add sample currency")}</PrimaryButton>
      </form>
    </div>
  );
}

function RateEditor({ row, onSaved, onError }: { row: RateRow; onSaved: (rows: RateRow[]) => void; onError: (s: string) => void }) {
  const { t } = useI18n();
  const [buy, setBuy] = useState(row.buy);
  const [sell, setSell] = useState(row.sell);
  const [changePct, setChangePct] = useState(row.changePct);
  const [direction, setDirection] = useState(row.direction);
  const [demo, setDemo] = useState(row.demo);
  return (
    <form
      className="grid items-end gap-2 rounded-2xl border border-line bg-surface p-4 md:grid-cols-4"
      onSubmit={(e) => {
        e.preventDefault();
        void adminUpdateRate({ data: { id: row.id, buy, sell, direction, demo, changePct } })
          .then(onSaved)
          .catch((err: unknown) => onError(err instanceof Error ? err.message : "Error"));
      }}
    >
      <p className="font-medium">{row.code}{row.region ? ` · ${row.region}` : ""}{row.base ? " · YER" : ""}<span className="mt-1 block text-xs text-muted">{row.updatedAt}</span></p>
      <input className={inputClass} value={buy} onChange={(e) => setBuy(e.target.value)} aria-label="buy" />
      <input className={inputClass} value={sell} onChange={(e) => setSell(e.target.value)} aria-label="sell" />
      <input className={inputClass} value={changePct} onChange={(e) => setChangePct(e.target.value)} aria-label="change" />
      <select className={inputClass} value={direction} onChange={(e) => setDirection(e.target.value as RateRow["direction"])}>
        <option value="flat">flat</option>
        <option value="up">up</option>
        <option value="down">down</option>
      </select>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input type="checkbox" checked={demo} onChange={(e) => setDemo(e.target.checked)} />
        {t("تجريبي", "Demo")}
      </label>
      <PrimaryButton type="submit">{t("حفظ", "Save")}</PrimaryButton>
    </form>
  );
}

const emptyBranch = (): Branch => ({
  id: 0, kind: "branch", nameAr: "", nameEn: "", governorateAr: "", governorateEn: "",
  cityAr: "", cityEn: "", addressAr: "", addressEn: "", phone: "", hoursAr: "", hoursEn: "",
  servicesAr: "", servicesEn: "", lat: "", lng: "", photoUrl: "", demo: true, active: true,
});

function BranchDesk() {
  const { t } = useI18n();
  const [rows, setRows] = useState<Branch[]>([]);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Branch>(emptyBranch());
  useEffect(() => {
    void adminBranches().then(setRows).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
  }, []);
  return (
    <div className="grid gap-4">
      <DeskError error={error} />
      <BranchForm
        value={draft}
        onChange={setDraft}
        submitLabel={t("إضافة نقطة", "Add point")}
        onSubmit={() => {
          void adminSaveBranch({ data: draft }).then((next) => {
            setRows(next);
            setDraft(emptyBranch());
          }).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
        }}
      />
      {rows.map((row) => (
        <BranchEditor key={row.id} row={row} onSaved={setRows} onError={setError} />
      ))}
    </div>
  );
}

function BranchEditor({ row, onSaved, onError }: { row: Branch; onSaved: (rows: Branch[]) => void; onError: (s: string) => void }) {
  const [value, setValue] = useState(row);
  const { t } = useI18n();
  return (
    <BranchForm
      value={value}
      onChange={setValue}
      submitLabel={t("تحديث", "Update")}
      onSubmit={() => {
        void adminSaveBranch({ data: value }).then(onSaved).catch((e: unknown) => onError(e instanceof Error ? e.message : "Error"));
      }}
    />
  );
}

function BranchForm({
  value, onChange, onSubmit, submitLabel,
}: {
  value: Branch;
  onChange: (b: Branch) => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  const { t } = useI18n();
  const set = (patch: Partial<Branch>) => onChange({ ...value, ...patch });
  return (
    <form className="grid gap-2 rounded-2xl border border-line bg-surface p-4 md:grid-cols-3" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <select className={inputClass} value={value.kind} onChange={(e) => set({ kind: e.target.value as Branch["kind"] })}>
        <option value="branch">{t("فرع", "Branch")}</option>
        <option value="agent">{t("وكيل", "Agent")}</option>
      </select>
      <input className={inputClass} placeholder={t("الاسم عربي", "Arabic name")} value={value.nameAr} onChange={(e) => set({ nameAr: e.target.value })} />
      <input className={inputClass} placeholder={t("الاسم إنجليزي", "English name")} value={value.nameEn} onChange={(e) => set({ nameEn: e.target.value })} />
      <input className={inputClass} placeholder={t("المحافظة", "Governorate")} value={value.governorateAr} onChange={(e) => set({ governorateAr: e.target.value })} />
      <input className={inputClass} placeholder="Governorate" value={value.governorateEn} onChange={(e) => set({ governorateEn: e.target.value })} />
      <input className={inputClass} placeholder={t("المدينة", "City")} value={value.cityAr} onChange={(e) => set({ cityAr: e.target.value })} />
      <input className={inputClass} placeholder="City" value={value.cityEn} onChange={(e) => set({ cityEn: e.target.value })} />
      <input className={inputClass} placeholder={t("العنوان", "Address")} value={value.addressAr} onChange={(e) => set({ addressAr: e.target.value })} />
      <input className={inputClass} placeholder="Address" value={value.addressEn} onChange={(e) => set({ addressEn: e.target.value })} />
      <input className={inputClass} placeholder={t("الهاتف", "Phone")} value={value.phone} onChange={(e) => set({ phone: e.target.value })} />
      <input className={inputClass} placeholder={t("الساعات", "Hours")} value={value.hoursAr} onChange={(e) => set({ hoursAr: e.target.value })} />
      <input className={inputClass} placeholder="Hours" value={value.hoursEn} onChange={(e) => set({ hoursEn: e.target.value })} />
      <input className={inputClass} placeholder={t("الخدمات", "Services")} value={value.servicesAr} onChange={(e) => set({ servicesAr: e.target.value })} />
      <input className={inputClass} placeholder="Services" value={value.servicesEn} onChange={(e) => set({ servicesEn: e.target.value })} />
      <input className={inputClass} placeholder={t("خط العرض", "Latitude")} value={value.lat ?? ""} onChange={(e) => set({ lat: e.target.value })} />
      <input className={inputClass} placeholder={t("خط الطول", "Longitude")} value={value.lng ?? ""} onChange={(e) => set({ lng: e.target.value })} />
      <input className={inputClass} placeholder={t("صورة: https أو /media/…", "Photo: https or /media/…")} value={value.photoUrl} onChange={(e) => set({ photoUrl: e.target.value })} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={value.demo} onChange={(e) => set({ demo: e.target.checked })} />{t("تجريبي", "Demo")}</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={value.active} onChange={(e) => set({ active: e.target.checked })} />{t("نشط", "Active")}</label>
      <PrimaryButton type="submit">{submitLabel}</PrimaryButton>
    </form>
  );
}

function ServiceDesk() {
  const { t } = useI18n();
  const [rows, setRows] = useState<Service[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    void adminServices().then(setRows).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
  }, []);
  return (
    <div className="grid gap-4">
      <DeskError error={error} />
      {rows.map((row) => <ServiceEditor key={row.slug} row={row} onSaved={setRows} onError={setError} label={t("حفظ الخدمة", "Save service")} />)}
    </div>
  );
}

function ServiceEditor({ row, onSaved, onError, label }: { row: Service; onSaved: (rows: Service[]) => void; onError: (s: string) => void; label: string }) {
  const [summaryAr, setSummaryAr] = useState(row.summaryAr);
  const [bodyAr, setBodyAr] = useState(row.bodyAr);
  const [published, setPublished] = useState(true);
  return (
    <form className="grid gap-2 rounded-2xl border border-line bg-surface p-4" onSubmit={(e) => {
      e.preventDefault();
      void adminSaveService({ data: { slug: row.slug, summaryAr, summaryEn: row.summaryEn, bodyAr, bodyEn: row.bodyEn, published } })
        .then(onSaved)
        .catch((err: unknown) => onError(err instanceof Error ? err.message : "Error"));
    }}>
      <p className="font-medium">{row.titleAr}</p>
      <textarea className={`${inputClass} min-h-20 py-2`} value={summaryAr} onChange={(e) => setSummaryAr(e.target.value)} />
      <textarea className={`${inputClass} min-h-28 py-2`} value={bodyAr} onChange={(e) => setBodyAr(e.target.value)} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />نشر</label>
      <PrimaryButton type="submit">{label}</PrimaryButton>
    </form>
  );
}

function NewsDesk() {
  const { t } = useI18n();
  const [rows, setRows] = useState<NewsRow[]>([]);
  const [error, setError] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [bodyAr, setBodyAr] = useState("");
  useEffect(() => {
    void adminNews().then(setRows).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
  }, []);
  return (
    <div className="grid gap-3">
      <DeskError error={error} />
      <form className="grid gap-2 rounded-2xl border border-line bg-surface p-4" onSubmit={(e) => {
        e.preventDefault();
        void adminSaveNews({
          data: {
            id: 0, slug: "", kind: "announcement", titleAr, titleEn: titleAr, excerptAr: bodyAr.slice(0, 140),
            excerptEn: "", bodyAr, bodyEn: "", demo: true, published: true,
          },
        }).then((next) => {
          setRows(next);
          setTitleAr("");
          setBodyAr("");
        }).catch((err: unknown) => setError(err instanceof Error ? err.message : "Error"));
      }}>
        <input className={inputClass} placeholder={t("عنوان", "Title")} value={titleAr} onChange={(e) => setTitleAr(e.target.value)} />
        <textarea className={`${inputClass} min-h-28 py-2`} placeholder={t("النص", "Body")} value={bodyAr} onChange={(e) => setBodyAr(e.target.value)} />
        <PrimaryButton type="submit">{t("نشر إعلان تجريبي", "Publish a sample notice")}</PrimaryButton>
      </form>
      {rows.map((row) => (
        <div key={row.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
          <div>
            <p className="font-medium">{row.titleAr}</p>
            <p className="text-xs text-muted">{row.slug} · {row.published ? t("منشور", "Published") : t("مخفي", "Hidden")}</p>
          </div>
          <button type="button" className="text-sm text-primary" onClick={() => {
            void adminSaveNews({
              data: { ...row, published: !row.published },
            }).then(setRows).catch((err: unknown) => setError(err instanceof Error ? err.message : "Error"));
          }}>{row.published ? t("إخفاء", "Hide") : t("نشر", "Publish")}</button>
        </div>
      ))}
    </div>
  );
}

function SettingsDesk() {
  const { t } = useI18n();
  const [value, setValue] = useState<SiteSettings | null>(null);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  useEffect(() => {
    void adminSettings().then(setValue).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
  }, []);
  if (!value) return <DeskError error={error} />;
  const fields: ["phone" | "email" | "addressAr" | "whatsapp" | "facebook" | "xUrl" | "legalAr" | "ratesDisclaimerAr" | "replySlaAr" | "secureChannelAr" | "licenseImage" | "foundedOn", string][] = [
    ["phone", t("الهاتف", "Phone")],
    ["email", t("البريد", "Email")],
    ["addressAr", t("العنوان", "Address")],
    ["whatsapp", "WhatsApp"],
    ["facebook", "Facebook"],
    ["xUrl", "X"],
    ["legalAr", t("النص القانوني", "Legal note")],
    ["ratesDisclaimerAr", t("تنبيه الأسعار", "Rates notice")],
    ["replySlaAr", t("وعد زمن الرد", "Reply promise")],
    ["secureChannelAr", t("قناة تسليم كشوف المنظمات", "Secure list channel")],
    ["licenseImage", t("رابط صورة الترخيص", "License image URL")],
    ["foundedOn", t("تاريخ التأسيس عند اعتماده", "Founding date when approved")],
  ];
  return (
    <form className="grid gap-3" onSubmit={(e) => {
      e.preventDefault();
      setOk(false);
      void adminSaveSettings({ data: value }).then((next) => {
        setValue(next);
        setOk(true);
      }).catch((err: unknown) => setError(err instanceof Error ? err.message : "Error"));
    }}>
      <DeskError error={error} />
      {fields.map(([key, label]) => (
        <Field key={key} label={label}>
          <input className={inputClass} value={value[key]} onChange={(e) => setValue({ ...value, [key]: e.target.value })} />
        </Field>
      ))}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={value.ratesLive} onChange={(e) => setValue({ ...value, ratesLive: e.target.checked })} />
        {t("نشر لوحة الأسعار للعملاء بعد اعتماد الأرقام وإلغاء وسم التجربة", "Publish the rate board after the figures are approved and the sample mark is off")}
      </label>
      <p className="rounded-2xl bg-paper p-3 text-sm">
        {t("راجع قانونياً قبل التفعيل: عبارة المودعين والمساهمين والعوائد، وبند معايير أيزو. لن تظهر هاتان العبارتان للعميل حتى هذا الاعتماد.", "Review legally before enabling: the depositor, shareholder and return wording, and the ISO sentence. Those sentences stay off the public page until this acknowledgement.")}
      </p>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={value.aboutReviewAck} onChange={(e) => setValue({ ...value, aboutReviewAck: e.target.checked })} />
        {t("اعتماد صياغة المودعين وأيزو", "Acknowledge the depositor and ISO wording")}
      </label>
      {ok ? <p className="text-sm text-up">{t("حُفظ.", "Saved.")}</p> : null}
      <PrimaryButton type="submit">{t("حفظ بيانات التواصل", "Save contact details")}</PrimaryButton>
    </form>
  );
}

function RequestsDesk() {
  const { t } = useI18n();
  const [rows, setRows] = useState<Awaited<ReturnType<typeof adminServiceRequests>>>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    void adminServiceRequests().then(setRows).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
  }, []);
  return (
    <div className="grid gap-3">
      <DeskError error={error} />
      {rows.map((row) => (
        <article key={row.id} className="rounded-2xl border border-line bg-surface p-4 text-sm">
          <p className="font-medium">{row.reference} · {row.kind}</p>
          <p>{row.org_name} — {row.delegate_name} — {row.phone}</p>
          <p className="text-muted">{row.city}</p>
          <p className="mt-2">{row.need}</p>
        </article>
      ))}
    </div>
  );
}

function InquiryDesk() {
  const { t } = useI18n();
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    void adminInquiries().then(setRows).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
  }, []);
  return (
    <div className="grid gap-3">
      <DeskError error={error} />
      {rows.length === 0 ? <p className="text-muted">{t("لا طلبات بعد.", "No requests yet.")}</p> : null}
      {rows.map((row) => (
        <article key={row.id} className="rounded-2xl border border-line bg-surface p-4">
          <p className="font-medium">{row.name} · {row.topic}</p>
          <p className="text-sm text-muted">{row.phone} {row.email}</p>
          <p className="mt-2 text-sm">{row.message}</p>
          <div className="mt-3 flex gap-2">
            {["new", "in_progress", "closed"].map((status) => (
              <button key={status} type="button" className={`rounded-full px-3 py-2 text-xs ${row.status === status ? "bg-primary text-surface" : "border border-line"}`} onClick={() => {
                void adminInquiryStatus({ data: { id: row.id, status } }).then(setRows).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
              }}>{status}</button>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function TicketDesk() {
  const { t } = useI18n();
  const [rows, setRows] = useState<Ticket[]>([]);
  const [error, setError] = useState("");
  const [reply, setReply] = useState<Record<number, string>>({});
  useEffect(() => {
    void adminTickets().then(setRows).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
  }, []);
  return (
    <div className="grid gap-3">
      <DeskError error={error} />
      {rows.map((row) => (
        <article key={row.id} className="rounded-2xl border border-line bg-surface p-4">
          <p className="font-medium">{row.subject}</p>
          <p className="mt-2 text-sm">{row.body}</p>
          <textarea className={`${inputClass} mt-3 min-h-20 py-2`} value={reply[row.id] ?? row.reply} onChange={(e) => setReply({ ...reply, [row.id]: e.target.value })} />
          <div className="mt-2">
            <PrimaryButton onClick={() => {
              void adminReplyTicket({ data: { id: row.id, reply: reply[row.id] ?? row.reply, status: "answered" } })
                .then(setRows)
                .catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
            }}>{t("إرسال الرد", "Send reply")}</PrimaryButton>
          </div>
        </article>
      ))}
    </div>
  );
}

function TransferDesk() {
  const { lang, t } = useI18n();
  const [rows, setRows] = useState<AdminTransfer[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    reference: "", pin: "", status: "processing", currency: "USD", amount: "100",
    senderName: "", beneficiaryName: "", pickupCityAr: "", pickupCityEn: "", demo: true,
  });
  useEffect(() => {
    void adminTransfers().then(setRows).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
  }, []);
  return (
    <div className="grid gap-4">
      <DeskError error={error} />
      <form className="grid gap-2 rounded-2xl border border-line bg-surface p-4 md:grid-cols-3" onSubmit={(e) => {
        e.preventDefault();
        void adminCreateTransfer({ data: form }).then(setRows).catch((err: unknown) => setError(err instanceof Error ? err.message : "Error"));
      }}>
        <input className={inputClass} placeholder="KH-10001" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
        <input className={inputClass} placeholder={t("رمز 4 أرقام", "4-digit code")} value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value })} />
        <input className={inputClass} placeholder="USD" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
        <input className={inputClass} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <input className={inputClass} placeholder={t("المرسل", "Sender")} value={form.senderName} onChange={(e) => setForm({ ...form, senderName: e.target.value })} />
        <input className={inputClass} placeholder={t("المستفيد", "Beneficiary")} value={form.beneficiaryName} onChange={(e) => setForm({ ...form, beneficiaryName: e.target.value })} />
        <PrimaryButton type="submit">{t("إنشاء حوالة", "Create transfer")}</PrimaryButton>
      </form>
      {rows.map((row) => (
        <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
          <div>
            <p className="font-medium tabular-nums">{row.reference}</p>
            <p className="text-sm text-muted">{statusLabel(row.status, lang)} · {row.currency} · {row.linked ? t("مرتبطة بحساب", "Linked") : t("غير مرتبطة", "Unlinked")}</p>
          </div>
          <select className={inputClass} value={row.status} onChange={(e) => {
            void adminTransferStatus({ data: { id: row.id, status: e.target.value } }).then(setRows).catch((err: unknown) => setError(err instanceof Error ? err.message : "Error"));
          }}>
            {["draft", "processing", "sent", "ready", "collected", "cancelled", "rejected"].map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}

function StaffDesk() {
  const { lang, t } = useI18n();
  const [rows, setRows] = useState<StaffRow[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    void adminStaff().then(setRows).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
  }, []);
  return (
    <div className="grid gap-3">
      <DeskError error={error} />
      <p className="text-sm text-muted">{t("أقل صلاحية: العميل لا يدير شيئاً. التقارير تقرأ المؤشرات والتدقيق. كل دور تشغيلي يغيّر جدوله فقط. لا يُحذف آخر مدير.", "Least privilege: a customer manages nothing. Reports can read indicators and the audit log. Each operating role edits only its own desk. The last admin cannot be removed.")}</p>
      {rows.map((row) => (
        <div key={row.userId} className="grid items-center gap-2 rounded-2xl border border-line bg-surface p-4 md:grid-cols-3">
          <div>
            <p className="font-medium">{row.displayName || row.userId}</p>
            <p className="text-xs text-muted">{roleLabel(row.role, lang)}</p>
          </div>
          <select className={inputClass} value={row.role} onChange={(e) => {
            void adminSetRole({ data: { userId: row.userId, role: e.target.value } }).then(setRows).catch((err: unknown) => setError(err instanceof Error ? err.message : "Error"));
          }}>
            {ROLES.map((role) => <option key={role} value={role}>{roleLabel(role, lang)}</option>)}
          </select>
          <p className="text-xs text-muted tabular-nums">{row.createdAt}</p>
        </div>
      ))}
    </div>
  );
}

function AuditDesk() {
  const { t } = useI18n();
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    void adminAudit().then(setRows).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
  }, []);
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <DeskError error={error} />
      <table className="w-full min-w-[40rem] text-sm">
        <thead className="text-muted">
          <tr className="border-b border-line">
            <th className="px-3 py-2 text-start">{t("الوقت", "Time")}</th>
            <th className="px-3 py-2 text-start">{t("الإجراء", "Action")}</th>
            <th className="px-3 py-2 text-start">{t("السجل", "Record")}</th>
            <th className="px-3 py-2 text-start">{t("التفصيل", "Detail")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-line">
              <td className="px-3 py-2 tabular-nums">{row.createdAt}</td>
              <td className="px-3 py-2">{row.action}</td>
              <td className="px-3 py-2">{row.entity} {row.entityId}</td>
              <td className="px-3 py-2">{row.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 ? <p className="p-4 text-sm text-muted">{t("لا حركات بعد.", "No entries yet.")}</p> : null}
    </div>
  );
}

function PagesDesk() {
  const { t } = useI18n();
  const [rows, setRows] = useState<ManagedPage[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    void adminPages().then(setRows).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
  }, []);
  return (
    <div className="grid gap-3">
      <DeskError error={error} />
      {rows.map((row) => <PageEditor key={row.slug} row={row} onSaved={setRows} onError={setError} />)}
    </div>
  );
}

function PageEditor({ row, onSaved, onError }: { row: ManagedPage; onSaved: (rows: ManagedPage[]) => void; onError: (s: string) => void }) {
  const { t } = useI18n();
  const [value, setValue] = useState(row);
  return (
    <form className="grid gap-2 rounded-2xl border border-line bg-surface p-4" onSubmit={(e) => {
      e.preventDefault();
      void adminSavePage({ data: value }).then(onSaved).catch((err: unknown) => onError(err instanceof Error ? err.message : "Error"));
    }}>
      <p className="text-sm text-gold">{value.slug}</p>
      <input className={inputClass} value={value.titleAr} onChange={(e) => setValue({ ...value, titleAr: e.target.value })} />
      <input className={inputClass} value={value.titleEn} onChange={(e) => setValue({ ...value, titleEn: e.target.value })} />
      <textarea className={`${inputClass} min-h-28 py-3`} value={value.bodyAr} onChange={(e) => setValue({ ...value, bodyAr: e.target.value })} />
      <textarea className={`${inputClass} min-h-28 py-3`} value={value.bodyEn} onChange={(e) => setValue({ ...value, bodyEn: e.target.value })} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={value.published} onChange={(e) => setValue({ ...value, published: e.target.checked })} />{t("منشور", "Published")}</label>
      {["privacy", "terms", "compliance", "aml", "kyc", "fraud"].includes(value.slug) ? (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={value.legalApproved} onChange={(e) => setValue({ ...value, legalApproved: e.target.checked })} />
          {t("اعتماد المستشار القانوني للنشر العام", "Counsel approval for public release")}
        </label>
      ) : null}
      <PrimaryButton type="submit">{t("حفظ الصفحة", "Save page")}</PrimaryButton>
    </form>
  );
}

type PartnerAdmin = Partner & { published: boolean };

const emptyPartner = (): PartnerAdmin => ({
  id: 0, nameAr: "", nameEn: "", kind: "network", noteAr: "", noteEn: "", url: "", demo: true, published: false,
});

function PartnersDesk() {
  const { t } = useI18n();
  const [rows, setRows] = useState<PartnerAdmin[]>([]);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<PartnerAdmin>(emptyPartner());
  useEffect(() => {
    void adminPartners().then(setRows).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
  }, []);
  return (
    <div className="grid gap-3">
      <DeskError error={error} />
      <p className="text-sm text-muted">{t("لا تُنشر جهة إلا بعد اتفاق حقيقي. الرابط إن وُجد يبدأ بـ https.", "Publish a party only after a real agreement. A link, if any, starts with https.")}</p>
      <PartnerForm value={draft} onChange={setDraft} label={t("إضافة", "Add")} onSubmit={() => {
        void adminSavePartner({ data: draft }).then((next) => { setRows(next); setDraft(emptyPartner()); }).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
      }} />
      {rows.map((row) => <PartnerEditor key={row.id} row={row} onSaved={setRows} onError={setError} />)}
    </div>
  );
}

function PartnerEditor({ row, onSaved, onError }: { row: PartnerAdmin; onSaved: (rows: PartnerAdmin[]) => void; onError: (s: string) => void }) {
  const [value, setValue] = useState(row);
  const { t } = useI18n();
  return <PartnerForm value={value} onChange={setValue} label={t("تحديث", "Update")} onSubmit={() => {
    void adminSavePartner({ data: value }).then(onSaved).catch((e: unknown) => onError(e instanceof Error ? e.message : "Error"));
  }} />;
}

function PartnerForm({ value, onChange, onSubmit, label }: { value: PartnerAdmin; onChange: (v: PartnerAdmin) => void; onSubmit: () => void; label: string }) {
  const { t } = useI18n();
  const set = (patch: Partial<PartnerAdmin>) => onChange({ ...value, ...patch });
  return (
    <form className="grid gap-2 rounded-2xl border border-line bg-surface p-4 md:grid-cols-2" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <input className={inputClass} placeholder={t("الاسم عربي", "Arabic name")} value={value.nameAr} onChange={(e) => set({ nameAr: e.target.value })} />
      <input className={inputClass} placeholder={t("الاسم إنجليزي", "English name")} value={value.nameEn} onChange={(e) => set({ nameEn: e.target.value })} />
      <input className={inputClass} placeholder={t("ملاحظة", "Note")} value={value.noteAr} onChange={(e) => set({ noteAr: e.target.value })} />
      <input className={inputClass} placeholder="Note" value={value.noteEn} onChange={(e) => set({ noteEn: e.target.value })} />
      <input className={inputClass} placeholder="https://" value={value.url} onChange={(e) => set({ url: e.target.value })} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={value.demo} onChange={(e) => set({ demo: e.target.checked })} />{t("تجريبي", "Demo")}</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={value.published} onChange={(e) => set({ published: e.target.checked })} />{t("منشور", "Published")}</label>
      <PrimaryButton type="submit">{label}</PrimaryButton>
    </form>
  );
}

function ComplaintsDesk() {
  const { lang, t } = useI18n();
  const [rows, setRows] = useState<ComplaintRow[]>([]);
  const [error, setError] = useState("");
  const [reply, setReply] = useState<Record<number, string>>({});
  const [status, setStatus] = useState<Record<number, string>>({});
  useEffect(() => {
    void adminComplaints().then(setRows).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
  }, []);
  return (
    <div className="grid gap-3">
      <DeskError error={error} />
      {rows.length === 0 ? <p className="text-sm text-muted">{t("لا شكاوى بعد.", "No complaints yet.")}</p> : null}
      {rows.map((row) => (
        <article key={row.id} className="rounded-2xl border border-line bg-surface p-4">
          <p className="font-medium tabular-nums">{row.reference} · {row.topic}</p>
          <p className="mt-1 text-sm text-muted">{row.name} · {row.phone} · {row.createdAt}</p>
          <p className="mt-2 text-sm">{row.message}</p>
          <textarea className={`${inputClass} mt-3 min-h-20 py-2`} value={reply[row.id] ?? row.reply} onChange={(e) => setReply({ ...reply, [row.id]: e.target.value })} />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <select className={inputClass} value={status[row.id] ?? row.status} onChange={(e) => setStatus({ ...status, [row.id]: e.target.value })}>
              <option value="received">received</option>
              <option value="reviewing">reviewing</option>
              <option value="closed">closed</option>
            </select>
            <PrimaryButton onClick={() => {
              void adminReplyComplaint({ data: { id: row.id, reply: reply[row.id] ?? row.reply, status: status[row.id] ?? row.status } })
                .then(setRows)
                .catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
            }}>{lang === "ar" ? "حفظ الرد" : "Save reply"}</PrimaryButton>
          </div>
        </article>
      ))}
    </div>
  );
}

function CustomersDesk() {
  const { lang, t } = useI18n();
  const [rows, setRows] = useState<StaffRow[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    void adminCustomers().then(setRows).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
  }, []);
  return (
    <div className="grid gap-3">
      <DeskError error={error} />
      <p className="text-sm text-muted">{t("حسابات بدور عميل فقط. تغيير الدور يتم من صلاحيات مدير النظام.", "Customer-role accounts only. Role changes stay with the system admin.")}</p>
      {rows.map((row) => (
        <div key={row.userId} className="rounded-2xl border border-line bg-surface p-4">
          <p className="font-medium">{row.displayName || row.userId}</p>
          <p className="text-sm text-muted">{row.phone || t("بلا هاتف", "No phone")} · {roleLabel(row.role, lang)} · {row.createdAt}</p>
        </div>
      ))}
    </div>
  );
}

const emptyJob = (): JobPost => ({ id: 0, titleAr: "", titleEn: "", cityAr: "", cityEn: "", bodyAr: "", bodyEn: "", published: false });

function JobsDesk() {
  const { t } = useI18n();
  const [rows, setRows] = useState<JobPost[]>([]);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<JobPost>(emptyJob());
  useEffect(() => {
    void adminJobs().then(setRows).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
  }, []);
  return (
    <div className="grid gap-3">
      <DeskError error={error} />
      <JobForm value={draft} onChange={setDraft} label={t("إضافة وظيفة", "Add role")} onSubmit={() => {
        void adminSaveJob({ data: draft }).then((next) => { setRows(next); setDraft(emptyJob()); }).catch((e: unknown) => setError(e instanceof Error ? e.message : "Error"));
      }} />
      {rows.map((row) => <JobEditor key={row.id} row={row} onSaved={setRows} onError={setError} />)}
    </div>
  );
}

function JobEditor({ row, onSaved, onError }: { row: JobPost; onSaved: (rows: JobPost[]) => void; onError: (s: string) => void }) {
  const [value, setValue] = useState(row);
  const { t } = useI18n();
  return <JobForm value={value} onChange={setValue} label={t("تحديث", "Update")} onSubmit={() => {
    void adminSaveJob({ data: value }).then(onSaved).catch((e: unknown) => onError(e instanceof Error ? e.message : "Error"));
  }} />;
}

function JobForm({ value, onChange, onSubmit, label }: { value: JobPost; onChange: (v: JobPost) => void; onSubmit: () => void; label: string }) {
  const { t } = useI18n();
  const set = (patch: Partial<JobPost>) => onChange({ ...value, ...patch });
  return (
    <form className="grid gap-2 rounded-2xl border border-line bg-surface p-4" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <input className={inputClass} placeholder={t("المسمى", "Title")} value={value.titleAr} onChange={(e) => set({ titleAr: e.target.value })} />
      <input className={inputClass} placeholder="Title" value={value.titleEn} onChange={(e) => set({ titleEn: e.target.value })} />
      <input className={inputClass} placeholder={t("المدينة", "City")} value={value.cityAr} onChange={(e) => set({ cityAr: e.target.value })} />
      <input className={inputClass} placeholder="City" value={value.cityEn} onChange={(e) => set({ cityEn: e.target.value })} />
      <textarea className={`${inputClass} min-h-24 py-3`} value={value.bodyAr} onChange={(e) => set({ bodyAr: e.target.value })} />
      <textarea className={`${inputClass} min-h-24 py-3`} value={value.bodyEn} onChange={(e) => set({ bodyEn: e.target.value })} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={value.published} onChange={(e) => set({ published: e.target.checked })} />{t("منشور", "Published")}</label>
      <PrimaryButton type="submit">{label}</PrimaryButton>
    </form>
  );
}

