import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { $ as saveManagedPage, A as listPartnersAdmin, B as loadPublicHome, C as listInquiries, D as listNotices, E as listManagedPages, F as listTransfersAdmin, G as markNoticeRead, H as loadPublication, J as replyTicket, K as openTicket, L as loadManagedPage, M as listServiceRequests, N as listServicesAdmin, O as listOwnTickets, P as listStaff, Q as saveJob, R as loadNewsItem, S as listCustomers, T as listJobsPublic, U as loadService, V as loadPublicRateHistory, W as loadSettingsForAdmin, X as roleHas, Y as requirePerm, Z as saveBranch, _ as listAllBranches, a as claimAdmin, at as setInquiryStatus, b as listAudit, c as createServiceRequest, ct as trackComplaint, d as ensureProfile, et as saveNews, g as linkTransfer, h as getSql, i as authMiddleware, it as saveSettings, j as listRatesAdmin, k as listOwnedTransfers, l as createTransferAdmin, lt as trackTransfer, n as adminOverview, nt as saveRate, o as createComplaint, ot as setRole, q as replyComplaint, r as applyForJob, rt as saveServiceText, s as createInquiry, st as setTransferStatus, t as addRate, tt as savePartner, ut as updateOwnProfile, v as listAllNews, w as listJobsAdmin, x as listComplaints, y as listAllTickets, z as loadPublicBranch } from "./queries.server-CYegzkZO.mjs";
import { createCipheriv, randomBytes, scryptSync } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/fns-APwEgYce.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var MONEY = 0xe8d4a51000;
function round4(value) {
	return Math.round((value + Number.EPSILON) * 1e4) / 1e4;
}
function quoteCommission(amount, plan) {
	if (!Number.isFinite(amount) || amount <= 0 || amount > MONEY) return null;
	if (amount < plan.minAmount) return null;
	if (plan.maxAmount != null && amount > plan.maxAmount) return null;
	if (plan.companyShare < 0 || plan.companyShare > 100) return null;
	let fee = 0;
	if (plan.kind === "fixed") fee = plan.fixed;
	else if (plan.kind === "percent") fee = amount * (plan.percent / 100);
	else {
		const tier = plan.tiers.find((item) => amount >= item.minAmount && (item.maxAmount == null || amount <= item.maxAmount));
		if (!tier) return null;
		fee = tier.fixed + amount * (tier.percent / 100);
	}
	if (!Number.isFinite(fee) || fee < 0) return null;
	const rounded = round4(fee);
	const company = round4(rounded * (plan.companyShare / 100));
	return {
		fee: rounded,
		company,
		partner: round4(rounded - company),
		planId: plan.id
	};
}
function assertBalanced(lines) {
	if (!lines.length) throw new Error("القيد بلا بنود");
	const totals = /* @__PURE__ */ new Map();
	for (const line of lines) {
		if (!line.currency.trim()) throw new Error("عملة البند ناقصة");
		if (line.debit < 0 || line.credit < 0) throw new Error("مبلغ القيد لا يكون سالباً");
		if (line.debit > 0 && line.credit > 0) throw new Error("البند إما مدين أو دائن");
		if (line.debit === 0 && line.credit === 0) throw new Error("بند صفري");
		const bag = totals.get(line.currency) ?? {
			debit: 0,
			credit: 0
		};
		bag.debit = round4(bag.debit + line.debit);
		bag.credit = round4(bag.credit + line.credit);
		totals.set(line.currency, bag);
	}
	for (const [currency, bag] of totals) if (bag.debit !== bag.credit) throw new Error(`القيد غير متوازن لعملة ${currency}`);
}
var SERVICES = [
	"send",
	"receive",
	"account",
	"bank",
	"wallet",
	"international",
	"local",
	"inquiry",
	"cancel",
	"refund"
];
var NET_STATUS = [
	"active",
	"inactive",
	"pending",
	"suspended",
	"stopped",
	"expired"
];
var NET_KINDS = [
	"local_ye",
	"international",
	"regional",
	"banking",
	"ewallet"
];
var PTR_KINDS = [
	"exchange",
	"bank_local",
	"bank_intl",
	"mto",
	"ewallet",
	"agent",
	"correspondent",
	"intermediary"
];
function plain(row) {
	const out = {};
	for (const [key, value] of Object.entries(row)) if (value == null) out[key] = null;
	else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") out[key] = value;
	else if (typeof value === "bigint") out[key] = Number(value);
	else out[key] = String(value);
	return out;
}
function plains(rows) {
	return rows.map(plain);
}
function caps(role) {
	return {
		write: roleHas(role, "networks_write"),
		fees: roleHas(role, "networks_fees"),
		money: roleHas(role, "networks_money"),
		approve: roleHas(role, "networks_approve"),
		secrets: roleHas(role, "networks_secrets")
	};
}
function num(value) {
	const n = typeof value === "number" ? value : Number(String(value ?? "").replace(/,/g, ""));
	if (!Number.isFinite(n)) throw new Error("مبلغ غير صالح");
	return round4(n);
}
function text(value, max = 500) {
	return String(value ?? "").trim().slice(0, max);
}
function day(value) {
	const raw = text(value, 10);
	if (!raw) return null;
	if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) throw new Error("التاريخ بصيغة YYYY-MM-DD");
	return raw;
}
function optionalNum(value) {
	const raw = String(value ?? "").trim();
	if (!raw) return null;
	return num(raw);
}
function httpUrl(value) {
	const raw = text(value, 300);
	if (!raw) return "";
	if (!/^https:\/\/[^\s]+$/i.test(raw) && !/^\/(?!\/)/.test(raw)) throw new Error("الرابط يجب أن يبدأ بـ https أو يكون مساراً داخلياً");
	if (raw.includes("..")) throw new Error("مسار غير مقبول");
	return raw;
}
async function audit(sql, actorId, action, entity, entityId, detail) {
	await sql`
    insert into audit_log (actor_id, action, entity, entity_id, detail)
    values (${actorId}, ${action}, ${entity}, ${entityId}, ${detail})
  `;
}
function encryptSecret(plain) {
	const key = scryptSync(process.env.NETWORK_VAULT_KEY || "alkhadher-demo-vault-change-me", "alkhadher-networks", 32);
	const iv = randomBytes(12);
	const cipher = createCipheriv("aes-256-gcm", key, iv);
	const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
	const tag = cipher.getAuthTag();
	return Buffer.concat([
		iv,
		tag,
		enc
	]).toString("base64");
}
async function ensureAccount(sql, line) {
	await sql`
    insert into gl_accounts (code, name_ar, name_en, kind, currency, network_id, partner_id)
    values (${line.accountCode}, ${line.accountName}, ${line.accountCode}, ${line.kind}, ${line.currency}, ${line.networkId}, ${line.partnerId})
    on conflict (code) do nothing
  `;
}
async function postGl(sql, input) {
	assertBalanced(input.lines.map((line) => ({
		currency: line.currency,
		debit: line.debit,
		credit: line.credit
	})));
	for (const line of input.lines) await ensureAccount(sql, line);
	const payload = JSON.stringify(input.lines.map((line) => ({
		account_code: line.accountCode,
		account_name: line.accountName,
		currency: line.currency,
		debit: line.debit,
		credit: line.credit,
		network_id: line.networkId,
		partner_id: line.partnerId,
		is_demo: line.demo,
		cost_center: line.costCenter
	})));
	const rows = await sql`
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
function cash(ccy, amount, debit, demo, cost) {
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
		costCenter: cost
	};
}
async function loadNetworksDesk(userId) {
	const profile = await requirePerm(userId, "networks");
	const sql = await getSql();
	const [networks, partners, links, branches, corridors, plans, tiers, transfers, holds, settlements, agreements, integrations, logs, services, accounts, entries] = await Promise.all([
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
		sql`select e.id, e.idempotency_key, e.kind, e.memo, e.source, to_char(e.created_at, 'YYYY-MM-DD HH24:MI') as created_at, l.account_code, l.currency, l.debit::text as debit, l.credit::text as credit, l.is_demo from gl_entries e join gl_lines l on l.entry_id = e.id order by e.id desc limit 400`
	]);
	return {
		caps: caps(profile.role),
		vaultDemo: !process.env.NETWORK_VAULT_KEY,
		networks: plains(networks),
		partners: plains(partners),
		links: plains(links),
		branches: plains(branches),
		corridors: plains(corridors),
		plans: plains(plans),
		tiers: plains(tiers),
		transfers: plains(transfers),
		holds: plains(holds),
		settlements: plains(settlements),
		agreements: plains(agreements),
		integrations: plains(integrations),
		logs: plains(logs),
		services: plains(services),
		accounts: plains(accounts),
		entries: plains(entries)
	};
}
async function networkRow(sql, id) {
	const rows = await sql`
    select is_demo, status, name_ar from transfer_networks where id = ${id}
  `;
	if (!rows[0]) throw new Error("الشبكة غير موجودة");
	return rows[0];
}
async function actNetworks(userId, action) {
	const ability = caps((await requirePerm(userId, "networks")).role);
	const sql = await getSql();
	const type = text(action.type, 40);
	if (type === "save-network") {
		if (!ability.write) throw new Error("ليست لديك صلاحية تعديل الشبكات");
		const id = Number(action.id || 0);
		const status = text(action.status, 20);
		const kind = text(action.kind, 20);
		if (!NET_STATUS.includes(status) || !NET_KINDS.includes(kind)) throw new Error("تصنيف أو حالة غير معروفة");
		if ((status === "stopped" || status === "expired") && !ability.approve) throw new Error("إيقاف الشبكة أو إنهاء اتفاقها يحتاج اعتماد المدير المالي");
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
			demo: Boolean(action.demo)
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
			const inserted = await sql`
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
			for (const code of SERVICES) await sql`
          insert into network_services (network_id, service_code, enabled, approved)
          values (${networkId}, ${code}, false, false)
          on conflict do nothing
        `;
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
			demo: Boolean(action.demo)
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
			const inserted = await sql`
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
		if (![
			"active",
			"inactive",
			"pending",
			"suspended"
		].includes(status)) throw new Error("حالة العلاقة غير معروفة");
		await networkRow(sql, networkId);
		if (!(await sql`select id from finance_partners where id = ${partnerId}`)[0]) throw new Error("الشريك غير موجود");
		const services = text(action.services, 200);
		const currencies = text(action.currencies, 80);
		const minAmount = optionalNum(action.minAmount);
		const maxAmount = optionalNum(action.maxAmount);
		const agreementRef = text(action.agreementRef, 80);
		const notes = text(action.notes, 400);
		let linkId = id;
		if (id) await sql`
        update network_links set
          network_id = ${networkId}, partner_id = ${partnerId}, services = ${services}, currencies = ${currencies},
          min_amount = ${minAmount}, max_amount = ${maxAmount}, agreement_ref = ${agreementRef}, status = ${status}, notes = ${notes}
        where id = ${id}
      `;
		else {
			const inserted = await sql`
        insert into network_links (network_id, partner_id, services, currencies, min_amount, max_amount, agreement_ref, status, notes)
        values (${networkId}, ${partnerId}, ${services}, ${currencies}, ${minAmount}, ${maxAmount}, ${agreementRef}, ${status}, ${notes})
        returning id
      `;
			linkId = Number(inserted[0].id);
		}
		await sql`delete from link_branches where link_id = ${linkId}`;
		const branchIds = text(action.branchIds, 200).split(/[,\s]+/).map((item) => Number(item)).filter((item) => Number.isInteger(item) && item > 0);
		for (const branchId of branchIds) if ((await sql`select id from branches where id = ${branchId} and active = true`)[0]) await sql`insert into link_branches (link_id, branch_id) values (${linkId}, ${branchId}) on conflict do nothing`;
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
		const row = {
			send,
			recv,
			networkId,
			sendPartner: Number(action.sendPartnerId || 0) || null,
			recvPartner: Number(action.recvPartnerId || 0) || null,
			currencies: text(action.currencies, 80),
			minAmount: optionalNum(action.minAmount),
			maxAmount: optionalNum(action.maxAmount),
			feeNote: text(action.feeNote, 240),
			etaNote: text(action.etaNote, 120),
			status,
			demo: network.is_demo || Boolean(action.demo)
		};
		if (id) await sql`
        update corridors set
          send_country = ${row.send}, recv_country = ${row.recv}, network_id = ${row.networkId},
          send_partner_id = ${row.sendPartner}, recv_partner_id = ${row.recvPartner}, currencies = ${row.currencies},
          min_amount = ${row.minAmount}, max_amount = ${row.maxAmount}, fee_note = ${row.feeNote}, eta_note = ${row.etaNote},
          status = ${row.status}, is_demo = ${row.demo}
        where id = ${id}
      `;
		else await sql`
        insert into corridors (
          send_country, recv_country, network_id, send_partner_id, recv_partner_id, currencies,
          min_amount, max_amount, fee_note, eta_note, status, is_demo
        ) values (
          ${row.send}, ${row.recv}, ${row.networkId}, ${row.sendPartner}, ${row.recvPartner}, ${row.currencies},
          ${row.minAmount}, ${row.maxAmount}, ${row.feeNote}, ${row.etaNote}, ${row.status}, ${row.demo}
        )
      `;
		await audit(sql, userId, "save", "corridor", send + "->" + recv, status);
		return loadNetworksDesk(userId);
	}
	if (type === "save-plan") {
		if (!ability.fees) throw new Error("ليست لديك صلاحية اتفاقيات العمولة");
		const networkId = Number(action.networkId);
		await networkRow(sql, networkId);
		const kind = text(action.kind, 20);
		if (![
			"fixed",
			"percent",
			"tiered"
		].includes(kind)) throw new Error("نوع العمولة غير معروف");
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
		const inserted = await sql`
      insert into commission_plans (
        network_id, partner_id, service_code, currency, country, side, kind, min_amount, max_amount,
        percent, fixed_amount, company_share, starts_on, ends_on, active
      ) values (
        ${networkId}, ${Number(action.partnerId || 0) || null}, ${text(action.serviceCode, 30) || "send"},
        ${text(action.currency, 8).toUpperCase()}, ${text(action.country, 80)}, ${side}, ${kind},
        ${num(action.minAmount || 0)}, ${optionalNum(action.maxAmount)}, ${num(action.percent || 0)},
        ${num(action.fixed || 0)}, ${companyShare}, ${day(action.startsOn) || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)},
        ${day(action.endsOn)}, true
      ) returning id
    `;
		const planId = Number(inserted[0].id);
		if (previous) await sql`update commission_plans set superseded_by = ${planId} where id = ${previous}`;
		if (kind === "tiered" && Array.isArray(action.tiers)) for (const tier of action.tiers) await sql`
          insert into commission_tiers (plan_id, min_amount, max_amount, percent, fixed_amount)
          values (${planId}, ${num(tier.minAmount || 0)}, ${optionalNum(tier.maxAmount)}, ${num(tier.percent || 0)}, ${num(tier.fixed || 0)})
        `;
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
		if ((await sql`select reference from network_transfers where reference = ${key}`)[0]) return loadNetworksDesk(userId);
		const networkId = Number(action.networkId);
		const network = await networkRow(sql, networkId);
		const direction = text(action.direction, 8) === "in" ? "in" : "out";
		const status = text(action.status, 20);
		if (![
			"posted",
			"failed",
			"rejected"
		].includes(status)) throw new Error("حالة العملية غير معروفة");
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
			amount
		});
		const quote = plan ? quoteCommission(amount, plan) : null;
		const fee = quote?.fee ?? 0;
		const company = quote?.company ?? 0;
		const partnerShare = quote?.partner ?? 0;
		const demo = network.is_demo;
		const cost = text(action.costCenter, 60);
		let glId = null;
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
				cost
			});
			glId = await postGl(sql, {
				key: `xfer:${key}`,
				kind: direction === "out" ? "transfer_out" : "transfer_in",
				memo: text(action.note, 200) || (direction === "out" ? "حوالة صادرة" : "حوالة واردة"),
				source: `network_transfer:${key}`,
				actor: userId,
				lines
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
		const row = (await sql`
      select id, reference, status, gl_entry_id, direction, currency, amount::text, company_share::text, partner_share::text,
        network_id, send_partner_id, recv_partner_id, is_demo, cost_center, note
      from network_transfers where id = ${id}
    `)[0];
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
			cost: String(row.cost_center ?? "")
		}).map((line) => ({
			...line,
			debit: line.credit,
			credit: line.debit
		}));
		const glId = await postGl(sql, {
			key: `void:xfer:${row.reference}`,
			kind: "reversal",
			memo: "عكس حوالة شبكة",
			source: `network_transfer:${row.reference}`,
			actor: userId,
			lines
		});
		await sql`update gl_entries set reverses_id = ${Number(row.gl_entry_id)} where id = ${glId}`;
		await sql`update network_transfers set status = 'void' where id = ${id}`;
		await audit(sql, userId, "void", "network_transfer", String(id), String(row.reference));
		return loadNetworksDesk(userId);
	}
	if (type === "post-movement") {
		if (!ability.money) throw new Error("حركة الرصيد تحتاج صلاحية مالية");
		const kind = text(action.kind, 20);
		if (![
			"opening",
			"deposit",
			"withdrawal"
		].includes(kind)) throw new Error("نوع الحركة غير معروف");
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
		const net = {
			accountCode: `NET:${networkId}:${currency}`,
			accountName: `رصيد لدى ${network.name_ar} ${currency}`,
			kind: "asset",
			currency,
			debit: kind === "withdrawal" ? 0 : amount,
			credit: kind === "withdrawal" ? amount : 0,
			networkId,
			partnerId: null,
			demo,
			costCenter: cost
		};
		const other = kind === "opening" ? {
			accountCode: `OPEN:${currency}`,
			accountName: `أرصدة افتتاحية ${currency}`,
			kind: "equity",
			currency,
			debit: 0,
			credit: amount,
			networkId: null,
			partnerId: null,
			demo,
			costCenter: cost
		} : cash(currency, amount, kind === "withdrawal", demo, cost);
		await postGl(sql, {
			key: `move:${key}`,
			kind,
			memo: text(action.note, 200) || kind,
			source: `movement:${key}`,
			actor: userId,
			lines: [net, other]
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
		const systemAmount = num((await sql`
      select coalesce(sum(partner_share), 0)::text as total
      from network_transfers
      where network_id = ${networkId}
        and currency = ${currency}
        and status = 'posted'
        and created_at::date between ${start}::date and ${end}::date
        and (${partnerId}::int is null or send_partner_id = ${partnerId} or recv_partner_id = ${partnerId})
    `)[0]?.total ?? 0);
		const statementAmount = num(action.statementAmount);
		const difference = round4(statementAmount - systemAmount);
		const code = text(action.code, 40) || `SET-${Date.now()}`;
		const inserted = await sql`
      insert into settlements (
        code, network_id, partner_id, currency, period_start, period_end, system_amount, statement_amount,
        difference, status, note, documents, cost_center, is_demo, created_by
      ) values (
        ${code}, ${networkId}, ${partnerId}, ${currency}, ${start}, ${end}, ${systemAmount}, ${statementAmount},
        ${difference}, 'draft', ${text(action.note, 400)}, ${text(action.documents, 300)}, ${text(action.costCenter, 60)},
        ${network.is_demo}, ${userId}
      ) returning id
    `;
		if (difference !== 0) await sql`
        insert into settlement_diffs (settlement_id, note, amount)
        values (${inserted[0].id}, ${text(action.diffNote, 300) || "فرق بين كشف الشريك ومجموع حصص النظام"}, ${difference})
      `;
		await audit(sql, userId, "create", "settlement", String(inserted[0].id), code);
		return loadNetworksDesk(userId);
	}
	if (type === "approve-settlement") {
		if (!ability.approve) throw new Error("اعتماد التسوية للمدير المالي فقط");
		const id = Number(action.id);
		const row = (await sql`
      select id, code, network_id, partner_id, currency, statement_amount::text, difference::text, status, created_by, is_demo, cost_center
      from settlements where id = ${id}
    `)[0];
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
		const lines = [];
		if (difference !== 0 && partnerId) {
			const ptr = partnerLine(partnerId, currency, demo, cost, difference > 0 ? "credit" : "debit", Math.abs(difference));
			const diff = {
				accountCode: `DIFF:${currency}`,
				accountName: `فروقات تسوية ${currency}`,
				kind: "expense",
				currency,
				debit: difference > 0 ? Math.abs(difference) : 0,
				credit: difference > 0 ? 0 : Math.abs(difference),
				networkId: null,
				partnerId: null,
				demo,
				costCenter: cost
			};
			lines.push(ptr, diff);
		}
		if (lines.length) await postGl(sql, {
			key: `settlement:${row.code}:diff`,
			kind: "difference",
			memo: `فرق تسوية ${row.code}`,
			source: `settlement:${id}`,
			actor: userId,
			lines
		});
		if (statement > 0 && partnerId) await postGl(sql, {
			key: `settlement:${row.code}:pay`,
			kind: "settlement",
			memo: `سداد تسوية ${row.code} لدى ${network.name_ar}`,
			source: `settlement:${id}`,
			actor: userId,
			lines: [partnerLine(partnerId, currency, demo, cost, "debit", statement), cash(currency, statement, false, demo, cost)]
		});
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
		if (![
			"draft",
			"active",
			"expired",
			"terminated"
		].includes(status)) throw new Error("حالة الاتفاقية غير معروفة");
		if ((status === "terminated" || status === "expired") && !ability.approve) throw new Error("إنهاء الاتفاقية يحتاج اعتماداً");
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
			demo
		};
		if (id) await sql`
        update network_agreements set
          code = ${row.code}, network_id = ${row.networkId}, partner_id = ${row.partnerId}, kind = ${row.kind},
          signed_on = ${row.signed}, starts_on = ${row.starts}, ends_on = ${row.ends}, terms = ${row.terms},
          commission_note = ${row.commission}, limits_note = ${row.limits}, obligations = ${row.obligations},
          documents = ${row.documents}, status = ${row.status}, alert_days = ${row.alertDays}, is_demo = ${row.demo}
        where id = ${id}
      `;
		else await sql`
        insert into network_agreements (
          code, network_id, partner_id, kind, signed_on, starts_on, ends_on, terms, commission_note,
          limits_note, obligations, documents, status, alert_days, is_demo
        ) values (
          ${row.code}, ${row.networkId}, ${row.partnerId}, ${row.kind}, ${row.signed}, ${row.starts}, ${row.ends},
          ${row.terms}, ${row.commission}, ${row.limits}, ${row.obligations}, ${row.documents}, ${row.status},
          ${row.alertDays}, ${row.demo}
        )
      `;
		await audit(sql, userId, "save", "network_agreement", code, status);
		return loadNetworksDesk(userId);
	}
	if (type === "save-integration") {
		if (!ability.write) throw new Error("ليست لديك صلاحية الربط");
		const networkId = Number(action.networkId);
		await networkRow(sql, networkId);
		const mode = text(action.mode, 20);
		if (![
			"rest",
			"webhook",
			"file",
			"direct",
			"manual"
		].includes(mode)) throw new Error("وسيلة الربط غير معروفة");
		const secret = text(action.secret, 400);
		if (secret && !ability.secrets) throw new Error("حفظ مفتاح الربط لمدير النظام فقط");
		const hint = secret ? `••••${secret.slice(-4)}` : null;
		const enc = secret ? encryptSecret(secret) : null;
		if ((await sql`select id from network_integrations where network_id = ${networkId}`)[0]) await sql`
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
		else await sql`
        insert into network_integrations (network_id, provider, mode, api_base, sandbox_base, secret_enc, secret_hint, status, last_error)
        values (
          ${networkId}, ${text(action.provider, 120)}, ${mode}, ${httpUrl(action.apiBase)}, ${httpUrl(action.sandboxBase)},
          ${enc ?? ""}, ${hint ?? ""}, ${mode === "manual" ? "manual" : "untested"}, ${text(action.errorNote, 300)}
        )
      `;
		const again = await sql`select id from network_integrations where network_id = ${networkId}`;
		if (text(action.log, 300)) await sql`insert into integration_logs (integration_id, message) values (${again[0].id}, ${text(action.log, 300)})`;
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
function partnerLine(partnerId, currency, demo, cost, side, amount) {
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
		costCenter: cost
	};
}
function transferLines(input) {
	const { currency, amount, company, partnerShare, networkId, networkName, partnerId, demo, cost, direction } = input;
	const fee = round4(company + partnerShare);
	const lines = [{
		accountCode: `NET:${networkId}:${currency}`,
		accountName: `رصيد لدى ${networkName} ${currency}`,
		kind: "asset",
		currency,
		debit: direction === "in" ? amount : 0,
		credit: direction === "out" ? amount : 0,
		networkId,
		partnerId: null,
		demo,
		costCenter: cost
	}, cash(currency, amount, direction === "out", demo, cost)];
	if (fee > 0) {
		lines.push(cash(currency, fee, true, demo, cost));
		if (company > 0) lines.push({
			accountCode: `COM:${currency}`,
			accountName: `عمولات مكتسبة ${currency}`,
			kind: "income",
			currency,
			debit: 0,
			credit: company,
			networkId: null,
			partnerId: null,
			demo,
			costCenter: cost
		});
		if (partnerShare > 0 && partnerId) lines.push(partnerLine(partnerId, currency, demo, cost, "credit", partnerShare));
		else if (partnerShare > 0) lines.push({
			accountCode: `COM:${currency}`,
			accountName: `عمولات مكتسبة ${currency}`,
			kind: "income",
			currency,
			debit: 0,
			credit: partnerShare,
			networkId: null,
			partnerId: null,
			demo,
			costCenter: cost
		});
	}
	return lines;
}
async function planById(sql, id) {
	const row = (await sql`
    select id, kind, min_amount::text, max_amount::text, percent::text, fixed_amount::text, company_share::text, active
    from commission_plans where id = ${id}
  `)[0];
	if (!row || !row.active) return null;
	return toPlan(row, await sql`
    select min_amount::text, max_amount::text, percent::text, fixed_amount::text
    from commission_tiers where plan_id = ${id} order by min_amount
  `);
}
async function matchPlan(sql, input) {
	const ranked = (await sql`
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
  `).map((row) => ({
		row,
		score: (row.partner_id ? 4 : 0) + (String(row.currency) ? 2 : 0) + (String(row.country) ? 1 : 0)
	})).sort((a, b) => b.score - a.score);
	if (!ranked[0]) return null;
	const tiers = await sql`
    select min_amount::text, max_amount::text, percent::text, fixed_amount::text
    from commission_tiers where plan_id = ${Number(ranked[0].row.id)} order by min_amount
  `;
	return toPlan(ranked[0].row, tiers);
}
function toPlan(row, tiers) {
	return {
		id: Number(row.id),
		kind: String(row.kind),
		minAmount: num(row.min_amount),
		maxAmount: row.max_amount == null ? null : num(row.max_amount),
		percent: num(row.percent),
		fixed: num(row.fixed_amount),
		companyShare: num(row.company_share),
		tiers: tiers.map((tier) => ({
			minAmount: num(tier.min_amount),
			maxAmount: tier.max_amount == null ? null : num(tier.max_amount),
			percent: num(tier.percent),
			fixed: num(tier.fixed_amount)
		}))
	};
}
var getPublicHome_createServerFn_handler = createServerRpc({
	id: "40fa572d44a2a8f70ad948874b4dcc75f218ae5b7da9cab2b40f25d209a1faec",
	name: "getPublicHome",
	filename: "src/lib/server/fns.ts"
}, (opts) => getPublicHome.__executeServer(opts));
var getPublicHome = createServerFn({ method: "GET" }).handler(getPublicHome_createServerFn_handler, async () => loadPublicHome());
var getPublication_createServerFn_handler = createServerRpc({
	id: "ca8fd8c939ee2a57ef8851785758d8a8e3dcea4bc497ba6b431b711279ed039f",
	name: "getPublication",
	filename: "src/lib/server/fns.ts"
}, (opts) => getPublication.__executeServer(opts));
var getPublication = createServerFn({ method: "GET" }).handler(getPublication_createServerFn_handler, async () => loadPublication());
var getPublicBranch_createServerFn_handler = createServerRpc({
	id: "5ee25229d8e0ff618d71e680d5ab00842113ef2b63f20c77fa83909673fab111",
	name: "getPublicBranch",
	filename: "src/lib/server/fns.ts"
}, (opts) => getPublicBranch.__executeServer(opts));
var getPublicBranch = createServerFn({ method: "GET" }).validator((slug) => slug).handler(getPublicBranch_createServerFn_handler, async ({ data }) => loadPublicBranch(data));
var getRateHistory_createServerFn_handler = createServerRpc({
	id: "e012264b69ed67796cf1f28a1c941b0e9b2b1487f46f8ad4c480dff92219247f",
	name: "getRateHistory",
	filename: "src/lib/server/fns.ts"
}, (opts) => getRateHistory.__executeServer(opts));
var getRateHistory = createServerFn({ method: "GET" }).handler(getRateHistory_createServerFn_handler, async () => loadPublicRateHistory());
var submitServiceRequest_createServerFn_handler = createServerRpc({
	id: "e81882570d4dd6fa883eaf8715a7e17ca529322395b21c0f46300df61c1cc8d1",
	name: "submitServiceRequest",
	filename: "src/lib/server/fns.ts"
}, (opts) => submitServiceRequest.__executeServer(opts));
var submitServiceRequest = createServerFn({ method: "POST" }).validator((input) => input).handler(submitServiceRequest_createServerFn_handler, async ({ data }) => createServiceRequest(data));
var adminServiceRequests_createServerFn_handler = createServerRpc({
	id: "d13ab22b1ff742f21f7e2d41cf61b408866235c2210ef602e3de64eac5ece4c6",
	name: "adminServiceRequests",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminServiceRequests.__executeServer(opts));
var adminServiceRequests = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminServiceRequests_createServerFn_handler, async ({ context }) => listServiceRequests(context.userId));
var getServicePage_createServerFn_handler = createServerRpc({
	id: "98bf39d3f367fb2d8493b1965b0759b003d72320d351534ff565c9c3ff86d70b",
	name: "getServicePage",
	filename: "src/lib/server/fns.ts"
}, (opts) => getServicePage.__executeServer(opts));
var getServicePage = createServerFn({ method: "GET" }).validator((slug) => slug).handler(getServicePage_createServerFn_handler, async ({ data }) => loadService(data));
var getNewsPage_createServerFn_handler = createServerRpc({
	id: "9639ea26498d7223c32a72d9d3952ad8adf2e1b0c0fee5403e5f073532121a62",
	name: "getNewsPage",
	filename: "src/lib/server/fns.ts"
}, (opts) => getNewsPage.__executeServer(opts));
var getNewsPage = createServerFn({ method: "GET" }).validator((slug) => slug).handler(getNewsPage_createServerFn_handler, async ({ data }) => loadNewsItem(data));
var submitInquiry_createServerFn_handler = createServerRpc({
	id: "35e4c75fd143b21bf7673774d79548bfa05a450a42294aa57008ba5ed46c810f",
	name: "submitInquiry",
	filename: "src/lib/server/fns.ts"
}, (opts) => submitInquiry.__executeServer(opts));
var submitInquiry = createServerFn({ method: "POST" }).validator((input) => input).handler(submitInquiry_createServerFn_handler, async ({ data }) => createInquiry(data));
var lookupTransfer_createServerFn_handler = createServerRpc({
	id: "78de32b258509af910c9ceba05f1900cd8b473613c77af711d161207c9852f52",
	name: "lookupTransfer",
	filename: "src/lib/server/fns.ts"
}, (opts) => lookupTransfer.__executeServer(opts));
var lookupTransfer = createServerFn({ method: "POST" }).validator((input) => input).handler(lookupTransfer_createServerFn_handler, async ({ data }) => trackTransfer(data.reference, data.pin));
var syncProfile_createServerFn_handler = createServerRpc({
	id: "15785e8c6c9f6dea5c093c316e5b1e8f910737055ac00864c585f48dfe9f4825",
	name: "syncProfile",
	filename: "src/lib/server/fns.ts"
}, (opts) => syncProfile.__executeServer(opts));
var syncProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ name: input?.name ?? "" })).handler(syncProfile_createServerFn_handler, async ({ context, data }) => ensureProfile(context.userId, data.name));
var saveProfile_createServerFn_handler = createServerRpc({
	id: "a7feaee2ac92df3f3e99df1620d7f6b39af48d7cf1c2ed9880f59233c4e00499",
	name: "saveProfile",
	filename: "src/lib/server/fns.ts"
}, (opts) => saveProfile.__executeServer(opts));
var saveProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveProfile_createServerFn_handler, async ({ context, data }) => updateOwnProfile(context.userId, data.displayName, data.phone));
var myTransfers_createServerFn_handler = createServerRpc({
	id: "6c8af2e3b89bcac30a731eedaf6268728b0a853d2630c5782b0535946a737220",
	name: "myTransfers",
	filename: "src/lib/server/fns.ts"
}, (opts) => myTransfers.__executeServer(opts));
var myTransfers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(myTransfers_createServerFn_handler, async ({ context }) => listOwnedTransfers(context.userId));
var attachTransfer_createServerFn_handler = createServerRpc({
	id: "8b5a57962ee204591148ab4fcdb94f6b11acd4a57ab8eb8a876a925f365ded37",
	name: "attachTransfer",
	filename: "src/lib/server/fns.ts"
}, (opts) => attachTransfer.__executeServer(opts));
var attachTransfer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(attachTransfer_createServerFn_handler, async ({ context, data }) => linkTransfer(context.userId, data.reference, data.pin));
var myNotices_createServerFn_handler = createServerRpc({
	id: "5e15b74ba0ea25f89fd433c6f2d0a74aca828534407f783e04238ed4aa6a8d84",
	name: "myNotices",
	filename: "src/lib/server/fns.ts"
}, (opts) => myNotices.__executeServer(opts));
var myNotices = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(myNotices_createServerFn_handler, async ({ context }) => listNotices(context.userId));
var readNotice_createServerFn_handler = createServerRpc({
	id: "cbf43bef8dd7dbae0d6c24cd7267a7f1d005f27a87447bb13647a134e7844049",
	name: "readNotice",
	filename: "src/lib/server/fns.ts"
}, (opts) => readNotice.__executeServer(opts));
var readNotice = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(readNotice_createServerFn_handler, async ({ context, data }) => markNoticeRead(context.userId, data));
var myTickets_createServerFn_handler = createServerRpc({
	id: "35ba6ecf911e4a120ae1b6ea7ff663d24f42d06cf48bc2bf398b7277fa0a545e",
	name: "myTickets",
	filename: "src/lib/server/fns.ts"
}, (opts) => myTickets.__executeServer(opts));
var myTickets = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(myTickets_createServerFn_handler, async ({ context }) => listOwnTickets(context.userId));
var createTicket_createServerFn_handler = createServerRpc({
	id: "0d487811f20eee8bad61b9b7f1b53ebbf55319457e03890206efd6b74cbc0549",
	name: "createTicket",
	filename: "src/lib/server/fns.ts"
}, (opts) => createTicket.__executeServer(opts));
var createTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createTicket_createServerFn_handler, async ({ context, data }) => openTicket(context.userId, data.subject, data.body, data.key));
var getAdminOverview_createServerFn_handler = createServerRpc({
	id: "4d1d13c37cd80d0e64663c265a0b4b424ef9e556b3eaf543118d4e8c24bf21bf",
	name: "getAdminOverview",
	filename: "src/lib/server/fns.ts"
}, (opts) => getAdminOverview.__executeServer(opts));
var getAdminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminOverview_createServerFn_handler, async ({ context }) => adminOverview(context.userId));
var bootstrapAdmin_createServerFn_handler = createServerRpc({
	id: "0405473e8410adda3dd388c9aa519db26908dace3b270b6ba4e0a4d6e3b7aeb5",
	name: "bootstrapAdmin",
	filename: "src/lib/server/fns.ts"
}, (opts) => bootstrapAdmin.__executeServer(opts));
var bootstrapAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(bootstrapAdmin_createServerFn_handler, async ({ context }) => claimAdmin(context.userId));
var adminRates_createServerFn_handler = createServerRpc({
	id: "ea99d0ceee80bac16b537ae685b2d892ea2dd2de2c6fa9dbbafee0d7218a6152",
	name: "adminRates",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminRates.__executeServer(opts));
var adminRates = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminRates_createServerFn_handler, async ({ context }) => listRatesAdmin(context.userId));
var adminUpdateRate_createServerFn_handler = createServerRpc({
	id: "bbba95455b5886fee22c984d089346779e594c838512db8a1d174bcb0e959278",
	name: "adminUpdateRate",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminUpdateRate.__executeServer(opts));
var adminUpdateRate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminUpdateRate_createServerFn_handler, async ({ context, data }) => {
	await saveRate(context.userId, data);
	return listRatesAdmin(context.userId);
});
var adminAddRate_createServerFn_handler = createServerRpc({
	id: "801996120c4c139565b2b6c20624f10f6a9492140342e64a155ffd2e06e79646",
	name: "adminAddRate",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminAddRate.__executeServer(opts));
var adminAddRate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminAddRate_createServerFn_handler, async ({ context, data }) => {
	await addRate(context.userId, data);
	return listRatesAdmin(context.userId);
});
var adminBranches_createServerFn_handler = createServerRpc({
	id: "849823c883f6639f669876eb1c13f532a4b3a4c63f4f0114e7e8ec30c0761906",
	name: "adminBranches",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminBranches.__executeServer(opts));
var adminBranches = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminBranches_createServerFn_handler, async ({ context }) => listAllBranches(context.userId));
var adminSaveBranch_createServerFn_handler = createServerRpc({
	id: "e3903557ce5e5212fdd370eb1cbcb82ecf2a50cf5aecf4c7b74dedf59d7506b9",
	name: "adminSaveBranch",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminSaveBranch.__executeServer(opts));
var adminSaveBranch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSaveBranch_createServerFn_handler, async ({ context, data }) => {
	await saveBranch(context.userId, data);
	return listAllBranches(context.userId);
});
var adminNews_createServerFn_handler = createServerRpc({
	id: "f3b6d07b28eda793820552f8bd91472a1e87b99539ee7963ea82b2fb09f1a877",
	name: "adminNews",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminNews.__executeServer(opts));
var adminNews = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminNews_createServerFn_handler, async ({ context }) => listAllNews(context.userId));
var adminSaveNews_createServerFn_handler = createServerRpc({
	id: "e9f078da31329e1d46ada5f3acd5d187a5383177abd51704c30df55d3f62fd69",
	name: "adminSaveNews",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminSaveNews.__executeServer(opts));
var adminSaveNews = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSaveNews_createServerFn_handler, async ({ context, data }) => {
	await saveNews(context.userId, data);
	return listAllNews(context.userId);
});
var adminInquiries_createServerFn_handler = createServerRpc({
	id: "3b129a928544a01764af61884f2da661624b2633b1c9bb7af831a0bc889d28a4",
	name: "adminInquiries",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminInquiries.__executeServer(opts));
var adminInquiries = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminInquiries_createServerFn_handler, async ({ context }) => listInquiries(context.userId));
var adminInquiryStatus_createServerFn_handler = createServerRpc({
	id: "fd753d8e2eea0d98872317b06fe93f53fa85e4ef2dfee09ad1ee3d17ad6c440b",
	name: "adminInquiryStatus",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminInquiryStatus.__executeServer(opts));
var adminInquiryStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminInquiryStatus_createServerFn_handler, async ({ context, data }) => {
	await setInquiryStatus(context.userId, data.id, data.status);
	return listInquiries(context.userId);
});
var adminTickets_createServerFn_handler = createServerRpc({
	id: "b461e6a9cc2a00fa0d4e99f159099ffcc5d023bb197d2764d8f6aac2567f80a6",
	name: "adminTickets",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminTickets.__executeServer(opts));
var adminTickets = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminTickets_createServerFn_handler, async ({ context }) => listAllTickets(context.userId));
var adminReplyTicket_createServerFn_handler = createServerRpc({
	id: "64d9ab4730316c8054a4e5fded4028ad425c0a81358f7d348e80c606c4007ab9",
	name: "adminReplyTicket",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminReplyTicket.__executeServer(opts));
var adminReplyTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminReplyTicket_createServerFn_handler, async ({ context, data }) => {
	await replyTicket(context.userId, data.id, data.reply, data.status);
	return listAllTickets(context.userId);
});
var adminStaff_createServerFn_handler = createServerRpc({
	id: "9ee4a6cb829bd71e5cadcefcedb2292bafdefba319b8669da22b5129a39712ad",
	name: "adminStaff",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminStaff.__executeServer(opts));
var adminStaff = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminStaff_createServerFn_handler, async ({ context }) => listStaff(context.userId));
var adminSetRole_createServerFn_handler = createServerRpc({
	id: "e7c337b14a73432d0a589af61658ef1341dddec4673fc24ec3748f4dae648556",
	name: "adminSetRole",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminSetRole.__executeServer(opts));
var adminSetRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSetRole_createServerFn_handler, async ({ context, data }) => {
	await setRole(context.userId, data.userId, data.role);
	return listStaff(context.userId);
});
var adminAudit_createServerFn_handler = createServerRpc({
	id: "cb28e0999f30a9b9e6bed4db0cef361e6c50ee66d241eb6c7253430ca0b3a55d",
	name: "adminAudit",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminAudit.__executeServer(opts));
var adminAudit = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminAudit_createServerFn_handler, async ({ context }) => listAudit(context.userId));
var adminSettings_createServerFn_handler = createServerRpc({
	id: "a0d0de5be17901a6f93f89057ecb4bad7d5a5b8a9759bf6dc41c30346098b960",
	name: "adminSettings",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminSettings.__executeServer(opts));
var adminSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminSettings_createServerFn_handler, async ({ context }) => loadSettingsForAdmin(context.userId));
var adminSaveSettings_createServerFn_handler = createServerRpc({
	id: "0596931ea4bfccf48cb151842efebda0b8fddb86dddd1de657d7f0079d15e6a6",
	name: "adminSaveSettings",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminSaveSettings.__executeServer(opts));
var adminSaveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSaveSettings_createServerFn_handler, async ({ context, data }) => {
	await saveSettings(context.userId, data);
	return loadSettingsForAdmin(context.userId);
});
var adminTransfers_createServerFn_handler = createServerRpc({
	id: "c7c68fd78fe130bdc387be34bba754ebc65b15a1286f82bbf7f7192c121d7d49",
	name: "adminTransfers",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminTransfers.__executeServer(opts));
var adminTransfers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminTransfers_createServerFn_handler, async ({ context }) => listTransfersAdmin(context.userId));
var adminCreateTransfer_createServerFn_handler = createServerRpc({
	id: "c5e06710dc2cd172ce1bca1280341a0eb77f5b2f0e2b1b3c27fd21fab5dac6c7",
	name: "adminCreateTransfer",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminCreateTransfer.__executeServer(opts));
var adminCreateTransfer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminCreateTransfer_createServerFn_handler, async ({ context, data }) => {
	await createTransferAdmin(context.userId, data);
	return listTransfersAdmin(context.userId);
});
var adminTransferStatus_createServerFn_handler = createServerRpc({
	id: "86ad6af00587515d184338ddd02f7f1675e3576d26a78ac4bcf750a39a065692",
	name: "adminTransferStatus",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminTransferStatus.__executeServer(opts));
var adminTransferStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminTransferStatus_createServerFn_handler, async ({ context, data }) => {
	await setTransferStatus(context.userId, data.id, data.status);
	return listTransfersAdmin(context.userId);
});
var adminServices_createServerFn_handler = createServerRpc({
	id: "2e2dcbeed688ff3d04192773f444f5d4215dfeaca38d148c2ad000d276bffa19",
	name: "adminServices",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminServices.__executeServer(opts));
var adminServices = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminServices_createServerFn_handler, async ({ context }) => listServicesAdmin(context.userId));
var adminSaveService_createServerFn_handler = createServerRpc({
	id: "086d4663cfacb61bfa5ec9bc26bff78f92efd1cbfffc9bbfc81c018bd9183c79",
	name: "adminSaveService",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminSaveService.__executeServer(opts));
var adminSaveService = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSaveService_createServerFn_handler, async ({ context, data }) => {
	await saveServiceText(context.userId, data);
	return listServicesAdmin(context.userId);
});
var getManagedPage_createServerFn_handler = createServerRpc({
	id: "5af7e6c79c5d88f590b5742e8adedb00440e52749ec7ab4cc6b3b8ba223c0101",
	name: "getManagedPage",
	filename: "src/lib/server/fns.ts"
}, (opts) => getManagedPage.__executeServer(opts));
var getManagedPage = createServerFn({ method: "GET" }).validator((slug) => slug).handler(getManagedPage_createServerFn_handler, async ({ data }) => loadManagedPage(data));
var getJobs_createServerFn_handler = createServerRpc({
	id: "d5ac613b2e5b479c474fb5f7a509d43985f4a69119ad90b2b28586019812f204",
	name: "getJobs",
	filename: "src/lib/server/fns.ts"
}, (opts) => getJobs.__executeServer(opts));
var getJobs = createServerFn({ method: "GET" }).handler(getJobs_createServerFn_handler, async () => listJobsPublic());
var submitComplaint_createServerFn_handler = createServerRpc({
	id: "3eef528084378310244d780348cf74ae05517ccb773757999d2938016aa61f0a",
	name: "submitComplaint",
	filename: "src/lib/server/fns.ts"
}, (opts) => submitComplaint.__executeServer(opts));
var submitComplaint = createServerFn({ method: "POST" }).validator((input) => input).handler(submitComplaint_createServerFn_handler, async ({ data }) => createComplaint(data));
var lookupComplaint_createServerFn_handler = createServerRpc({
	id: "6cf6f360f61ae877f2e6a33cf1901ff33e3277e1e28b3b3e92bfa5ca1f52aacf",
	name: "lookupComplaint",
	filename: "src/lib/server/fns.ts"
}, (opts) => lookupComplaint.__executeServer(opts));
var lookupComplaint = createServerFn({ method: "POST" }).validator((input) => input).handler(lookupComplaint_createServerFn_handler, async ({ data }) => trackComplaint(data.reference, data.pin));
var submitApplication_createServerFn_handler = createServerRpc({
	id: "869171f4fa5df9da9ef074f3f57918a4c7d5a02b7f220a535a2e7743ae20c8f9",
	name: "submitApplication",
	filename: "src/lib/server/fns.ts"
}, (opts) => submitApplication.__executeServer(opts));
var submitApplication = createServerFn({ method: "POST" }).validator((input) => input).handler(submitApplication_createServerFn_handler, async ({ data }) => applyForJob(data));
var adminPages_createServerFn_handler = createServerRpc({
	id: "0abff4b7bfeb608c23c0dc13fa8c4c889b9a1efbb5367c2950595d73c8b7da33",
	name: "adminPages",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminPages.__executeServer(opts));
var adminPages = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminPages_createServerFn_handler, async ({ context }) => listManagedPages(context.userId));
var adminSavePage_createServerFn_handler = createServerRpc({
	id: "1640e51ea80b25b61d9f4ac9c820397e2929738f45d850423fc97c530aa9522e",
	name: "adminSavePage",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminSavePage.__executeServer(opts));
var adminSavePage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSavePage_createServerFn_handler, async ({ context, data }) => {
	await saveManagedPage(context.userId, data);
	return listManagedPages(context.userId);
});
var adminPartners_createServerFn_handler = createServerRpc({
	id: "2488ed8a8c066f24d93c8c852dcd29bb957ed45d6016c4adabac32b3e2a98650",
	name: "adminPartners",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminPartners.__executeServer(opts));
var adminPartners = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminPartners_createServerFn_handler, async ({ context }) => listPartnersAdmin(context.userId));
var adminSavePartner_createServerFn_handler = createServerRpc({
	id: "d3c30993b62393a141057105fdb971a64d47e8c20d8a71734a1498cb88a58fd8",
	name: "adminSavePartner",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminSavePartner.__executeServer(opts));
var adminSavePartner = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSavePartner_createServerFn_handler, async ({ context, data }) => {
	await savePartner(context.userId, data);
	return listPartnersAdmin(context.userId);
});
var adminComplaints_createServerFn_handler = createServerRpc({
	id: "9869a4f874691d3f689896418e9561084269ce128328482fb5f92c76ccab8c88",
	name: "adminComplaints",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminComplaints.__executeServer(opts));
var adminComplaints = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminComplaints_createServerFn_handler, async ({ context }) => listComplaints(context.userId));
var adminReplyComplaint_createServerFn_handler = createServerRpc({
	id: "f92ed88b1d36822ad4d7bf931318fddc9c0ee7697e4d522a46b191ff929ee1fe",
	name: "adminReplyComplaint",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminReplyComplaint.__executeServer(opts));
var adminReplyComplaint = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminReplyComplaint_createServerFn_handler, async ({ context, data }) => {
	await replyComplaint(context.userId, data.id, data.reply, data.status);
	return listComplaints(context.userId);
});
var adminJobs_createServerFn_handler = createServerRpc({
	id: "5c7d87b0169dc07b19027cbd2b1abf916849d152d48f712840ff2cf310e5730a",
	name: "adminJobs",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminJobs.__executeServer(opts));
var adminJobs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminJobs_createServerFn_handler, async ({ context }) => listJobsAdmin(context.userId));
var adminSaveJob_createServerFn_handler = createServerRpc({
	id: "24ff3b2cc34bf06f776b6062c03478061bb7c58d41cd96f0e3737aefb2961e5a",
	name: "adminSaveJob",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminSaveJob.__executeServer(opts));
var adminSaveJob = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSaveJob_createServerFn_handler, async ({ context, data }) => {
	await saveJob(context.userId, data);
	return listJobsAdmin(context.userId);
});
var adminCustomers_createServerFn_handler = createServerRpc({
	id: "7e2cd5eac52524669e776d0fffd25c6e4f45556b06a21635fd99eb85ead21fba",
	name: "adminCustomers",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminCustomers.__executeServer(opts));
var adminCustomers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminCustomers_createServerFn_handler, async ({ context }) => listCustomers(context.userId));
var adminNetworksDesk_createServerFn_handler = createServerRpc({
	id: "4b06b39b73c061b30f286c52334afd7e89767af522b72f87a4c9b3b24992f529",
	name: "adminNetworksDesk",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminNetworksDesk.__executeServer(opts));
var adminNetworksDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminNetworksDesk_createServerFn_handler, async ({ context }) => loadNetworksDesk(context.userId));
var adminNetworksAct_createServerFn_handler = createServerRpc({
	id: "426f73a72558d38dfdf44e637b47929beecdcdeffe08c3750882835c6530556c",
	name: "adminNetworksAct",
	filename: "src/lib/server/fns.ts"
}, (opts) => adminNetworksAct.__executeServer(opts));
var adminNetworksAct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminNetworksAct_createServerFn_handler, async ({ context, data }) => actNetworks(context.userId, data));
//#endregion
export { adminAddRate_createServerFn_handler, adminAudit_createServerFn_handler, adminBranches_createServerFn_handler, adminComplaints_createServerFn_handler, adminCreateTransfer_createServerFn_handler, adminCustomers_createServerFn_handler, adminInquiries_createServerFn_handler, adminInquiryStatus_createServerFn_handler, adminJobs_createServerFn_handler, adminNetworksAct_createServerFn_handler, adminNetworksDesk_createServerFn_handler, adminNews_createServerFn_handler, adminPages_createServerFn_handler, adminPartners_createServerFn_handler, adminRates_createServerFn_handler, adminReplyComplaint_createServerFn_handler, adminReplyTicket_createServerFn_handler, adminSaveBranch_createServerFn_handler, adminSaveJob_createServerFn_handler, adminSaveNews_createServerFn_handler, adminSavePage_createServerFn_handler, adminSavePartner_createServerFn_handler, adminSaveService_createServerFn_handler, adminSaveSettings_createServerFn_handler, adminServiceRequests_createServerFn_handler, adminServices_createServerFn_handler, adminSetRole_createServerFn_handler, adminSettings_createServerFn_handler, adminStaff_createServerFn_handler, adminTickets_createServerFn_handler, adminTransferStatus_createServerFn_handler, adminTransfers_createServerFn_handler, adminUpdateRate_createServerFn_handler, attachTransfer_createServerFn_handler, bootstrapAdmin_createServerFn_handler, createTicket_createServerFn_handler, getAdminOverview_createServerFn_handler, getJobs_createServerFn_handler, getManagedPage_createServerFn_handler, getNewsPage_createServerFn_handler, getPublicBranch_createServerFn_handler, getPublicHome_createServerFn_handler, getPublication_createServerFn_handler, getRateHistory_createServerFn_handler, getServicePage_createServerFn_handler, lookupComplaint_createServerFn_handler, lookupTransfer_createServerFn_handler, myNotices_createServerFn_handler, myTickets_createServerFn_handler, myTransfers_createServerFn_handler, readNotice_createServerFn_handler, saveProfile_createServerFn_handler, submitApplication_createServerFn_handler, submitComplaint_createServerFn_handler, submitInquiry_createServerFn_handler, submitServiceRequest_createServerFn_handler, syncProfile_createServerFn_handler };
