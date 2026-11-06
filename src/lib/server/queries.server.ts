import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { getRequest } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";
import type {
  AdminTransfer,
  AuditRow,
  Branch,
  ComplaintRow,
  ComplaintTrack,
  Faq,
  Inquiry,
  JobPost,
  ManagedPage,
  NewsItem,
  Notice,
  OwnedTransfer,
  Partner,
  Profile,
  PublicHome,
  PublicView,
  RateRow,
  Service,
  SiteSettings,
  StaffRow,
  Ticket,
  TrackResult,
} from "@/lib/domain";
import { isTransferStatus } from "@/lib/money";

type Sql = Awaited<ReturnType<typeof getSql>>;

function strings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function hashPin(pin: string) {
  return createHash("sha256").update(pin.trim()).digest("hex");
}

function pinMatches(pin: string, stored: string) {
  const a = Buffer.from(hashPin(pin));
  const b = Buffer.from(stored);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function clientIp() {
  try {
    const request = getRequest();
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    return forwarded || request.headers.get("x-real-ip") || "local";
  } catch {
    return "local";
  }
}

function pace(started: number, ms = 380) {
  const left = ms - (Date.now() - started);
  if (left <= 0) return Promise.resolve();
  return new Promise<void>((resolve) => setTimeout(resolve, left));
}

const LEGAL_SLUGS = new Set(["privacy", "terms", "compliance", "aml", "kyc", "fraud"]);
const PUBLIC_SERVICES = new Set([
  "individuals",
  "corporate",
  "humanitarian",
  "aid-cash",
  "aid-guarantor",
  "aid-deposit",
]);

function publicCopy(text: string, ack: boolean) {
  if (ack || !text) return text;
  const kept = text.split(/(?<=[.!\n])/).filter((part) => !/أيزو|ISO|المودعين|المساهمين/.test(part));
  return kept.join("").replace(/\n{3,}/g, "\n\n").trim();
}

function customerFacingFaq(faq: { questionAr: string; answerAr: string; answerEn: string }) {
  if (faq.questionAr.includes("الخريطة")) return false;
  const blob = `${faq.questionAr}\n${faq.answerAr}\n${faq.answerEn}`;
  return !/مزروع|تجريب|موسوم|لن يُحاك|هذه النسخة|لوحة التحكم|حساب على الموقع|حساب الموقع|الحساب الرقمي|الخضر أونلاين|لم يُسلّ/.test(blob);
}

function publicNewsText(text: string) {
  return text
    .replace(/الخريطة تبقى بلا نقاط حتى تُسلَّم الإحداثيات\.?/g, "يمكن فتح العنوان في خرائط جوجل من بطاقة الفرع.")
    .replace(/لم تُسلَّم إحداثيات، لذلك لا تُرسم نقاط على الخريطة\.?\s*/g, "")
    .replace(/ساعات العمل لكل فرع لم تُحدَّد بعد\.?\s*/g, "")
    .replace(/The map stays without pins until coordinates are supplied\.?/g, "Open the address in Google Maps from the branch card.")
    .replace(/Coordinates were not supplied, so no map pins are drawn\.?\s*/g, "")
    .replace(/Working hours for each branch are not set yet\.?\s*/g, "")
    .trim();
}

async function audit(
  sql: Sql,
  actorId: string,
  action: string,
  entity: string,
  entityId: string,
  detail: string,
) {
  await sql`
    insert into audit_log (actor_id, action, entity, entity_id, detail)
    values (${actorId}, ${action}, ${entity}, ${entityId}, ${detail})
  `;
}

const PERMS: Record<string, string[]> = {
  system_admin: ["*"],
  content: ["content", "read"],
  rates: ["rates", "read"],
  branches: ["branches", "read"],
  support: ["support", "read"],
  reports: ["read", "audit", "networks"],
  customer: [],
  networks_officer: ["read", "networks", "networks_write"],
  settlements_officer: ["read", "networks", "networks_money"],
  accountant: ["read", "networks", "networks_money", "networks_fees"],
  finance_manager: ["read", "networks", "networks_write", "networks_fees", "networks_money", "networks_approve"],
  operations_manager: ["read", "networks", "networks_write", "networks_fees"],
  transfers_manager: ["read", "networks", "networks_write"],
  inquiry_officer: ["read", "networks"],
};

export function roleHas(role: string, perm: string) {
  const list = PERMS[role] ?? [];
  return list.includes("*") || list.includes(perm);
}

export async function limit(bucket: string, max: number, windowSec: number) {
  const sql = await getSql();
  const rows = await sql<{ hits: number; window_start: string }>`
    select hits, window_start::text as window_start from rate_limits where bucket = ${bucket}
  `;
  const fresh =
    !rows[0] || Date.now() - Date.parse(rows[0].window_start) > windowSec * 1000;
  if (fresh) {
    await sql`
      insert into rate_limits (bucket, hits, window_start)
      values (${bucket}, 1, now())
      on conflict (bucket) do update set hits = 1, window_start = now()
    `;
    return;
  }
  if (rows[0].hits >= max) throw new Error("تم تجاوز عدد المحاولات. حاول بعد قليل.");
  await sql`update rate_limits set hits = hits + 1 where bucket = ${bucket}`;
}

async function readSettings(sql: Sql): Promise<SiteSettings> {
  const rows = await sql<Record<string, string>>`
    select phone, email, address_ar, address_en, hours_ar, hours_en, whatsapp, facebook,
      x_url, instagram, about_ar, about_en, vision_ar, vision_en, mission_ar, mission_en,
      values_ar, values_en, goals_ar, goals_en, commitment_ar, commitment_en,
      transparency_ar, transparency_en, respect_ar, respect_en, strategy_ar, strategy_en,
      legal_ar, legal_en,
      rates_disclaimer_ar, rates_disclaimer_en,
      rates_live, about_review_ack, reply_sla_ar, reply_sla_en,
      secure_channel_ar, secure_channel_en, license_image, founded_on
    from site_settings where id = 1
  `;
  const s = rows[0];
  if (!s) throw new Error("إعدادات الموقع غير مهيأة");
  return {
    phone: s.phone,
    email: s.email,
    addressAr: s.address_ar,
    addressEn: s.address_en,
    hoursAr: s.hours_ar,
    hoursEn: s.hours_en,
    whatsapp: s.whatsapp,
    facebook: s.facebook,
    xUrl: s.x_url,
    instagram: s.instagram,
    aboutAr: s.about_ar,
    aboutEn: s.about_en,
    visionAr: s.vision_ar,
    visionEn: s.vision_en,
    missionAr: s.mission_ar,
    missionEn: s.mission_en,
    valuesAr: s.values_ar,
    valuesEn: s.values_en,
    goalsAr: s.goals_ar,
    goalsEn: s.goals_en,
    commitmentAr: s.commitment_ar,
    commitmentEn: s.commitment_en,
    transparencyAr: s.transparency_ar,
    transparencyEn: s.transparency_en,
    respectAr: s.respect_ar,
    respectEn: s.respect_en,
    strategyAr: s.strategy_ar,
    strategyEn: s.strategy_en,
    legalAr: s.legal_ar,
    legalEn: s.legal_en,
    ratesDisclaimerAr: s.rates_disclaimer_ar,
    ratesDisclaimerEn: s.rates_disclaimer_en,
    ratesLive: Boolean(s.rates_live),
    aboutReviewAck: Boolean(s.about_review_ack),
    replySlaAr: s.reply_sla_ar ?? "",
    replySlaEn: s.reply_sla_en ?? "",
    secureChannelAr: s.secure_channel_ar ?? "",
    secureChannelEn: s.secure_channel_en ?? "",
    licenseImage: s.license_image ?? "",
    foundedOn: s.founded_on ?? "",
  };
}

function mapService(row: Record<string, unknown>): Service {
  return {
    slug: String(row.slug),
    titleAr: String(row.title_ar),
    titleEn: String(row.title_en),
    summaryAr: String(row.summary_ar),
    summaryEn: String(row.summary_en),
    bodyAr: String(row.body_ar),
    bodyEn: String(row.body_en),
    audienceAr: String(row.audience_ar ?? ""),
    audienceEn: String(row.audience_en ?? ""),
    coversAr: strings(row.covers_ar),
    coversEn: strings(row.covers_en),
    stepsAr: strings(row.steps_ar),
    stepsEn: strings(row.steps_en),
    requirementsAr: strings(row.requirements_ar),
    requirementsEn: strings(row.requirements_en),
    feesAr: String(row.fees_ar),
    feesEn: String(row.fees_en),
    sortOrder: Number(row.sort_order),
  };
}

function mapBranch(row: Record<string, unknown>): Branch {
  return {
    id: Number(row.id),
    kind: row.kind === "agent" ? "agent" : "branch",
    nameAr: String(row.name_ar),
    nameEn: String(row.name_en),
    governorateAr: String(row.governorate_ar),
    governorateEn: String(row.governorate_en),
    cityAr: String(row.city_ar),
    cityEn: String(row.city_en),
    addressAr: String(row.address_ar),
    addressEn: String(row.address_en),
    phone: String(row.phone ?? ""),
    hoursAr: String(row.hours_ar),
    hoursEn: String(row.hours_en),
    servicesAr: String(row.services_ar),
    servicesEn: String(row.services_en),
    lat: row.lat == null ? null : String(row.lat),
    lng: row.lng == null ? null : String(row.lng),
    photoUrl: String(row.photo_url ?? ""),
    demo: Boolean(row.is_demo),
    active: Boolean(row.active),
  };
}

function mapNews(row: Record<string, unknown>): NewsItem {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    kind: String(row.kind),
    titleAr: String(row.title_ar),
    titleEn: String(row.title_en),
    excerptAr: String(row.excerpt_ar),
    excerptEn: String(row.excerpt_en),
    bodyAr: String(row.body_ar),
    bodyEn: String(row.body_en),
    demo: Boolean(row.is_demo),
    publishedAt: String(row.published_at),
  };
}

function mapRate(row: Record<string, unknown>): RateRow {
  const direction = row.direction === "up" || row.direction === "down" ? row.direction : "flat";
  return {
    id: Number(row.id),
    code: String(row.code),
    nameAr: String(row.name_ar),
    nameEn: String(row.name_en),
    buy: String(row.buy),
    sell: String(row.sell),
    direction,
    demo: Boolean(row.is_demo),
    updatedAt: String(row.updated_at),
    changePct: String(row.change_pct ?? "0"),
    region: String(row.region ?? ""),
    base: Boolean(row.is_base),
  };
}

export async function loadHome(): Promise<PublicHome> {
  const sql = await getSql();
  const [settings, services, faqs, rates, branches, news, partners] = await Promise.all([
    readSettings(sql),
    sql<Record<string, unknown>>`
      select * from services where published = true order by sort_order
    `,
    sql<Record<string, unknown>>`
      select id, service_slug, topic, question_ar, question_en, answer_ar, answer_en
      from faqs where published = true order by sort_order
    `,
    sql<Record<string, unknown>>`
      select id, code, name_ar, name_en, buy::text, sell::text, direction, is_demo,
        change_pct::text, region, is_base,
        to_char(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at
      from rates order by sort_order, code
    `,
    sql<Record<string, unknown>>`
      select * from branches where active = true
      order by case when name_ar = 'المركز الرئيسي' then 0 else 1 end, governorate_ar, name_ar
    `,
    sql<Record<string, unknown>>`
      select id, slug, kind, title_ar, title_en, excerpt_ar, excerpt_en, body_ar, body_en,
        is_demo, to_char(published_at, 'YYYY-MM-DD HH24:MI') as published_at
      from news_posts where published = true order by published_at desc
    `,
    sql<Record<string, unknown>>`
      select id, name_ar, name_en, kind, note_ar, note_en, url, is_demo
      from partners where published = true order by sort_order, id
    `,
  ]);
  return {
    settings,
    services: services.map(mapService),
    faqs: faqs.map((row) => ({
      id: Number(row.id),
      serviceSlug: row.service_slug == null ? null : String(row.service_slug),
      topic: String(row.topic ?? "general"),
      questionAr: String(row.question_ar),
      questionEn: String(row.question_en),
      answerAr: String(row.answer_ar),
      answerEn: String(row.answer_en),
    })),
    rates: rates.map(mapRate),
    branches: branches.map(mapBranch),
    news: news.map(mapNews),
    partners: partners.map(mapPartner),
  };
}

export async function loadPublication() {
  const sql = await getSql();
  const [settings, jobs, pages, rates] = await Promise.all([
    sql<{ rates_live: boolean }>`select rates_live from site_settings where id = 1`,
    sql<{ n: number }>`select count(*)::int as n from jobs where published = true`,
    sql<{ slug: string }>`select slug from managed_pages where published = true and legal_approved = true`,
    sql<{ n: number }>`select count(*)::int as n from rates where is_demo = false and is_base = false`,
  ]);
  return {
    ratesLive: Boolean(settings[0]?.rates_live) && (rates[0]?.n ?? 0) > 0,
    openJobs: jobs[0]?.n ?? 0,
    approvedPages: pages.map((page) => page.slug),
  };
}

export async function loadPublicHome(): Promise<PublicView> {
  const home = await loadHome();
  const sql = await getSql();
  const [branchSlugs, partnerExtra, jobs, pages] = await Promise.all([
    sql<{ id: number; slug: string }>`select id, slug from branches`,
    sql<{ id: number; slug: string; logo_url: string; country: string }>`
      select id, slug, logo_url, country from partners
    `,
    sql<{ n: number }>`select count(*)::int as n from jobs where published = true`,
    sql<{ slug: string }>`select slug from managed_pages where published = true and legal_approved = true`,
  ]);
  const slugs = new Map(branchSlugs.map((row) => [row.id, row.slug]));
  const extras = new Map(partnerExtra.map((row) => [row.id, row]));
  const ack = home.settings.aboutReviewAck;
  const approvedRates = home.rates.filter((rate) => !rate.demo);
  const ratesLive = home.settings.ratesLive && approvedRates.length > 0;
  const news = home.news.filter((item) => !item.demo && item.kind !== "guide").map((item) => ({
    ...item,
    excerptAr: publicNewsText(item.excerptAr),
    excerptEn: publicNewsText(item.excerptEn),
    bodyAr: publicNewsText(item.bodyAr),
    bodyEn: publicNewsText(item.bodyEn),
  }));
  const guides = home.news.filter((item) => !item.demo && item.kind === "guide").map((item) => ({
    ...item,
    excerptAr: publicNewsText(item.excerptAr),
    excerptEn: publicNewsText(item.excerptEn),
    bodyAr: publicNewsText(item.bodyAr),
    bodyEn: publicNewsText(item.bodyEn),
  }));
  return {
    ...home,
    settings: {
      ...home.settings,
      commitmentAr: publicCopy(home.settings.commitmentAr, ack),
      commitmentEn: publicCopy(home.settings.commitmentEn, ack),
      missionAr: publicCopy(home.settings.missionAr, ack),
      missionEn: publicCopy(home.settings.missionEn, ack),
      strategyAr: publicCopy(home.settings.strategyAr, ack),
      strategyEn: publicCopy(home.settings.strategyEn, ack),
    },
    rates: ratesLive ? approvedRates : [],
    news,
    guides,
    services: home.services.filter((service) => PUBLIC_SERVICES.has(service.slug)),
    faqs: home.faqs.filter(customerFacingFaq),
    branches: home.branches.filter((branch) => !branch.demo).map((branch) => ({
      ...branch,
      slug: slugs.get(branch.id) || "",
    })),
    partners: home.partners
      .filter((partner) => !partner.demo && partner.kind !== "local_circular" && !/swift|سويفت/i.test(`${partner.nameAr} ${partner.nameEn}`))
      .map((partner) => {
        const extra = extras.get(partner.id);
        return {
          ...partner,
          slug: extra?.slug || "",
          logoUrl: extra?.logo_url || "",
          country: extra?.country || "",
        };
      }),
    publication: {
      ratesLive,
      openJobs: jobs[0]?.n ?? 0,
      approvedPages: pages.map((page) => page.slug),
    },
  };
}

export async function loadPublicBranch(slug: string) {
  const home = await loadPublicHome();
  return home.branches.find((branch) => branch.slug === slug) ?? null;
}

export async function loadPublicRateHistory() {
  const home = await loadPublicHome();
  if (!home.publication.ratesLive) return [];
  const sql = await getSql();
  return sql<{ code: string; region: string; buy: string; sell: string; at: string }>`
    select r.code, r.region, h.buy::text as buy, h.sell::text as sell,
      to_char(h.recorded_at, 'YYYY-MM-DD HH24:MI') as at
    from rate_history h
    join rates r on r.id = h.rate_id
    where r.is_demo = false
    order by h.recorded_at
  `;
}

export async function loadService(slug: string) {
  if (!PUBLIC_SERVICES.has(slug)) return null;
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select * from services where slug = ${slug} and published = true
  `;
  if (!rows[0]) return null;
  const faqs = await sql<Record<string, unknown>>`
    select id, service_slug, topic, question_ar, question_en, answer_ar, answer_en
    from faqs where published = true and (service_slug = ${slug} or service_slug is null)
    order by sort_order
  `;
  return {
    service: mapService(rows[0]),
    faqs: faqs.map((row) => ({
      id: Number(row.id),
      serviceSlug: row.service_slug == null ? null : String(row.service_slug),
      topic: String(row.topic ?? "general"),
      questionAr: String(row.question_ar),
      questionEn: String(row.question_en),
      answerAr: String(row.answer_ar),
      answerEn: String(row.answer_en),
    })) satisfies Faq[],
  };
}

export async function loadNewsItem(slug: string) {
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select id, slug, kind, title_ar, title_en, excerpt_ar, excerpt_en, body_ar, body_en,
      is_demo, to_char(published_at, 'YYYY-MM-DD HH24:MI') as published_at
    from news_posts where slug = ${slug} and published = true
  `;
  return rows[0] && !rows[0].is_demo ? mapNews(rows[0]) : null;
}

export async function trackTransfer(reference: string, pin: string): Promise<TrackResult> {
  const started = Date.now();
  const ref = reference.trim().toUpperCase();
  const fail = async (): Promise<TrackResult> => {
    await pace(started);
    return { ok: false };
  };
  if (!/^[A-Z0-9-]{4,32}$/.test(ref) || !/^\d{4,8}$/.test(pin.trim())) return fail();
  try {
    await limit(`track-ip:${clientIp()}`, 20, 600);
    await limit(`track:${ref}`, 8, 600);
  } catch {
    await pace(started);
    throw new Error("تعذّر الاستعلام الآن. يمكنك المحاولة لاحقاً أو تقديم شكوى.");
  }
  const sql = await getSql();
  const rows = await sql<{
    pin_hash: string;
    status: string;
    currency: string;
    pickup_city_ar: string;
    pickup_city_en: string;
    is_demo: boolean;
    updated_at: string;
  }>`
    select pin_hash, status, currency, pickup_city_ar, pickup_city_en, is_demo,
      to_char(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at
    from transfers where reference = ${ref}
  `;
  const row = rows[0];
  if (!row || row.is_demo || !pinMatches(pin, row.pin_hash)) return fail();
  await pace(started);
  return {
    ok: true,
    demo: false,
    status: row.status,
    currency: row.currency,
    pickupCityAr: row.pickup_city_ar,
    pickupCityEn: row.pickup_city_en,
    updatedAt: row.updated_at,
  };
}

function cleanPhone(value: string) {
  const phone = value.trim();
  if (!/^[0-9+\s-]{7,20}$/.test(phone)) throw new Error("رقم الهاتف غير صالح");
  return phone;
}

export async function createInquiry(input: {
  name: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
  companyWebsite: string;
  idempotencyKey: string;
}) {
  if (input.companyWebsite.trim()) return { ok: true as const, duplicate: false };
  const name = input.name.trim();
  const message = input.message.trim();
  const email = input.email.trim();
  const topics = ["general", "rates", "transfer", "branch", "corporate", "complaint"];
  if (name.length < 2 || name.length > 80) throw new Error("تحقق من الاسم");
  if (message.length < 10 || message.length > 2000) throw new Error("نص الرسالة أقصر أو أطول من الحد");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("البريد غير صالح");
  if (!topics.includes(input.topic)) throw new Error("نوع الاستفسار غير معروف");
  const phone = cleanPhone(input.phone);
  const key = input.idempotencyKey.trim();
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(key)) throw new Error("تعذر تمييز الطلب");
  await limit(`inquiry-ip:${clientIp()}`, 20, 3600);
  await limit(`inquiry:${phone}`, 5, 3600);
  const sql = await getSql();
  const saved = await sql<{ key: string }>`
    insert into idempotency_keys (key, scope) values (${key}, 'inquiry')
    on conflict (key) do nothing
    returning key
  `;
  if (!saved[0]) return { ok: true as const, duplicate: true };
  await sql`
    insert into inquiries (name, phone, email, topic, message)
    values (${name}, ${phone}, ${email}, ${input.topic}, ${message})
  `;
  return { ok: true as const, duplicate: false };
}

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    userId: String(row.user_id),
    displayName: String(row.display_name ?? ""),
    phone: String(row.phone ?? ""),
    role: String(row.role),
    phoneVerified: Boolean(row.phone_verified),
  };
}

export async function ensureProfile(userId: string, name: string): Promise<Profile> {
  const sql = await getSql();
  const display = name.trim().slice(0, 80);
  const rows = await sql<Record<string, unknown>>`
    insert into profiles (user_id, display_name)
    values (${userId}, ${display})
    on conflict (user_id) do update
      set display_name = case
        when profiles.display_name = '' then excluded.display_name
        else profiles.display_name
      end,
      updated_at = now()
    returning user_id, display_name, phone, role, phone_verified
  `;
  return mapProfile(rows[0]);
}

export async function updateOwnProfile(userId: string, displayName: string, phone: string) {
  const name = displayName.trim();
  if (name.length < 2 || name.length > 80) throw new Error("تحقق من الاسم");
  const nextPhone = phone.trim() ? cleanPhone(phone) : "";
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    update profiles
    set display_name = ${name}, phone = ${nextPhone}, phone_verified = false, updated_at = now()
    where user_id = ${userId}
    returning user_id, display_name, phone, role, phone_verified
  `;
  if (!rows[0]) throw new Error("الملف غير موجود");
  return mapProfile(rows[0]);
}

function mapOwned(row: Record<string, unknown>): OwnedTransfer {
  return {
    id: Number(row.id),
    reference: String(row.reference),
    status: String(row.status),
    currency: String(row.currency),
    amount: String(row.amount),
    senderName: String(row.sender_name),
    beneficiaryName: String(row.beneficiary_name),
    pickupCityAr: String(row.pickup_city_ar),
    pickupCityEn: String(row.pickup_city_en),
    demo: Boolean(row.is_demo),
    updatedAt: String(row.updated_at),
  };
}

export async function listOwnedTransfers(userId: string) {
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select id, reference, status, currency, amount::text, sender_name, beneficiary_name,
      pickup_city_ar, pickup_city_en, is_demo,
      to_char(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at
    from transfers where user_id = ${userId}
    order by updated_at desc
  `;
  return rows.map(mapOwned);
}

export async function linkTransfer(userId: string, reference: string, pin: string) {
  const ref = reference.trim().toUpperCase();
  if (!/^[A-Z0-9-]{4,32}$/.test(ref) || !/^\d{4,8}$/.test(pin.trim())) {
    throw new Error("تعذر التحقق من الحوالة");
  }
  await limit(`link:${userId}`, 10, 600);
  const sql = await getSql();
  const found = await sql<{ id: number; pin_hash: string; user_id: string | null }>`
    select id, pin_hash, user_id from transfers where reference = ${ref}
  `;
  const row = found[0];
  if (!row || !pinMatches(pin, row.pin_hash) || (row.user_id && row.user_id !== userId)) {
    throw new Error("تعذر التحقق من الحوالة");
  }
  await sql`update transfers set user_id = ${userId}, updated_at = now() where id = ${row.id}`;
  await sql`
    insert into notifications (user_id, title_ar, title_en, body_ar, body_en)
    values (
      ${userId},
      'رُبطت حوالة بحسابك',
      'A transfer was linked to your account',
      ${`أصبحت الحوالة ${ref} ظاهرة في سجلك بعد التحقق.`},
      ${`Transfer ${ref} is now visible in your history after verification.`}
    )
  `;
  return listOwnedTransfers(userId);
}

export async function listNotices(userId: string) {
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select id, title_ar, title_en, body_ar, body_en,
      to_char(read_at, 'YYYY-MM-DD HH24:MI') as read_at,
      to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at
    from notifications where user_id = ${userId}
    order by id desc
  `;
  return rows.map(
    (row): Notice => ({
      id: Number(row.id),
      titleAr: String(row.title_ar),
      titleEn: String(row.title_en),
      bodyAr: String(row.body_ar),
      bodyEn: String(row.body_en),
      readAt: row.read_at == null ? null : String(row.read_at),
      createdAt: String(row.created_at),
    }),
  );
}

export async function markNoticeRead(userId: string, id: number) {
  const sql = await getSql();
  await sql`
    update notifications set read_at = coalesce(read_at, now())
    where id = ${id} and user_id = ${userId}
  `;
  return listNotices(userId);
}

export async function listOwnTickets(userId: string) {
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select id, user_id, subject, body, status, reply,
      to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at
    from support_tickets where user_id = ${userId} order by id desc
  `;
  return rows.map(mapTicket);
}

function mapTicket(row: Record<string, unknown>): Ticket {
  return {
    id: Number(row.id),
    userId: String(row.user_id),
    subject: String(row.subject),
    body: String(row.body),
    status: String(row.status),
    reply: String(row.reply ?? ""),
    createdAt: String(row.created_at),
  };
}

export async function openTicket(userId: string, subject: string, body: string, key: string) {
  const title = subject.trim();
  const text = body.trim();
  if (title.length < 4 || title.length > 120) throw new Error("عنوان الطلب غير مناسب");
  if (text.length < 10 || text.length > 2000) throw new Error("نص الطلب غير مناسب");
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(key)) throw new Error("تعذر تمييز الطلب");
  const sql = await getSql();
  const saved = await sql`
    insert into idempotency_keys (key, scope) values (${key}, 'ticket')
    on conflict (key) do nothing returning key
  `;
  if (!saved[0]) return listOwnTickets(userId);
  await sql`
    insert into support_tickets (user_id, subject, body) values (${userId}, ${title}, ${text})
  `;
  return listOwnTickets(userId);
}

export async function requirePerm(userId: string, perm: string) {
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select user_id, display_name, phone, role, phone_verified from profiles where user_id = ${userId}
  `;
  if (!rows[0]) throw new Error("لا يوجد ملف صلاحيات لهذا الحساب");
  const profile = mapProfile(rows[0]);
  if (!roleHas(profile.role, perm)) throw new Error("ليست لديك الصلاحية الكافية");
  return profile;
}

export async function adminOverview(userId: string) {
  await requirePerm(userId, "read");
  const sql = await getSql();
  const [inquiries, tickets, branches, news, admins] = await Promise.all([
    sql<{ n: number }>`select count(*)::int as n from inquiries where status = 'new'`,
    sql<{ n: number }>`select count(*)::int as n from support_tickets where status = 'open'`,
    sql<{ n: number }>`select count(*)::int as n from branches where active = true`,
    sql<{ n: number }>`select count(*)::int as n from news_posts where published = true`,
    sql<{ n: number }>`select count(*)::int as n from profiles where role = 'system_admin'`,
  ]);
  const profile = await requirePerm(userId, "read");
  return {
    profile,
    newInquiries: inquiries[0]?.n ?? 0,
    openTickets: tickets[0]?.n ?? 0,
    activeBranches: branches[0]?.n ?? 0,
    publishedNews: news[0]?.n ?? 0,
    adminCount: admins[0]?.n ?? 0,
  };
}

export async function claimAdmin(userId: string) {
  const sql = await getSql();
  await ensureProfile(userId, "");
  const rows = await sql<{ user_id: string }>`
    update profiles set role = 'system_admin', updated_at = now()
    where user_id = ${userId}
      and role = 'customer'
      and not exists (select 1 from profiles where role = 'system_admin')
    returning user_id
  `;
  if (!rows[0]) throw new Error("التعيين الأول غير متاح. يوجد مدير أو أن حسابك ليس عميلاً.");
  await audit(sql, userId, "claim", "profile", userId, "bootstrap system admin");
  return requirePerm(userId, "read");
}

export async function saveRate(
  userId: string,
  input: {
    id: number;
    buy: string;
    sell: string;
    direction: "up" | "down" | "flat";
    demo: boolean;
    changePct: string;
  },
) {
  await requirePerm(userId, "rates");
  if (!/^\d{1,12}(\.\d{1,4})?$/.test(input.buy) || !/^\d{1,12}(\.\d{1,4})?$/.test(input.sell)) {
    throw new Error("صيغة السعر غير صالحة");
  }
  if (!/^-?\d{1,4}(\.\d{1,4})?$/.test(input.changePct)) throw new Error("نسبة التغير غير صالحة");
  const sql = await getSql();
  const who = await sql<{ display_name: string }>`
    select display_name from profiles where user_id = ${userId}
  `;
  const rows = await sql<{ code: string }>`
    update rates
    set buy = ${input.buy}::numeric, sell = ${input.sell}::numeric,
      direction = ${input.direction}, is_demo = ${input.demo},
      change_pct = ${input.changePct}::numeric, updated_at = now(),
      updated_by = ${who[0]?.display_name ?? ""}
    where id = ${input.id}
    returning code
  `;
  if (!rows[0]) throw new Error("العملة غير موجودة");
  await sql`
    insert into rate_history (rate_id, code, region, buy, sell)
    select id, code, region, buy, sell from rates where id = ${input.id}
  `;
  await audit(sql, userId, "update", "rate", rows[0].code, `buy ${input.buy} sell ${input.sell}`);
}

export async function addRate(
  userId: string,
  input: { code: string; nameAr: string; nameEn: string; buy: string; sell: string; region?: string },
) {
  await requirePerm(userId, "rates");
  const code = input.code.trim().toUpperCase();
  const region = (input.region ?? "").trim().slice(0, 40);
  if (!/^[A-Z]{3,8}$/.test(code)) throw new Error("رمز العملة غير صالح");
  if (input.nameAr.trim().length < 2 || input.nameEn.trim().length < 2) throw new Error("اسم العملة ناقص");
  if (!/^\d{1,12}(\.\d{1,4})?$/.test(input.buy) || !/^\d{1,12}(\.\d{1,4})?$/.test(input.sell)) {
    throw new Error("صيغة السعر غير صالحة");
  }
  const sql = await getSql();
  const existing = await sql<{ id: number }>`
    select id from rates where code = ${code} and region = ${region}
  `;
  if (existing[0]) throw new Error("هذه العملة موجودة لهذه المنطقة");
  await sql`
    insert into rates (code, name_ar, name_en, buy, sell, direction, is_demo, sort_order, region, change_pct)
    values (${code}, ${input.nameAr.trim()}, ${input.nameEn.trim()}, ${input.buy}::numeric, ${input.sell}::numeric, 'flat', true, 50, ${region}, 0)
  `;
  await audit(sql, userId, "create", "rate", code, region || "national");
}

export async function saveBranch(userId: string, input: Branch) {
  await requirePerm(userId, "branches");
  if (input.nameAr.trim().length < 2) throw new Error("اسم الفرع ناقص");
  const lat = input.lat?.trim() ? Number(input.lat) : null;
  const lng = input.lng?.trim() ? Number(input.lng) : null;
  const photo = (input.photoUrl ?? "").trim();
  if (lat != null && (!Number.isFinite(lat) || lat < -90 || lat > 90)) throw new Error("خط العرض غير صالح");
  if (lng != null && (!Number.isFinite(lng) || lng < -180 || lng > 180)) throw new Error("خط الطول غير صالح");
  if (photo && !/^https:\/\//.test(photo) && !/^\/[a-zA-Z0-9/_.-]+$/.test(photo)) {
    throw new Error("رابط الصورة يجب أن يبدأ بـ https أو يكون مساراً داخل الموقع");
  }
  const sql = await getSql();
  if (input.id > 0) {
    const rows = await sql<{ id: number }>`
      update branches set
        kind = ${input.kind}, name_ar = ${input.nameAr.trim()}, name_en = ${input.nameEn.trim()},
        governorate_ar = ${input.governorateAr.trim()}, governorate_en = ${input.governorateEn.trim()},
        city_ar = ${input.cityAr.trim()}, city_en = ${input.cityEn.trim()},
        address_ar = ${input.addressAr.trim()}, address_en = ${input.addressEn.trim()},
        phone = ${input.phone.trim()}, hours_ar = ${input.hoursAr.trim()}, hours_en = ${input.hoursEn.trim()},
        services_ar = ${input.servicesAr.trim()}, services_en = ${input.servicesEn.trim()},
        lat = ${lat}, lng = ${lng}, photo_url = ${photo}, is_demo = ${input.demo}, active = ${input.active}
      where id = ${input.id}
      returning id
    `;
    if (!rows[0]) throw new Error("الفرع غير موجود");
    await audit(sql, userId, "update", "branch", String(input.id), input.nameAr.trim());
    return;
  }
  const rows = await sql<{ id: number }>`
    insert into branches (
      kind, name_ar, name_en, governorate_ar, governorate_en, city_ar, city_en,
      address_ar, address_en, phone, hours_ar, hours_en, services_ar, services_en,
      lat, lng, photo_url, is_demo, active
    ) values (
      ${input.kind}, ${input.nameAr.trim()}, ${input.nameEn.trim()},
      ${input.governorateAr.trim()}, ${input.governorateEn.trim()},
      ${input.cityAr.trim()}, ${input.cityEn.trim()},
      ${input.addressAr.trim()}, ${input.addressEn.trim()}, ${input.phone.trim()},
      ${input.hoursAr.trim()}, ${input.hoursEn.trim()},
      ${input.servicesAr.trim()}, ${input.servicesEn.trim()},
      ${lat}, ${lng}, ${photo}, ${input.demo}, ${input.active}
    ) returning id
  `;
  await audit(sql, userId, "create", "branch", String(rows[0].id), input.nameAr.trim());
}

export async function listAllBranches(userId: string) {
  await requirePerm(userId, "branches");
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`select * from branches order by id`;
  return rows.map(mapBranch);
}

export async function saveNews(
  userId: string,
  input: {
    id: number;
    slug: string;
    kind: string;
    titleAr: string;
    titleEn: string;
    excerptAr: string;
    excerptEn: string;
    bodyAr: string;
    bodyEn: string;
    demo: boolean;
    published: boolean;
  },
) {
  await requirePerm(userId, "content");
  const kinds = ["news", "announcement", "alert", "update", "offer", "guide"];
  if (!kinds.includes(input.kind)) throw new Error("نوع المحتوى غير معروف");
  if (input.titleAr.trim().length < 4 || input.bodyAr.trim().length < 10) throw new Error("المحتوى العربي ناقص");
  const slug = (input.slug.trim() || `post-${Date.now()}`).toLowerCase();
  if (!/^[a-z0-9-]{3,80}$/.test(slug)) throw new Error("المسار اللطيف غير صالح");
  const sql = await getSql();
  if (input.id > 0) {
    await sql`
      update news_posts set
        slug = ${slug}, kind = ${input.kind},
        title_ar = ${input.titleAr.trim()}, title_en = ${input.titleEn.trim() || input.titleAr.trim()},
        excerpt_ar = ${input.excerptAr.trim()}, excerpt_en = ${input.excerptEn.trim()},
        body_ar = ${input.bodyAr.trim()}, body_en = ${input.bodyEn.trim() || input.bodyAr.trim()},
        is_demo = ${input.demo}, published = ${input.published}
      where id = ${input.id}
    `;
    await audit(sql, userId, "update", "news", slug, input.published ? "published" : "hidden");
    return;
  }
  await sql`
    insert into news_posts (
      slug, kind, title_ar, title_en, excerpt_ar, excerpt_en, body_ar, body_en, is_demo, published
    ) values (
      ${slug}, ${input.kind}, ${input.titleAr.trim()}, ${input.titleEn.trim() || input.titleAr.trim()},
      ${input.excerptAr.trim()}, ${input.excerptEn.trim()},
      ${input.bodyAr.trim()}, ${input.bodyEn.trim() || input.bodyAr.trim()},
      ${input.demo}, ${input.published}
    )
  `;
  await audit(sql, userId, "create", "news", slug, "created");
}

export async function listAllNews(userId: string) {
  await requirePerm(userId, "content");
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select id, slug, kind, title_ar, title_en, excerpt_ar, excerpt_en, body_ar, body_en,
      is_demo, published, to_char(published_at, 'YYYY-MM-DD HH24:MI') as published_at
    from news_posts order by id desc
  `;
  return rows.map((row) => ({ ...mapNews(row), published: Boolean(row.published) }));
}

export async function listInquiries(userId: string) {
  await requirePerm(userId, "support");
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select id, name, phone, email, topic, message, status,
      to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at
    from inquiries order by id desc
  `;
  return rows.map(
    (row): Inquiry => ({
      id: Number(row.id),
      name: String(row.name),
      phone: String(row.phone),
      email: String(row.email),
      topic: String(row.topic),
      message: String(row.message),
      status: String(row.status),
      createdAt: String(row.created_at),
    }),
  );
}

export async function setInquiryStatus(userId: string, id: number, status: string) {
  await requirePerm(userId, "support");
  if (!["new", "in_progress", "closed"].includes(status)) throw new Error("حالة غير صالحة");
  const sql = await getSql();
  await sql`update inquiries set status = ${status} where id = ${id}`;
  await audit(sql, userId, "update", "inquiry", String(id), status);
}

export async function listAllTickets(userId: string) {
  await requirePerm(userId, "support");
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select id, user_id, subject, body, status, reply,
      to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at
    from support_tickets order by id desc
  `;
  return rows.map(mapTicket);
}

export async function replyTicket(userId: string, id: number, reply: string, status: string) {
  await requirePerm(userId, "support");
  if (!["open", "answered", "closed"].includes(status)) throw new Error("حالة غير صالحة");
  const text = reply.trim();
  if (text.length < 2) throw new Error("الرد قصير");
  const sql = await getSql();
  const rows = await sql<{ user_id: string }>`
    update support_tickets set reply = ${text}, status = ${status} where id = ${id} returning user_id
  `;
  if (!rows[0]) throw new Error("الطلب غير موجود");
  await sql`
    insert into notifications (user_id, title_ar, title_en, body_ar, body_en)
    values (
      ${rows[0].user_id},
      'رد على طلب الدعم',
      'Support reply',
      ${text},
      ${text}
    )
  `;
  await audit(sql, userId, "reply", "ticket", String(id), status);
}

export async function listStaff(userId: string) {
  await requirePerm(userId, "*");
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select user_id, display_name, phone, role, to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at
    from profiles order by created_at
  `;
  return rows.map(
    (row): StaffRow => ({
      userId: String(row.user_id),
      displayName: String(row.display_name),
      phone: String(row.phone),
      role: String(row.role),
      createdAt: String(row.created_at),
    }),
  );
}

export async function setRole(actorId: string, userId: string, role: string) {
  await requirePerm(actorId, "*");
  const roles = Object.keys(PERMS);
  if (!roles.includes(role)) throw new Error("دور غير معروف");
  const sql = await getSql();
  if (role !== "system_admin") {
    const admins = await sql<{ n: number; self: number }>`
      select count(*)::int as n,
        count(*) filter (where user_id = ${userId})::int as self
      from profiles where role = 'system_admin'
    `;
    const current = await sql<{ role: string }>`select role from profiles where user_id = ${userId}`;
    if (current[0]?.role === "system_admin" && (admins[0]?.n ?? 0) <= 1) {
      throw new Error("لا يمكن إزالة آخر مدير للنظام");
    }
  }
  await sql`update profiles set role = ${role}, updated_at = now() where user_id = ${userId}`;
  await audit(sql, actorId, "role", "profile", userId, role);
}

export async function listAudit(userId: string) {
  await requirePerm(userId, "audit");
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select id, actor_id, action, entity, entity_id, detail,
      to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at
    from audit_log order by id desc limit 200
  `;
  return rows.map(
    (row): AuditRow => ({
      id: Number(row.id),
      actorId: String(row.actor_id),
      action: String(row.action),
      entity: String(row.entity),
      entityId: String(row.entity_id),
      detail: String(row.detail),
      createdAt: String(row.created_at),
    }),
  );
}

export async function saveSettings(userId: string, settings: SiteSettings) {
  await requirePerm(userId, "content");
  const sql = await getSql();
  await sql`
    update site_settings set
      phone = ${settings.phone.trim()},
      email = ${settings.email.trim()},
      address_ar = ${settings.addressAr.trim()},
      address_en = ${settings.addressEn.trim()},
      hours_ar = ${settings.hoursAr.trim()},
      hours_en = ${settings.hoursEn.trim()},
      whatsapp = ${settings.whatsapp.trim()},
      facebook = ${settings.facebook.trim()},
      x_url = ${settings.xUrl.trim()},
      instagram = ${settings.instagram.trim()},
      about_ar = ${settings.aboutAr.trim()},
      about_en = ${settings.aboutEn.trim()},
      vision_ar = ${settings.visionAr.trim()},
      vision_en = ${settings.visionEn.trim()},
      mission_ar = ${settings.missionAr.trim()},
      mission_en = ${settings.missionEn.trim()},
      values_ar = ${settings.valuesAr.trim()},
      values_en = ${settings.valuesEn.trim()},
      goals_ar = ${settings.goalsAr.trim()},
      goals_en = ${settings.goalsEn.trim()},
      commitment_ar = ${settings.commitmentAr.trim()},
      commitment_en = ${settings.commitmentEn.trim()},
      transparency_ar = ${settings.transparencyAr.trim()},
      transparency_en = ${settings.transparencyEn.trim()},
      respect_ar = ${settings.respectAr.trim()},
      respect_en = ${settings.respectEn.trim()},
      strategy_ar = ${settings.strategyAr.trim()},
      strategy_en = ${settings.strategyEn.trim()},
      legal_ar = ${settings.legalAr.trim()},
      legal_en = ${settings.legalEn.trim()},
      rates_disclaimer_ar = ${settings.ratesDisclaimerAr.trim()},
      rates_disclaimer_en = ${settings.ratesDisclaimerEn.trim()},
      rates_live = ${settings.ratesLive},
      about_review_ack = ${settings.aboutReviewAck},
      reply_sla_ar = ${settings.replySlaAr.trim()},
      reply_sla_en = ${settings.replySlaEn.trim()},
      secure_channel_ar = ${settings.secureChannelAr.trim()},
      secure_channel_en = ${settings.secureChannelEn.trim()},
      license_image = ${settings.licenseImage.trim()},
      founded_on = ${settings.foundedOn.trim()},
      updated_at = now()
    where id = 1
  `;
  await audit(sql, userId, "update", "settings", "1", "site settings");
}

export async function loadSettingsForAdmin(userId: string) {
  await requirePerm(userId, "content");
  const sql = await getSql();
  return readSettings(sql);
}

export async function listRatesAdmin(userId: string) {
  await requirePerm(userId, "rates");
  const home = await loadHome();
  return home.rates;
}

export async function createTransferAdmin(
  userId: string,
  input: {
    reference: string;
    pin: string;
    status: string;
    currency: string;
    amount: string;
    senderName: string;
    beneficiaryName: string;
    pickupCityAr: string;
    pickupCityEn: string;
    demo: boolean;
  },
) {
  await requirePerm(userId, "support");
  const ref = input.reference.trim().toUpperCase();
  if (!/^[A-Z0-9-]{4,32}$/.test(ref)) throw new Error("رقم الحوالة غير صالح");
  if (!/^\d{4,8}$/.test(input.pin.trim())) throw new Error("رمز التحقق من 4 إلى 8 أرقام");
  if (!isTransferStatus(input.status)) throw new Error("حالة غير صالحة");
  if (!/^[A-Z]{3,8}$/.test(input.currency.trim().toUpperCase())) throw new Error("العملة غير صالحة");
  if (!/^\d{1,12}(\.\d{1,2})?$/.test(input.amount.trim())) throw new Error("المبلغ غير صالح");
  const sql = await getSql();
  await sql`
    insert into transfers (
      reference, pin_hash, status, currency, amount, sender_name, beneficiary_name,
      pickup_city_ar, pickup_city_en, is_demo
    ) values (
      ${ref}, ${hashPin(input.pin)}, ${input.status}, ${input.currency.trim().toUpperCase()},
      ${input.amount}::numeric, ${input.senderName.trim()}, ${input.beneficiaryName.trim()},
      ${input.pickupCityAr.trim()}, ${input.pickupCityEn.trim()}, ${input.demo}
    )
  `;
  await audit(sql, userId, "create", "transfer", ref, input.status);
}

export async function setTransferStatus(userId: string, id: number, status: string) {
  await requirePerm(userId, "support");
  if (!isTransferStatus(status)) throw new Error("حالة غير صالحة");
  const sql = await getSql();
  const rows = await sql<{ reference: string; user_id: string | null }>`
    update transfers set status = ${status}, updated_at = now() where id = ${id}
    returning reference, user_id
  `;
  if (!rows[0]) throw new Error("الحوالة غير موجودة");
  if (rows[0].user_id) {
    await sql`
      insert into notifications (user_id, title_ar, title_en, body_ar, body_en)
      values (
        ${rows[0].user_id},
        'تحديث حالة حوالة',
        'Transfer status updated',
        ${`الحالة الجديدة للحوالة ${rows[0].reference}: ${status}`},
        ${`New status for ${rows[0].reference}: ${status}`}
      )
    `;
  }
  await audit(sql, userId, "update", "transfer", rows[0].reference, status);
}

export async function listTransfersAdmin(userId: string) {
  await requirePerm(userId, "support");
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select id, reference, status, currency, amount::text, sender_name, beneficiary_name,
      pickup_city_ar, pickup_city_en, is_demo, user_id,
      to_char(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at
    from transfers order by id desc
  `;
  return rows.map(
    (row): AdminTransfer => ({
      ...mapOwned(row),
      linked: row.user_id != null && String(row.user_id) !== "",
    }),
  );
}

export async function listServicesAdmin(userId: string) {
  await requirePerm(userId, "content");
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`select * from services order by sort_order`;
  return rows.map(mapService);
}

export async function saveServiceText(
  userId: string,
  input: { slug: string; summaryAr: string; summaryEn: string; bodyAr: string; bodyEn: string; published: boolean },
) {
  await requirePerm(userId, "content");
  const sql = await getSql();
  await sql`
    update services set
      summary_ar = ${input.summaryAr.trim()},
      summary_en = ${input.summaryEn.trim()},
      body_ar = ${input.bodyAr.trim()},
      body_en = ${input.bodyEn.trim()},
      published = ${input.published}
    where slug = ${input.slug}
  `;
  await audit(sql, userId, "update", "service", input.slug, input.published ? "published" : "hidden");
}

function mapPartner(row: Record<string, unknown>): Partner {
  return {
    id: Number(row.id),
    nameAr: String(row.name_ar),
    nameEn: String(row.name_en),
    kind: String(row.kind),
    noteAr: String(row.note_ar ?? ""),
    noteEn: String(row.note_en ?? ""),
    url: String(row.url ?? ""),
    demo: Boolean(row.is_demo),
  };
}

export async function loadManagedPage(slug: string): Promise<ManagedPage | null> {
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select slug, title_ar, title_en, body_ar, body_en, published, legal_approved
    from managed_pages where slug = ${slug} and published = true
  `;
  const row = rows[0];
  if (!row) return null;
  const legalApproved = Boolean(row.legal_approved);
  if (LEGAL_SLUGS.has(slug) && !legalApproved) return null;
  return {
    slug: String(row.slug),
    titleAr: String(row.title_ar),
    titleEn: String(row.title_en),
    bodyAr: String(row.body_ar),
    bodyEn: String(row.body_en),
    published: Boolean(row.published),
    legalApproved,
  };
}

export async function listManagedPages(userId: string) {
  await requirePerm(userId, "content");
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select slug, title_ar, title_en, body_ar, body_en, published, legal_approved from managed_pages order by slug
  `;
  return rows.map(
    (row): ManagedPage => ({
      slug: String(row.slug),
      titleAr: String(row.title_ar),
      titleEn: String(row.title_en),
      bodyAr: String(row.body_ar),
      bodyEn: String(row.body_en),
      published: Boolean(row.published),
      legalApproved: Boolean(row.legal_approved),
    }),
  );
}

export async function saveManagedPage(
  userId: string,
  input: { slug: string; titleAr: string; titleEn: string; bodyAr: string; bodyEn: string; published: boolean; legalApproved?: boolean },
) {
  await requirePerm(userId, "content");
  const sql = await getSql();
  const legal = LEGAL_SLUGS.has(input.slug) ? Boolean(input.legalApproved) : false;
  await sql`
    update managed_pages set
      title_ar = ${input.titleAr.trim()},
      title_en = ${input.titleEn.trim()},
      body_ar = ${input.bodyAr.trim()},
      body_en = ${input.bodyEn.trim()},
      published = ${input.published},
      legal_approved = ${legal},
      updated_at = now()
    where slug = ${input.slug}
  `;
  await audit(sql, userId, "update", "page", input.slug, legal ? "legal-approved" : input.published ? "published" : "hidden");
}

export async function listPartnersAdmin(userId: string) {
  await requirePerm(userId, "content");
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select id, name_ar, name_en, kind, note_ar, note_en, url, is_demo, published
    from partners order by id
  `;
  return rows.map((row) => ({ ...mapPartner(row), published: Boolean(row.published) }));
}

export async function savePartner(
  userId: string,
  input: {
    id: number;
    nameAr: string;
    nameEn: string;
    kind: string;
    noteAr: string;
    noteEn: string;
    url: string;
    demo: boolean;
    published: boolean;
  },
) {
  await requirePerm(userId, "content");
  if (input.nameAr.trim().length < 2) throw new Error("اسم الشريك ناقص");
  const url = input.url.trim();
  if (url && !/^https:\/\//.test(url)) throw new Error("رابط الشريك يجب أن يبدأ بـ https");
  const sql = await getSql();
  if (input.id > 0) {
    await sql`
      update partners set
        name_ar = ${input.nameAr.trim()}, name_en = ${input.nameEn.trim() || input.nameAr.trim()},
        kind = ${input.kind.trim() || "network"}, note_ar = ${input.noteAr.trim()}, note_en = ${input.noteEn.trim()},
        url = ${url}, is_demo = ${input.demo}, published = ${input.published}
      where id = ${input.id}
    `;
    await audit(sql, userId, "update", "partner", String(input.id), input.nameAr.trim());
    return;
  }
  const rows = await sql<{ id: number }>`
    insert into partners (name_ar, name_en, kind, note_ar, note_en, url, is_demo, published)
    values (
      ${input.nameAr.trim()}, ${input.nameEn.trim() || input.nameAr.trim()}, ${input.kind.trim() || "network"},
      ${input.noteAr.trim()}, ${input.noteEn.trim()}, ${url}, ${input.demo}, ${input.published}
    ) returning id
  `;
  await audit(sql, userId, "create", "partner", String(rows[0].id), input.nameAr.trim());
}

export async function createComplaint(input: {
  name: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
  companyWebsite: string;
  idempotencyKey: string;
}) {
  if (input.companyWebsite.trim()) return { ok: true as const, duplicate: true, reference: "", pin: "" };
  const name = input.name.trim();
  const message = input.message.trim();
  const email = input.email.trim();
  const topics = ["service", "transfer", "branch", "staff", "fraud", "other"];
  if (name.length < 2 || name.length > 80) throw new Error("تحقق من الاسم");
  if (message.length < 10 || message.length > 2000) throw new Error("نص الشكوى غير مناسب");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("البريد غير صالح");
  if (!topics.includes(input.topic)) throw new Error("نوع الشكوى غير معروف");
  const phone = cleanPhone(input.phone);
  const key = input.idempotencyKey.trim();
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(key)) throw new Error("تعذر تمييز الطلب");
  await limit(`complaint-ip:${clientIp()}`, 10, 3600);
  await limit(`complaint:${phone}`, 5, 3600);
  const sql = await getSql();
  const saved = await sql`
    insert into idempotency_keys (key, scope) values (${key}, 'complaint')
    on conflict (key) do nothing returning key
  `;
  if (!saved[0]) return { ok: true as const, duplicate: true, reference: "", pin: "" };
  const pin = String(randomInt(100000, 999999));
  const reference = `C-${randomInt(100000, 999999)}`;
  await sql`
    insert into complaints (reference, pin_hash, name, phone, email, topic, message)
    values (${reference}, ${hashPin(pin)}, ${name}, ${phone}, ${email}, ${input.topic}, ${message})
  `;
  return { ok: true as const, duplicate: false, reference, pin };
}

export async function trackComplaint(reference: string, pin: string): Promise<ComplaintTrack> {
  const ref = reference.trim().toUpperCase();
  if (!/^C-\d{6}$/.test(ref) || !/^\d{6}$/.test(pin.trim())) return { ok: false };
  await limit(`ctrack:${ref}`, 12, 600);
  const sql = await getSql();
  const rows = await sql<{ pin_hash: string; status: string; reply: string; created_at: string }>`
    select pin_hash, status, reply, to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at
    from complaints where reference = ${ref}
  `;
  const row = rows[0];
  if (!row || !pinMatches(pin, row.pin_hash)) return { ok: false };
  return { ok: true, status: row.status, reply: row.reply, createdAt: row.created_at };
}

export async function createServiceRequest(input: {
  kind: string;
  orgName: string;
  delegateName: string;
  phone: string;
  city: string;
  need: string;
  companyWebsite: string;
  idempotencyKey: string;
}) {
  if (input.companyWebsite.trim()) return { ok: true as const, duplicate: true, reference: "", pin: "" };
  if (input.kind !== "corporate" && input.kind !== "humanitarian") throw new Error("نوع الطلب غير معروف");
  const org = input.orgName.trim();
  const delegate = input.delegateName.trim();
  const city = input.city.trim();
  const need = input.need.trim();
  if (org.length < 2 || delegate.length < 2 || city.length < 2) throw new Error("أكمل بيانات الجهة والمفوّض والمدينة");
  if (need.length < 10 || need.length > 1500) throw new Error("صف الاحتياج باختصار");
  const phone = cleanPhone(input.phone);
  const key = input.idempotencyKey.trim();
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(key)) throw new Error("تعذر تمييز الطلب");
  await limit(`request-ip:${clientIp()}`, 10, 3600);
  await limit(`request:${phone}`, 5, 3600);
  const sql = await getSql();
  const saved = await sql`
    insert into idempotency_keys (key, scope) values (${key}, 'service-request')
    on conflict (key) do nothing returning key
  `;
  if (!saved[0]) return { ok: true as const, duplicate: true, reference: "", pin: "" };
  const pin = String(randomInt(100000, 999999));
  const reference = `R-${randomInt(100000, 999999)}`;
  await sql`
    insert into service_requests (reference, pin_hash, kind, org_name, delegate_name, phone, city, need)
    values (${reference}, ${hashPin(pin)}, ${input.kind}, ${org}, ${delegate}, ${phone}, ${city}, ${need})
  `;
  return { ok: true as const, duplicate: false, reference, pin };
}

export async function listServiceRequests(userId: string) {
  await requirePerm(userId, "support");
  const sql = await getSql();
  return sql<{ id: number; reference: string; kind: string; org_name: string; delegate_name: string; phone: string; city: string; need: string; created_at: string }>`
    select id, reference, kind, org_name, delegate_name, phone, city, need,
      to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at
    from service_requests order by id desc
  `;
}

export async function listComplaints(userId: string) {
  await requirePerm(userId, "support");
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select id, reference, name, phone, email, topic, message, status, reply,
      to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at
    from complaints order by id desc
  `;
  return rows.map(
    (row): ComplaintRow => ({
      id: Number(row.id),
      reference: String(row.reference),
      name: String(row.name),
      phone: String(row.phone),
      email: String(row.email),
      topic: String(row.topic),
      message: String(row.message),
      status: String(row.status),
      reply: String(row.reply ?? ""),
      createdAt: String(row.created_at),
    }),
  );
}

export async function replyComplaint(userId: string, id: number, reply: string, status: string) {
  await requirePerm(userId, "support");
  if (!["received", "reviewing", "closed"].includes(status)) throw new Error("حالة غير صالحة");
  const text = reply.trim();
  const sql = await getSql();
  const rows = await sql<{ reference: string }>`
    update complaints set reply = ${text}, status = ${status} where id = ${id} returning reference
  `;
  if (!rows[0]) throw new Error("الشكوى غير موجودة");
  await audit(sql, userId, "reply", "complaint", rows[0].reference, status);
}

export async function listJobsPublic() {
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select id, title_ar, title_en, city_ar, city_en, body_ar, body_en, published
    from jobs where published = true order by id desc
  `;
  return rows.map(mapJob);
}

function mapJob(row: Record<string, unknown>): JobPost {
  return {
    id: Number(row.id),
    titleAr: String(row.title_ar),
    titleEn: String(row.title_en),
    cityAr: String(row.city_ar ?? ""),
    cityEn: String(row.city_en ?? ""),
    bodyAr: String(row.body_ar),
    bodyEn: String(row.body_en),
    published: Boolean(row.published),
  };
}

export async function listJobsAdmin(userId: string) {
  await requirePerm(userId, "content");
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select id, title_ar, title_en, city_ar, city_en, body_ar, body_en, published from jobs order by id desc
  `;
  return rows.map(mapJob);
}

export async function saveJob(
  userId: string,
  input: { id: number; titleAr: string; titleEn: string; cityAr: string; cityEn: string; bodyAr: string; bodyEn: string; published: boolean },
) {
  await requirePerm(userId, "content");
  if (input.titleAr.trim().length < 3 || input.bodyAr.trim().length < 10) throw new Error("بيانات الوظيفة ناقصة");
  const sql = await getSql();
  if (input.id > 0) {
    await sql`
      update jobs set
        title_ar = ${input.titleAr.trim()}, title_en = ${input.titleEn.trim() || input.titleAr.trim()},
        city_ar = ${input.cityAr.trim()}, city_en = ${input.cityEn.trim()},
        body_ar = ${input.bodyAr.trim()}, body_en = ${input.bodyEn.trim() || input.bodyAr.trim()},
        published = ${input.published}
      where id = ${input.id}
    `;
    await audit(sql, userId, "update", "job", String(input.id), input.published ? "published" : "hidden");
    return;
  }
  const rows = await sql<{ id: number }>`
    insert into jobs (title_ar, title_en, city_ar, city_en, body_ar, body_en, published)
    values (
      ${input.titleAr.trim()}, ${input.titleEn.trim() || input.titleAr.trim()},
      ${input.cityAr.trim()}, ${input.cityEn.trim()},
      ${input.bodyAr.trim()}, ${input.bodyEn.trim() || input.bodyAr.trim()}, ${input.published}
    ) returning id
  `;
  await audit(sql, userId, "create", "job", String(rows[0].id), input.titleAr.trim());
}

export async function applyForJob(input: { jobId: number; name: string; phone: string; email: string; message: string }) {
  const name = input.name.trim();
  const message = input.message.trim();
  if (name.length < 2 || message.length < 10) throw new Error("أكمل بيانات التقديم");
  const phone = cleanPhone(input.phone);
  const sql = await getSql();
  const jobs = await sql<{ id: number }>`select id from jobs where id = ${input.jobId} and published = true`;
  if (!jobs[0]) throw new Error("الوظيفة غير متاحة");
  await limit(`job:${phone}`, 5, 3600);
  await sql`
    insert into job_applications (job_id, name, phone, email, message)
    values (${input.jobId}, ${name}, ${phone}, ${input.email.trim()}, ${message})
  `;
  return { ok: true as const };
}

export async function listCustomers(userId: string) {
  await requirePerm(userId, "support");
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select user_id, display_name, phone, role, to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at
    from profiles where role = 'customer' order by created_at desc
  `;
  return rows.map(
    (row): StaffRow => ({
      userId: String(row.user_id),
      displayName: String(row.display_name),
      phone: String(row.phone),
      role: String(row.role),
      createdAt: String(row.created_at),
    }),
  );
}

