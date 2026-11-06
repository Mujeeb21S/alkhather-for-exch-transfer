import { createCipheriv, randomBytes, scryptSync } from "node:crypto";
import { getSql } from "@/lib/db";
import { assertBalanced, quoteCommission, round4, type CommissionPlan } from "@/lib/networks/calc";
import { requirePerm, roleHas } from "@/lib/server/queries.server";

const SERVICES = ["send", "receive", "account", "bank", "wallet", "international", "local", "inquiry", "cancel", "refund"];
const NET_STATUS = ["active", "inactive", "pending", "suspended", "stopped", "expired"];
const NET_KINDS = ["local_ye", "international", "regional", "banking", "ewallet"];
const PTR_KINDS = ["exchange", "bank_local", "bank_intl", "mto", "ewallet", "agent", "correspondent", "intermediary"];

type Sql = Awaited<ReturnType<typeof getSql>>;

function plain(row: Record<string, unknown>) {
  const out: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(row)) {
    if (value == null) out[key] = null;
    else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") out[key] = value;
    else if (typeof value === "bigint") out[key] = Number(value);
    else out[key] = String(value);
  }
  return out;
}

function plains(rows: Record<string, unknown>[]) {
  return rows.map(plain);
}

function caps(role: string) {
  return {
    write: roleHas(role, "networks_write"),
    fees: roleHas(role, "networks_fees"),
    money: roleHas(role, "networks_money"),
    approve: roleHas(role, "networks_approve"),
    secrets: roleHas(role, "networks_secrets"),
  };
}

function num(value: unknown) {
  const n = typeof value === "number" ? value : Number(String(value ?? "").replace(/,/g, ""));
  if (!Number.isFinite(n)) throw new Error("مبلغ غير صالح");
  return round4(n);
}

function text(value: unknown, max = 500) {
  return String(value ?? "").trim().slice(0, max);
}

function day(value: unknown) {
  const raw = text(value, 10);
  if (!raw) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) throw new Error("التاريخ بصيغة YYYY-MM-DD");
  return raw;
}

function optionalNum(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  return num(raw);
}

function httpUrl(value: unknown) {
  const raw = text(value, 300);
  if (!raw) return "";
  if (!/^https:\/\/[^\s]+$/i.test(raw) && !/^\/(?!\/)/.test(raw)) throw new Error("الرابط يجب أن يبدأ بـ https أو يكون مساراً داخلياً");
  if (raw.includes("..")) throw new Error("مسار غير مقبول");
  return raw;
}

async function audit(sql: Sql, actorId: string, action: string, entity: string, entityId: string, detail: string) {
  await sql`
    insert into audit_log (actor_id, action, entity, entity_id, detail)
    values (${actorId}, ${action}, ${entity}, ${entityId}, ${detail})
  `;
}

function encryptSecret(plain: string) {
  const key = scryptSync(process.env.NETWORK_VAULT_KEY || "alkhadher-demo-vault-change-me", "alkhadher-networks", 32);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

type GlDraft = {
  accountCode: string;
  accountName: string;
  kind: "asset" | "liability" | "income" | "expense" | "equity";
  currency: string;
  debit: number;
  credit: number;
  networkId: number | null;
  partnerId: number | null;
  demo: boolean;
  costCenter: string;
};

async function ensureAccount(sql: Sql, line: GlDraft) {
  await sql`
    insert into gl_accounts (code, name_ar, name_en, kind, currency, network_id, partner_id)
    values (${line.accountCode}, ${line.accountName}, ${line.accountCode}, ${line.kind}, ${line.currency}, ${line.networkId}, ${line.partnerId})
    on conflict (code) do nothing
  `;
}

async function postGl(
  sql: Sql,
  input: { key: string; kind: string; memo: string; source: string; actor: string; lines: GlDraft[] },
) {
  assertBalanced(input.lines.map((line) => ({ currency: line.currency, debit: line.debit, credit: line.credit })));
  for (const line of input.lines) await ensureAccount(sql, line);
  const payload = JSON.stringify(
    input.lines.map((line) => ({
      account_code: line.accountCode,
      account_name: line.accountName,
      currency: line.currency,
      debit: line.debit,
      credit: line.credit,
      network_id: line.networkId,
      partner_id: line.partnerId,
      is_demo: line.demo,
      cost_center: line.costCenter,
    })),
  );
  const rows = await sql<{ id: number }>`
    with ins as (
      insert into gl_entries (idempotency_key, kind, memo, source, actor_id)
      values (${input.key}, ${input.kind}, ${input.memo}, ${input.source}, ${input.actor})
      on conflict (idempotency_key) do nothing
      returning id
    ),
    src as (
      select id from ins
      union all
      select id from gl_entries where idempotency_key = ${input.key}
      limit 1
    ),
    ins_lines as (
      insert into gl_lines (
        entry_id, account_code, account_name, currency, debit, credit, network_id, partner_id, is_demo, cost_center
      )
      select src.id, x.account_code, x.account_name, x.currency, x.debit, x.credit, x.network_id, x.partner_id, x.is_demo, x.cost_center
      from src
      join ins on ins.id = src.id
      cross join jsonb_to_recordset(${payload}::jsonb) as x(
        account_code text, account_name text, currency text, debit numeric, credit numeric,
        network_id int, partner_id int, is_demo boolean, cost_center text
      )
      returning entry_id
    )
    select id from src
  `;
  return Number(rows[0]?.id ?? 0);
}

function cash(ccy: string, amount: number, debit: boolean, demo: boolean, cost: string): GlDraft {
  return {
    accountCode: `CASH:${ccy}`,
    accountName: `خزينة وسيطة ${ccy}`,
    kind: "asset",
    currency: ccy,
    debit: debit ? amount : 0,
    credit: debit ? 0 : amount,
    networkId: null,
    partnerId: null,
    demo,
    costCenter: cost,
  };
}

export async function loadNetworksDesk(userId: string) {
  const profile = await requirePerm(userId, "networks");
  const sql = await getSql();
  const [networks, partners, links, branches, corridors, plans, tiers, transfers, holds, settlements, agreements, integrations, logs, services, accounts, entries] =
    await Promise.all([
      sql`select id, code, name_ar, name_en, logo_url, kind, country, owner_name, operator_name, website, phone, email, address, coverage, currencies, transfer_types, fee_note, commission_note, started_on::text as started_on, agreement_ends_on::text as agreement_ends_on, status, notes, is_demo from transfer_networks order by id`,
      sql`select id, code, trade_name, legal_name, logo_url, kind, country, city, address, phones, email, website, contact_name, contact_info, license_no, regulator, relation_started_on::text as relation_started_on, agreement_on::text as agreement_on, agreement_ends_on::text as agreement_ends_on, status, documents, notes, is_demo from finance_partners order by id`,
      sql`select l.id, l.network_id, l.partner_id, l.services, l.currencies, l.min_amount::text as min_amount, l.max_amount::text as max_amount, l.agreement_ref, l.status, l.notes, coalesce(string_agg(b.branch_id::text, ','), '') as branch_ids from network_links l left join link_branches b on b.link_id = l.id group by l.id order by l.id`,
      sql`select id, name_ar from branches where active = true order by id`,
      sql`select id, send_country, recv_country, network_id, send_partner_id, recv_partner_id, currencies, min_amount::text as min_amount, max_amount::text as max_amount, fee_note, eta_note, status, is_demo from corridors order by id`,
      sql`select id, network_id, partner_id, service_code, currency, country, side, kind, min_amount::text as min_amount, max_amount::text as max_amount, percent::text as percent, fixed_amount::text as fixed_amount, company_share::text as company_share, starts_on::text as starts_on, ends_on::text as ends_on, active from commission_plans order by id desc`,
      sql`select plan_id, min_amount::text as min_amount, max_amount::text as max_amount, percent::text as percent, fixed_amount::text as fixed_amount from commission_tiers order by id`,
      sql`select id, reference, network_id, corridor_id, send_partner_id, recv_partner_id, direction, currency, amount::text as amount, fee::text as fee, company_share::text as company_share, partner_share::text as partner_share, plan_id, status, note, cost_center, is_demo, gl_entry_id, to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at from network_transfers order by id desc limit 500`,
      sql`select id, network_id, partner_id, currency, amount::text as amount, note, status, is_demo from balance_holds order by id desc limit 200`,
      sql`select id, code, network_id, partner_id, currency, period_start::text as period_start, period_end::text as period_end, system_amount::text as system_amount, statement_amount::text as statement_amount, difference::text as difference, status, note, documents, cost_center, is_demo, created_by, approved_by from settlements order by id desc`,
      sql`select id, code, network_id, partner_id, kind, signed_on::text as signed_on, starts_on::text as starts_on, ends_on::text as ends_on, terms, commission_note, limits_note, obligations, documents, status, alert_days, is_demo from network_agreements order by ends_on nulls last, id`,
      sql`select id, network_id, provider, mode, api_base, sandbox_base, secret_hint, status, last_error, to_char(last_ok_at, 'YYYY-MM-DD HH24:MI') as last_ok_at, to_char(last_sync_at, 'YYYY-MM-DD HH24:MI') as last_sync_at from network_integrations order by id`,
      sql`select id, integration_id, message, to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at from integration_logs order by id desc limit 40`,
      sql`select network_id, service_code, enabled, approved from network_services order by network_id, service_code`,
      sql`select code, name_ar, kind, currency, network_id, partner_id from gl_accounts order by code`,
      sql`select e.id, e.idempotency_key, e.kind, e.memo, e.source, to_char(e.created_at, 'YYYY-MM-DD HH24:MI') as created_at, l.account_code, l.currency, l.debit::text as debit, l.credit::text as credit, l.is_demo from gl_entries e join gl_lines l on l.entry_id = e.id order by e.id desc limit 400`,
    ]);
  return {
    caps: caps(profile.role),
    vaultDemo: !process.env.NETWORK_VAULT_KEY,
    networks: plains(networks as Record<string, unknown>[]),
    partners: plains(partners as Record<string, unknown>[]),
    links: plains(links as Record<string, unknown>[]),
    branches: plains(branches as Record<string, unknown>[]),
    corridors: plains(corridors as Record<string, unknown>[]),
    plans: plains(plans as Record<string, unknown>[]),
    tiers: plains(tiers as Record<string, unknown>[]),
    transfers: plains(transfers as Record<string, unknown>[]),
    holds: plains(holds as Record<string, unknown>[]),
    settlements: plains(settlements as Record<string, unknown>[]),
    agreements: plains(agreements as Record<string, unknown>[]),
    integrations: plains(integrations as Record<string, unknown>[]),
    logs: plains(logs as Record<string, unknown>[]),
    services: plains(services as Record<string, unknown>[]),
    accounts: plains(accounts as Record<string, unknown>[]),
    entries: plains(entries as Record<string, unknown>[]),
  };
}

async function networkRow(sql: Sql, id: number) {
  const rows = await sql<{ is_demo: boolean; status: string; name_ar: string }>`
    select is_demo, status, name_ar from transfer_networks where id = ${id}
  `;
  if (!rows[0]) throw new Error("الشبكة غير موجودة");
  return rows[0];
}

export async function actNetworks(userId: string, action: Record<string, unknown>) {
  const profile = await requirePerm(userId, "networks");
  const ability = caps(profile.role);
  const sql = await getSql();
  const type = text(action.type, 40);

  if (type === "save-network") {
    if (!ability.write) throw new Error("ليست لديك صلاحية تعديل الشبكات");
    const id = Number(action.id || 0);
    const status = text(action.status, 20);
    const kind = text(action.kind, 20);
    if (!NET_STATUS.includes(status) || !NET_KINDS.includes(kind)) throw new Error("تصنيف أو حالة غير معروفة");
    if ((status === "stopped" || status === "expired") && !ability.approve) {
      throw new Error("إيقاف الشبكة أو إنهاء اتفاقها يحتاج اعتماد المدير المالي");
    }
    const code = text(action.code, 40);
    const nameAr = text(action.nameAr, 160);
    if (!code || !nameAr) throw new Error("الرقم التعريفي والاسم العربي مطلوبان");
    const fields = {
      code,
      nameAr,
      nameEn: text(action.nameEn, 160),
      logo: httpUrl(action.logoUrl),
      kind,
      country: text(action.country, 80),
      owner: text(action.ownerName, 160),
      operator: text(action.operatorName, 160),
      website: httpUrl(action.website),
      phone: text(action.phone, 80),
      email: text(action.email, 120),
      address: text(action.address, 240),
      coverage: text(action.coverage, 400),
      currencies: text(action.currencies, 120),
      transferTypes: text(action.transferTypes, 240),
      feeNote: text(action.feeNote, 400),
      commissionNote: text(action.commissionNote, 400),
      started: day(action.startedOn),
      ends: day(action.agreementEndsOn),
      status,
      notes: text(action.notes, 800),
      demo: Boolean(action.demo),
    };
    if (id) {
      await sql`
        update transfer_networks set
          code = ${fields.code}, name_ar = ${fields.nameAr}, name_en = ${fields.nameEn}, logo_url = ${fields.logo},
          kind = ${fields.kind}, country = ${fields.country}, owner_name = ${fields.owner}, operator_name = ${fields.operator},
          website = ${fields.website}, phone = ${fields.phone}, email = ${fields.email}, address = ${fields.address},
          coverage = ${fields.coverage}, currencies = ${fields.currencies}, transfer_types = ${fields.transferTypes},
          fee_note = ${fields.feeNote}, commission_note = ${fields.commissionNote}, started_on = ${fields.started},
          agreement_ends_on = ${fields.ends}, status = ${fields.status}, notes = ${fields.notes}, is_demo = ${fields.demo},
          updated_at = now()
        where id = ${id}
      `;
      await audit(sql, userId, "update", "transfer_network", String(id), fields.status);
    } else {
      const inserted = await sql<{ id: number }>`
        insert into transfer_networks (
          code, name_ar, name_en, logo_url, kind, country, owner_name, operator_name, website, phone, email, address,
          coverage, currencies, transfer_types, fee_note, commission_note, started_on, agreement_ends_on, status, notes, is_demo
        ) values (
          ${fields.code}, ${fields.nameAr}, ${fields.nameEn}, ${fields.logo}, ${fields.kind}, ${fields.country},
          ${fields.owner}, ${fields.operator}, ${fields.website}, ${fields.phone}, ${fields.email}, ${fields.address},
          ${fields.coverage}, ${fields.currencies}, ${fields.transferTypes}, ${fields.feeNote}, ${fields.commissionNote},
          ${fields.started}, ${fields.ends}, ${fields.status}, ${fields.notes}, ${fields.demo}
        ) returning id
      `;
      const networkId = Number(inserted[0].id);
      for (const code of SERVICES) {
        await sql`
          insert into network_services (network_id, service_code, enabled, approved)
          values (${networkId}, ${code}, false, false)
          on conflict do nothing
        `;
      }
      await audit(sql, userId, "create", "transfer_network", String(networkId), fields.code);
    }
    return loadNetworksDesk(userId);
  }

  if (type === "save-partner") {
    if (!ability.write) throw new Error("ليست لديك صلاحية تعديل الشركاء");
    const id = Number(action.id || 0);
    const kind = text(action.kind, 30);
    const status = text(action.status, 20);
    if (!PTR_KINDS.includes(kind) || !NET_STATUS.includes(status)) throw new Error("نوع الشريك أو حالته غير معروفة");
    const code = text(action.code, 40);
    const trade = text(action.tradeName, 160);
    if (!code || !trade) throw new Error("رقم الشريك والاسم التجاري مطلوبان");
    const row = {
      code,
      trade,
      legal: text(action.legalName, 160),
      logo: httpUrl(action.logoUrl),
      kind,
      country: text(action.country, 80),
      city: text(action.city, 80),
      address: text(action.address, 240),
      phones: text(action.phones, 160),
      email: text(action.email, 120),
      website: httpUrl(action.website),
      contact: text(action.contactName, 120),
      contactInfo: text(action.contactInfo, 240),
      license: text(action.licenseNo, 80),
      regulator: text(action.regulator, 120),
      started: day(action.relationStartedOn),
      agreement: day(action.agreementOn),
      ends: day(action.agreementEndsOn),
      status,
      documents: text(action.documents, 500),
      notes: text(action.notes, 800),
      demo: Boolean(action.demo),
    };
    if (id) {
      await sql`
        update finance_partners set
          code = ${row.code}, trade_name = ${row.trade}, legal_name = ${row.legal}, logo_url = ${row.logo}, kind = ${row.kind},
          country = ${row.country}, city = ${row.city}, address = ${row.address}, phones = ${row.phones}, email = ${row.email},
          website = ${row.website}, contact_name = ${row.contact}, contact_info = ${row.contactInfo}, license_no = ${row.license},
          regulator = ${row.regulator}, relation_started_on = ${row.started}, agreement_on = ${row.agreement},
          agreement_ends_on = ${row.ends}, status = ${row.status}, documents = ${row.documents}, notes = ${row.notes},
          is_demo = ${row.demo}, updated_at = now()
        where id = ${id}
      `;
      await audit(sql, userId, "update", "finance_partner", String(id), row.status);
    } else {
      const inserted = await sql<{ id: number }>`
        insert into finance_partners (
          code, trade_name, legal_name, logo_url, kind, country, city, address, phones, email, website, contact_name,
          contact_info, license_no, regulator, relation_started_on, agreement_on, agreement_ends_on, status, documents, notes, is_demo
        ) values (
          ${row.code}, ${row.trade}, ${row.legal}, ${row.logo}, ${row.kind}, ${row.country}, ${row.city}, ${row.address},
          ${row.phones}, ${row.email}, ${row.website}, ${row.contact}, ${row.contactInfo}, ${row.license}, ${row.regulator},
          ${row.started}, ${row.agreement}, ${row.ends}, ${row.status}, ${row.documents}, ${row.notes}, ${row.demo}
        ) returning id
      `;
      await audit(sql, userId, "create", "finance_partner", String(inserted[0].id), row.code);
    }
    return loadNetworksDesk(userId);
  }

  if (type === "save-link") {
    if (!ability.write) throw new Error("ليست لديك صلاحية تعديل العلاقات");
    const id = Number(action.id || 0);
    const networkId = Number(action.networkId);
    const partnerId = Number(action.partnerId);
    const status = text(action.status, 20);
    if (!["active", "inactive", "pending", "suspended"].includes(status)) throw new Error("حالة العلاقة غير معروفة");
    await networkRow(sql, networkId);
    const partner = await sql`select id from finance_partners where id = ${partnerId}`;
    if (!partner[0]) throw new Error("الشريك غير موجود");
    const services = text(action.services, 200);
    const currencies = text(action.currencies, 80);
    const minAmount = optionalNum(action.minAmount);
    const maxAmount = optionalNum(action.maxAmount);
    const agreementRef = text(action.agreementRef, 80);
    const notes = text(action.notes, 400);
    let linkId = id;
    if (id) {
      await sql`
        update network_links set
          network_id = ${networkId}, partner_id = ${partnerId}, services = ${services}, currencies = ${currencies},
          min_amount = ${minAmount}, max_amount = ${maxAmount}, agreement_ref = ${agreementRef}, status = ${status}, notes = ${notes}
        where id = ${id}
      `;
    } else {
      const inserted = await sql<{ id: number }>`
        insert into network_links (network_id, partner_id, services, currencies, min_amount, max_amount, agreement_ref, status, notes)
        values (${networkId}, ${partnerId}, ${services}, ${currencies}, ${minAmount}, ${maxAmount}, ${agreementRef}, ${status}, ${notes})
        returning id
      `;
      linkId = Number(inserted[0].id);
    }
    await sql`delete from link_branches where link_id = ${linkId}`;
    const branchIds = text(action.branchIds, 200)
      .split(/[,\s]+/)
      .map((item) => Number(item))
      .filter((item) => Number.isInteger(item) && item > 0);
    for (const branchId of branchIds) {
      const found = await sql`select id from branches where id = ${branchId} and active = true`;
      if (found[0]) await sql`insert into link_branches (link_id, branch_id) values (${linkId}, ${branchId}) on conflict do nothing`;
    }
    await audit(sql, userId, "save", "network_link", String(linkId), `${networkId}:${partnerId}`);
    return loadNetworksDesk(userId);
  }

  if (type === "save-corridor") {
    if (!ability.write) throw new Error("ليست لديك صلاحية تعديل الممرات");
    const id = Number(action.id || 0);
    const send = text(action.sendCountry, 80);
    const recv = text(action.recvCountry, 80);
    const networkId = Number(action.networkId);
    const status = text(action.status, 20);
    if (!send || !recv) throw new Error("دولتا الإرسال والاستلام مطلوبة");
    if (!["active", "inactive"].includes(status)) throw new Error("حالة الممر غير معروفة");
    const network = await networkRow(sql, networkId);
    const sendPartner = Number(action.sendPartnerId || 0) || null;
    const recvPartner = Number(action.recvPartnerId || 0) || null;
    const row = {
      send,
      recv,
      networkId,
      sendPartner,
      recvPartner,
      currencies: text(action.currencies, 80),
      minAmount: optionalNum(action.minAmount),
      maxAmount: optionalNum(action.maxAmount),
      feeNote: text(action.feeNote, 240),
      etaNote: text(action.etaNote, 120),
      status,
      demo: network.is_demo || Boolean(action.demo),
    };
    if (id) {
      await sql`
        update corridors set
          send_country = ${row.send}, recv_country = ${row.recv}, network_id = ${row.networkId},
          send_partner_id = ${row.sendPartner}, recv_partner_id = ${row.recvPartner}, currencies = ${row.currencies},
          min_amount = ${row.minAmount}, max_amount = ${row.maxAmount}, fee_note = ${row.feeNote}, eta_note = ${row.etaNote},
          status = ${row.status}, is_demo = ${row.demo}
        where id = ${id}
      `;
    } else {
      await sql`
        insert into corridors (
          send_country, recv_country, network_id, send_partner_id, recv_partner_id, currencies,
          min_amount, max_amount, fee_note, eta_note, status, is_demo
        ) values (
          ${row.send}, ${row.recv}, ${row.networkId}, ${row.sendPartner}, ${row.recvPartner}, ${row.currencies},
          ${row.minAmount}, ${row.maxAmount}, ${row.feeNote}, ${row.etaNote}, ${row.status}, ${row.demo}
        )
      `;
    }
    await audit(sql, userId, "save", "corridor", send + "->" + recv, status);
    return loadNetworksDesk(userId);
  }

  if (type === "save-plan") {
    if (!ability.fees) throw new Error("ليست لديك صلاحية اتفاقيات العمولة");
    const networkId = Number(action.networkId);
    await networkRow(sql, networkId);
    const kind = text(action.kind, 20);
    if (!["fixed", "percent", "tiered"].includes(kind)) throw new Error("نوع العمولة غير معروف");
    const side = text(action.side, 20);
    if (!["send", "receive"].includes(side)) throw new Error("جهة العمولة غير معروفة");
    const companyShare = num(action.companyShare ?? 100);
    if (companyShare < 0 || companyShare > 100) throw new Error("حصة الشركة بين 0 و 100");
    const previous = Number(action.replacesId || 0);
    if (previous) {
      const snap = await sql`select * from commission_plans where id = ${previous}`;
      if (snap[0]) {
        await sql`
          insert into commission_revisions (plan_id, snapshot, actor_id)
          values (${previous}, ${JSON.stringify(snap[0])}::jsonb, ${userId})
        `;
        await sql`update commission_plans set active = false, ends_on = current_date, superseded_by = null where id = ${previous}`;
      }
    }
    const inserted = await sql<{ id: number }>`
      insert into commission_plans (
        network_id, partner_id, service_code, currency, country, side, kind, min_amount, max_amount,
        percent, fixed_amount, company_share, starts_on, ends_on, active
      ) values (
        ${networkId}, ${Number(action.partnerId || 0) || null}, ${text(action.serviceCode, 30) || "send"},
        ${text(action.currency, 8).toUpperCase()}, ${text(action.country, 80)}, ${side}, ${kind},
        ${num(action.minAmount || 0)}, ${optionalNum(action.maxAmount)}, ${num(action.percent || 0)},
        ${num(action.fixed || 0)}, ${companyShare}, ${day(action.startsOn) || new Date().toISOString().slice(0, 10)},
        ${day(action.endsOn)}, true
      ) returning id
    `;
    const planId = Number(inserted[0].id);
    if (previous) await sql`update commission_plans set superseded_by = ${planId} where id = ${previous}`;
    if (kind === "tiered" && Array.isArray(action.tiers)) {
      for (const tier of action.tiers as Record<string, unknown>[]) {
        await sql`
          insert into commission_tiers (plan_id, min_amount, max_amount, percent, fixed_amount)
          values (${planId}, ${num(tier.minAmount || 0)}, ${optionalNum(tier.maxAmount)}, ${num(tier.percent || 0)}, ${num(tier.fixed || 0)})
        `;
      }
    }
    await audit(sql, userId, "create", "commission_plan", String(planId), previous ? `replaces ${previous}` : "new");
    return loadNetworksDesk(userId);
  }

  if (type === "quote") {
    const plan = await planById(sql, Number(action.planId));
    return { quote: plan ? quoteCommission(num(action.amount), plan) : null };
  }

  if (type === "post-transfer") {
    if (!ability.money) throw new Error("تسجيل العملية المالية يحتاج صلاحية المحاسب أو مسؤول التسويات");
    const key = text(action.idempotencyKey, 80);
    if (!/^[A-Za-z0-9:_-]{8,80}$/.test(key)) throw new Error("مفتاح منع التكرار غير صالح");
    const existing = await sql<{ reference: string }>`select reference from network_transfers where reference = ${key}`;
    if (existing[0]) return loadNetworksDesk(userId);
    const networkId = Number(action.networkId);
    const network = await networkRow(sql, networkId);
    const direction = text(action.direction, 8) === "in" ? "in" : "out";
    const status = text(action.status, 20);
    if (!["posted", "failed", "rejected"].includes(status)) throw new Error("حالة العملية غير معروفة");
    const currency = text(action.currency, 8).toUpperCase();
    const amount = num(action.amount);
    if (!currency || amount <= 0) throw new Error("العملة والمبلغ مطلوبان");
    const sendPartner = Number(action.sendPartnerId || 0) || null;
    const recvPartner = Number(action.recvPartnerId || 0) || null;
    const partnerId = direction === "out" ? sendPartner : recvPartner;
    const plan = await matchPlan(sql, {
      networkId,
      partnerId,
      currency,
      country: text(action.country, 80),
      side: direction === "out" ? "send" : "receive",
      serviceCode: text(action.serviceCode, 30) || (direction === "out" ? "send" : "receive"),
      amount,
    });
    const quote = plan ? quoteCommission(amount, plan) : null;
    const fee = quote?.fee ?? 0;
    const company = quote?.company ?? 0;
    const partnerShare = quote?.partner ?? 0;
    const demo = network.is_demo;
    const cost = text(action.costCenter, 60);
    let glId: number | null = null;
    if (status === "posted") {
      const lines = transferLines({
        direction,
        currency,
        amount,
        company,
        partnerShare,
        networkId,
        networkName: network.name_ar,
        partnerId,
        demo,
        cost,
      });
      glId = await postGl(sql, {
        key: `xfer:${key}`,
        kind: direction === "out" ? "transfer_out" : "transfer_in",
        memo: text(action.note, 200) || (direction === "out" ? "حوالة صادرة" : "حوالة واردة"),
        source: `network_transfer:${key}`,
        actor: userId,
        lines,
      });
    }
    await sql`
      insert into network_transfers (
        reference, network_id, corridor_id, send_partner_id, recv_partner_id, direction, currency, amount,
        fee, company_share, partner_share, plan_id, status, note, cost_center, is_demo, gl_entry_id, actor_id
      ) values (
        ${key}, ${networkId}, ${Number(action.corridorId || 0) || null}, ${sendPartner}, ${recvPartner}, ${direction},
        ${currency}, ${amount}, ${fee}, ${company}, ${partnerShare}, ${plan?.id ?? null}, ${status}, ${text(action.note, 300)},
        ${cost}, ${demo}, ${glId}, ${userId}
      )
    `;
    await audit(sql, userId, "post", "network_transfer", key, status);
    return loadNetworksDesk(userId);
  }

  if (type === "void-transfer") {
    if (!ability.approve) throw new Error("إلغاء الأثر المالي يحتاج اعتماداً");
    const id = Number(action.id);
    const rows = await sql<Record<string, unknown>>`
      select id, reference, status, gl_entry_id, direction, currency, amount::text, company_share::text, partner_share::text,
        network_id, send_partner_id, recv_partner_id, is_demo, cost_center, note
      from network_transfers where id = ${id}
    `;
    const row = rows[0];
    if (!row) throw new Error("العملية غير موجودة");
    if (String(row.status) === "void") return loadNetworksDesk(userId);
    if (String(row.status) !== "posted") {
      await sql`update network_transfers set status = 'void' where id = ${id}`;
      await audit(sql, userId, "void", "network_transfer", String(id), "no-gl");
      return loadNetworksDesk(userId);
    }
    const direction = String(row.direction) === "in" ? "in" : "out";
    const lines = transferLines({
      direction,
      currency: String(row.currency),
      amount: num(row.amount),
      company: num(row.company_share),
      partnerShare: num(row.partner_share),
      networkId: Number(row.network_id),
      networkName: "عكس",
      partnerId: direction === "out" ? Number(row.send_partner_id || 0) || null : Number(row.recv_partner_id || 0) || null,
      demo: Boolean(row.is_demo),
      cost: String(row.cost_center ?? ""),
    }).map((line) => ({ ...line, debit: line.credit, credit: line.debit }));
    const glId = await postGl(sql, {
      key: `void:xfer:${row.reference}`,
      kind: "reversal",
      memo: "عكس حوالة شبكة",
      source: `network_transfer:${row.reference}`,
      actor: userId,
      lines,
    });
    await sql`update gl_entries set reverses_id = ${Number(row.gl_entry_id)} where id = ${glId}`;
    await sql`update network_transfers set status = 'void' where id = ${id}`;
    await audit(sql, userId, "void", "network_transfer", String(id), String(row.reference));
    return loadNetworksDesk(userId);
  }

  if (type === "post-movement") {
    if (!ability.money) throw new Error("حركة الرصيد تحتاج صلاحية مالية");
    const kind = text(action.kind, 20);
    if (!["opening", "deposit", "withdrawal"].includes(kind)) throw new Error("نوع الحركة غير معروف");
    if (kind === "opening" && !ability.approve) throw new Error("الرصيد الافتتاحي يحتاج اعتماد المدير المالي");
    const key = text(action.idempotencyKey, 80);
    if (!/^[A-Za-z0-9:_-]{8,80}$/.test(key)) throw new Error("مفتاح منع التكرار غير صالح");
    const networkId = Number(action.networkId);
    const network = await networkRow(sql, networkId);
    const currency = text(action.currency, 8).toUpperCase();
    const amount = num(action.amount);
    if (amount <= 0) throw new Error("المبلغ يجب أن يكون أكبر من صفر");
    const cost = text(action.costCenter, 60);
    const demo = network.is_demo;
    const net: GlDraft = {
      accountCode: `NET:${networkId}:${currency}`,
      accountName: `رصيد لدى ${network.name_ar} ${currency}`,
      kind: "asset",
      currency,
      debit: kind === "withdrawal" ? 0 : amount,
      credit: kind === "withdrawal" ? amount : 0,
      networkId,
      partnerId: null,
      demo,
      costCenter: cost,
    };
    const other: GlDraft =
      kind === "opening"
        ? {
            accountCode: `OPEN:${currency}`,
            accountName: `أرصدة افتتاحية ${currency}`,
            kind: "equity",
            currency,
            debit: 0,
            credit: amount,
            networkId: null,
            partnerId: null,
            demo,
            costCenter: cost,
          }
        : cash(currency, amount, kind === "withdrawal", demo, cost);
    await postGl(sql, {
      key: `move:${key}`,
      kind,
      memo: text(action.note, 200) || kind,
      source: `movement:${key}`,
      actor: userId,
      lines: [net, other],
    });
    await audit(sql, userId, "post", "network_movement", key, kind);
    return loadNetworksDesk(userId);
  }

  if (type === "hold") {
    if (!ability.money) throw new Error("الحجز يحتاج صلاحية مالية");
    const networkId = Number(action.networkId);
    const network = await networkRow(sql, networkId);
    const amount = num(action.amount);
    if (amount <= 0) throw new Error("مبلغ الحجز غير صالح");
    await sql`
      insert into balance_holds (network_id, partner_id, currency, amount, note, is_demo, actor_id)
      values (
        ${networkId}, ${Number(action.partnerId || 0) || null}, ${text(action.currency, 8).toUpperCase()},
        ${amount}, ${text(action.note, 200)}, ${network.is_demo}, ${userId}
      )
    `;
    await audit(sql, userId, "hold", "balance_hold", String(networkId), String(amount));
    return loadNetworksDesk(userId);
  }

  if (type === "release-hold") {
    if (!ability.money) throw new Error("فك الحجز يحتاج صلاحية مالية");
    await sql`update balance_holds set status = 'released' where id = ${Number(action.id)} and status = 'active'`;
    await audit(sql, userId, "release", "balance_hold", String(action.id), "");
    return loadNetworksDesk(userId);
  }

  if (type === "save-settlement") {
    if (!ability.money) throw new Error("إنشاء التسوية يحتاج صلاحية مالية");
    const networkId = Number(action.networkId);
    const network = await networkRow(sql, networkId);
    const currency = text(action.currency, 8).toUpperCase();
    const start = day(action.periodStart);
    const end = day(action.periodEnd);
    if (!start || !end) throw new Error("فترة التسوية مطلوبة");
    const partnerId = Number(action.partnerId || 0) || null;
    const systemRows = await sql<{ total: string }>`
      select coalesce(sum(partner_share), 0)::text as total
      from network_transfers
      where network_id = ${networkId}
        and currency = ${currency}
        and status = 'posted'
        and created_at::date between ${start}::date and ${end}::date
        and (${partnerId}::int is null or send_partner_id = ${partnerId} or recv_partner_id = ${partnerId})
    `;
    const systemAmount = num(systemRows[0]?.total ?? 0);
    const statementAmount = num(action.statementAmount);
    const difference = round4(statementAmount - systemAmount);
    const code = text(action.code, 40) || `SET-${Date.now()}`;
    const inserted = await sql<{ id: number }>`
      insert into settlements (
        code, network_id, partner_id, currency, period_start, period_end, system_amount, statement_amount,
        difference, status, note, documents, cost_center, is_demo, created_by
      ) values (
        ${code}, ${networkId}, ${partnerId}, ${currency}, ${start}, ${end}, ${systemAmount}, ${statementAmount},
        ${difference}, 'draft', ${text(action.note, 400)}, ${text(action.documents, 300)}, ${text(action.costCenter, 60)},
        ${network.is_demo}, ${userId}
      ) returning id
    `;
    if (difference !== 0) {
      await sql`
        insert into settlement_diffs (settlement_id, note, amount)
        values (${inserted[0].id}, ${text(action.diffNote, 300) || "فرق بين كشف الشريك ومجموع حصص النظام"}, ${difference})
      `;
    }
    await audit(sql, userId, "create", "settlement", String(inserted[0].id), code);
    return loadNetworksDesk(userId);
  }

  if (type === "approve-settlement") {
    if (!ability.approve) throw new Error("اعتماد التسوية للمدير المالي فقط");
    const id = Number(action.id);
    const rows = await sql<Record<string, unknown>>`
      select id, code, network_id, partner_id, currency, statement_amount::text, difference::text, status, created_by, is_demo, cost_center
      from settlements where id = ${id}
    `;
    const row = rows[0];
    if (!row) throw new Error("التسوية غير موجودة");
    if (String(row.status) === "approved") return loadNetworksDesk(userId);
    if (String(row.created_by) === userId) throw new Error("لا يعتمد منشئ التسوية قيدها. يلزم مستخدم آخر بصلاحية الاعتماد.");
    const currency = String(row.currency);
    const statement = num(row.statement_amount);
    const difference = num(row.difference);
    const networkId = Number(row.network_id);
    const partnerId = Number(row.partner_id || 0) || null;
    const network = await networkRow(sql, networkId);
    const demo = Boolean(row.is_demo);
    const cost = String(row.cost_center ?? "");
    const lines: GlDraft[] = [];
    if (difference !== 0 && partnerId) {
      const ptr = partnerLine(partnerId, currency, demo, cost, difference > 0 ? "credit" : "debit", Math.abs(difference));
      const diff = {
        accountCode: `DIFF:${currency}`,
        accountName: `فروقات تسوية ${currency}`,
        kind: "expense" as const,
        currency,
        debit: difference > 0 ? Math.abs(difference) : 0,
        credit: difference > 0 ? 0 : Math.abs(difference),
        networkId: null,
        partnerId: null,
        demo,
        costCenter: cost,
      };
      lines.push(ptr, diff);
    }
    if (lines.length) {
      await postGl(sql, {
        key: `settlement:${row.code}:diff`,
        kind: "difference",
        memo: `فرق تسوية ${row.code}`,
        source: `settlement:${id}`,
        actor: userId,
        lines,
      });
    }
    if (statement > 0 && partnerId) {
      await postGl(sql, {
        key: `settlement:${row.code}:pay`,
        kind: "settlement",
        memo: `سداد تسوية ${row.code} لدى ${network.name_ar}`,
        source: `settlement:${id}`,
        actor: userId,
        lines: [
          partnerLine(partnerId, currency, demo, cost, "debit", statement),
          cash(currency, statement, false, demo, cost),
        ],
      });
    }
    await sql`
      update settlements set status = 'approved', approved_by = ${userId}, approved_at = now() where id = ${id}
    `;
    await audit(sql, userId, "approve", "settlement", String(id), String(row.code));
    return loadNetworksDesk(userId);
  }

  if (type === "save-agreement") {
    if (!ability.write) throw new Error("ليست لديك صلاحية الاتفاقيات");
    const id = Number(action.id || 0);
    const code = text(action.code, 40);
    if (!code) throw new Error("رقم الاتفاقية مطلوب");
    const status = text(action.status, 20);
    if (!["draft", "active", "expired", "terminated"].includes(status)) throw new Error("حالة الاتفاقية غير معروفة");
    if ((status === "terminated" || status === "expired") && !ability.approve) {
      throw new Error("إنهاء الاتفاقية يحتاج اعتماداً");
    }
    const networkId = Number(action.networkId || 0) || null;
    const demo = networkId ? (await networkRow(sql, networkId)).is_demo : Boolean(action.demo);
    const row = {
      code,
      networkId,
      partnerId: Number(action.partnerId || 0) || null,
      kind: text(action.kind, 80) || "تعامل",
      signed: day(action.signedOn),
      starts: day(action.startsOn),
      ends: day(action.endsOn),
      terms: text(action.terms, 1200),
      commission: text(action.commissionNote, 400),
      limits: text(action.limitsNote, 400),
      obligations: text(action.obligations, 800),
      documents: text(action.documents, 400),
      status,
      alertDays: Math.min(180, Math.max(1, Number(action.alertDays || 30) || 30)),
      demo,
    };
    if (id) {
      await sql`
        update network_agreements set
          code = ${row.code}, network_id = ${row.networkId}, partner_id = ${row.partnerId}, kind = ${row.kind},
          signed_on = ${row.signed}, starts_on = ${row.starts}, ends_on = ${row.ends}, terms = ${row.terms},
          commission_note = ${row.commission}, limits_note = ${row.limits}, obligations = ${row.obligations},
          documents = ${row.documents}, status = ${row.status}, alert_days = ${row.alertDays}, is_demo = ${row.demo}
        where id = ${id}
      `;
    } else {
      await sql`
        insert into network_agreements (
          code, network_id, partner_id, kind, signed_on, starts_on, ends_on, terms, commission_note,
          limits_note, obligations, documents, status, alert_days, is_demo
        ) values (
          ${row.code}, ${row.networkId}, ${row.partnerId}, ${row.kind}, ${row.signed}, ${row.starts}, ${row.ends},
          ${row.terms}, ${row.commission}, ${row.limits}, ${row.obligations}, ${row.documents}, ${row.status},
          ${row.alertDays}, ${row.demo}
        )
      `;
    }
    await audit(sql, userId, "save", "network_agreement", code, status);
    return loadNetworksDesk(userId);
  }

  if (type === "save-integration") {
    if (!ability.write) throw new Error("ليست لديك صلاحية الربط");
    const networkId = Number(action.networkId);
    await networkRow(sql, networkId);
    const mode = text(action.mode, 20);
    if (!["rest", "webhook", "file", "direct", "manual"].includes(mode)) throw new Error("وسيلة الربط غير معروفة");
    const secret = text(action.secret, 400);
    if (secret && !ability.secrets) throw new Error("حفظ مفتاح الربط لمدير النظام فقط");
    const hint = secret ? `••••${secret.slice(-4)}` : null;
    const enc = secret ? encryptSecret(secret) : null;
    const existing = await sql<{ id: number }>`select id from network_integrations where network_id = ${networkId}`;
    if (existing[0]) {
      await sql`
        update network_integrations set
          provider = ${text(action.provider, 120)},
          mode = ${mode},
          api_base = ${httpUrl(action.apiBase)},
          sandbox_base = ${httpUrl(action.sandboxBase)},
          secret_enc = coalesce(${enc}, secret_enc),
          secret_hint = coalesce(${hint}, secret_hint),
          status = ${mode === "manual" ? "manual" : "untested"},
          last_error = ${text(action.errorNote, 300)},
          updated_at = now()
        where network_id = ${networkId}
      `;
    } else {
      await sql`
        insert into network_integrations (network_id, provider, mode, api_base, sandbox_base, secret_enc, secret_hint, status, last_error)
        values (
          ${networkId}, ${text(action.provider, 120)}, ${mode}, ${httpUrl(action.apiBase)}, ${httpUrl(action.sandboxBase)},
          ${enc ?? ""}, ${hint ?? ""}, ${mode === "manual" ? "manual" : "untested"}, ${text(action.errorNote, 300)}
        )
      `;
    }
    const again = await sql<{ id: number }>`select id from network_integrations where network_id = ${networkId}`;
    if (text(action.log, 300)) {
      await sql`insert into integration_logs (integration_id, message) values (${again[0].id}, ${text(action.log, 300)})`;
    }
    await audit(sql, userId, "save", "network_integration", String(networkId), mode);
    return loadNetworksDesk(userId);
  }

  if (type === "set-service") {
    if (!ability.write) throw new Error("ليست لديك صلاحية خدمات الشبكة");
    const networkId = Number(action.networkId);
    const code = text(action.serviceCode, 30);
    if (!SERVICES.includes(code)) throw new Error("خدمة غير معروفة");
    const enabled = Boolean(action.enabled);
    const approved = Boolean(action.approved);
    if (approved && !ability.approve) throw new Error("اعتماد الخدمة للمدير المالي");
    await sql`
      insert into network_services (network_id, service_code, enabled, approved)
      values (${networkId}, ${code}, ${enabled}, ${approved && enabled})
      on conflict (network_id, service_code) do update set
        enabled = ${enabled},
        approved = ${approved && enabled}
    `;
    await audit(sql, userId, "save", "network_service", `${networkId}:${code}`, approved ? "approved" : enabled ? "enabled" : "off");
    return loadNetworksDesk(userId);
  }

  throw new Error("إجراء غير معروف");
}

function partnerLine(partnerId: number, currency: string, demo: boolean, cost: string, side: "debit" | "credit", amount: number): GlDraft {
  return {
    accountCode: `PTR:${partnerId}:${currency}`,
    accountName: `مستحقات شريك ${partnerId} ${currency}`,
    kind: "liability",
    currency,
    debit: side === "debit" ? amount : 0,
    credit: side === "credit" ? amount : 0,
    networkId: null,
    partnerId,
    demo,
    costCenter: cost,
  };
}

function transferLines(input: {
  direction: "in" | "out";
  currency: string;
  amount: number;
  company: number;
  partnerShare: number;
  networkId: number;
  networkName: string;
  partnerId: number | null;
  demo: boolean;
  cost: string;
}): GlDraft[] {
  const { currency, amount, company, partnerShare, networkId, networkName, partnerId, demo, cost, direction } = input;
  const fee = round4(company + partnerShare);
  const net: GlDraft = {
    accountCode: `NET:${networkId}:${currency}`,
    accountName: `رصيد لدى ${networkName} ${currency}`,
    kind: "asset",
    currency,
    debit: direction === "in" ? amount : 0,
    credit: direction === "out" ? amount : 0,
    networkId,
    partnerId: null,
    demo,
    costCenter: cost,
  };
  const lines: GlDraft[] = [net, cash(currency, amount, direction === "out", demo, cost)];
  if (fee > 0) {
    lines.push(cash(currency, fee, true, demo, cost));
    if (company > 0) {
      lines.push({
        accountCode: `COM:${currency}`,
        accountName: `عمولات مكتسبة ${currency}`,
        kind: "income",
        currency,
        debit: 0,
        credit: company,
        networkId: null,
        partnerId: null,
        demo,
        costCenter: cost,
      });
    }
    if (partnerShare > 0 && partnerId) lines.push(partnerLine(partnerId, currency, demo, cost, "credit", partnerShare));
    else if (partnerShare > 0) {
      lines.push({
        accountCode: `COM:${currency}`,
        accountName: `عمولات مكتسبة ${currency}`,
        kind: "income",
        currency,
        debit: 0,
        credit: partnerShare,
        networkId: null,
        partnerId: null,
        demo,
        costCenter: cost,
      });
    }
  }
  return lines;
}

async function planById(sql: Sql, id: number): Promise<CommissionPlan | null> {
  const rows = await sql<Record<string, unknown>>`
    select id, kind, min_amount::text, max_amount::text, percent::text, fixed_amount::text, company_share::text, active
    from commission_plans where id = ${id}
  `;
  const row = rows[0];
  if (!row || !row.active) return null;
  const tiers = await sql<Record<string, unknown>>`
    select min_amount::text, max_amount::text, percent::text, fixed_amount::text
    from commission_tiers where plan_id = ${id} order by min_amount
  `;
  return toPlan(row, tiers);
}

async function matchPlan(
  sql: Sql,
  input: { networkId: number; partnerId: number | null; currency: string; country: string; side: string; serviceCode: string; amount: number },
) {
  const rows = await sql<Record<string, unknown>>`
    select id, partner_id, currency, country, service_code, kind, min_amount::text, max_amount::text,
      percent::text, fixed_amount::text, company_share::text
    from commission_plans
    where active = true
      and network_id = ${input.networkId}
      and side = ${input.side}
      and (partner_id is null or partner_id = ${input.partnerId})
      and (currency = '' or currency = ${input.currency})
      and (country = '' or country = ${input.country})
      and (service_code = '' or service_code = ${input.serviceCode})
      and starts_on <= current_date
      and (ends_on is null or ends_on >= current_date)
  `;
  const ranked = rows
    .map((row) => ({
      row,
      score:
        (row.partner_id ? 4 : 0) +
        (String(row.currency) ? 2 : 0) +
        (String(row.country) ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score);
  if (!ranked[0]) return null;
  const tiers = await sql<Record<string, unknown>>`
    select min_amount::text, max_amount::text, percent::text, fixed_amount::text
    from commission_tiers where plan_id = ${Number(ranked[0].row.id)} order by min_amount
  `;
  return toPlan(ranked[0].row, tiers);
}

function toPlan(row: Record<string, unknown>, tiers: Record<string, unknown>[]): CommissionPlan {
  return {
    id: Number(row.id),
    kind: String(row.kind) as CommissionPlan["kind"],
    minAmount: num(row.min_amount),
    maxAmount: row.max_amount == null ? null : num(row.max_amount),
    percent: num(row.percent),
    fixed: num(row.fixed_amount),
    companyShare: num(row.company_share),
    tiers: tiers.map((tier) => ({
      minAmount: num(tier.min_amount),
      maxAmount: tier.max_amount == null ? null : num(tier.max_amount),
      percent: num(tier.percent),
      fixed: num(tier.fixed_amount),
    })),
  };
}
