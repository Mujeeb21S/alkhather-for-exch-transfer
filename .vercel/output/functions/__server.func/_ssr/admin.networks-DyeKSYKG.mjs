import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { ct as useCurrentUserState, h as adminNetworksDesk, lt as useI18n, m as adminNetworksAct, r as RedirectToSignIn } from "./shell-DdDjRdsi.mjs";
import { c as PrimaryButton, i as Field, l as inputClass, r as ErrorNote } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.networks-DyeKSYKG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SECTIONS = [
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
	["reports", "التقارير"]
];
var KINDS = {
	local_ye: "محلية يمنية",
	international: "دولية",
	regional: "إقليمية",
	banking: "مصرفية",
	ewallet: "إلكترونية / محافظ"
};
var PTR = {
	exchange: "شركة صرافة",
	bank_local: "بنك محلي",
	bank_intl: "بنك دولي",
	mto: "شركة تحويل",
	ewallet: "محفظة إلكترونية",
	agent: "وكيل معتمد",
	correspondent: "مراسل مالي",
	intermediary: "مؤسسة وسيطة"
};
var STATUS = {
	active: "نشطة",
	inactive: "غير نشطة",
	pending: "قيد التفعيل",
	suspended: "معلقة مؤقتاً",
	stopped: "متوقفة",
	expired: "منتهية الاتفاقية"
};
var SVC = {
	send: "إرسال حوالة",
	receive: "استلام حوالة",
	account: "تحويل بين الحسابات",
	bank: "تحويل إلى حساب بنكي",
	wallet: "تحويل إلى محفظة",
	international: "تحويل دولي",
	local: "تحويل محلي",
	inquiry: "استعلام عن حوالة",
	cancel: "إلغاء وفق شروط الشبكة",
	refund: "استرداد وفق شروط الشبكة"
};
function s(row, key) {
	return String(row[key] ?? "");
}
function n(row, key) {
	return Number(row[key] ?? 0);
}
function on(row, key) {
	return Boolean(row[key]);
}
function NetworksDesk() {
	const { user, isPending } = useCurrentUserState();
	const { t } = useI18n();
	const [desk, setDesk] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [section, setSection] = (0, import_react.useState)("dash");
	const [includeDemo, setIncludeDemo] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!user?.id) return;
		let gone = false;
		adminNetworksDesk().then((data) => {
			if (!gone) setDesk(data);
		}).catch((err) => {
			if (!gone) setError(err instanceof Error ? err.message : "Error");
		}).finally(() => {
			if (!gone) setLoading(false);
		});
		return () => {
			gone = true;
		};
	}, [user?.id]);
	async function act(action) {
		setError("");
		const next = await adminNetworksAct({ data: action });
		if (next && typeof next === "object" && "networks" in next) setDesk(next);
		return next;
	}
	if (isPending || user && loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-2xl bg-line" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (!desk) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { children: error || t("تعذر فتح الوحدة", "The module could not be opened") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/admin",
			className: "mt-4 inline-flex text-sm text-primary",
			children: "العودة للوحة الإدارة"
		})]
	});
	const live = (row) => includeDemo || !on(row, "is_demo");
	const networks = desk.networks.filter(live);
	const partners = desk.partners.filter(live);
	const transfers = desk.transfers.filter(live);
	const agreements = desk.agreements.filter(live);
	const posted = transfers.filter((row) => s(row, "status") === "posted");
	const expiring = agreements.filter((row) => {
		if (s(row, "status") !== "active" || !s(row, "ends_on")) return false;
		const days = (Date.parse(s(row, "ends_on")) - Date.now()) / 864e5;
		return days >= 0 && days <= n(row, "alert_days");
	});
	const partnerDues = sumSigned(desk.entries, "PTR:", includeDemo, true);
	const floats = sumSigned(desk.entries, "NET:", includeDemo, false);
	const commissions = posted.reduce((sum, row) => sum + Number(s(row, "company_share") || 0), 0);
	const pendingSettlements = desk.settlements.filter((row) => live(row) && s(row, "status") !== "approved").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin",
				className: "text-sm text-primary",
				children: "لوحة الإدارة"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: "شبكات التحويل والشركاء"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-3xl text-sm text-muted",
				children: "السجل التشغيلي للشبكات والشركاء والممرات والعمولات والتسويات. منفصل عن شركاء الصفحة العامة. السجل التجريبي لا يدخل المؤشرات إلا إذا أظهرته. لا تُحذف القيود المالية، ومفتاح الربط لا يُعرض بعد حفظه."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: includeDemo,
					onChange: (event) => setIncludeDemo(event.target.checked)
				}), "إظهار السجلات التجريبية"]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { children: error })
			}) : null,
			desk.vaultDemo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted",
				children: "مفاتيح الربط تُشفَّر بمفتاح تجريبي لأن NETWORK_VAULT_KEY غير مضبوط. لا يُستخدم هذا المفتاح في الإنتاج."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex gap-2 overflow-x-auto pb-2",
				children: SECTIONS.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setSection(id),
					className: `min-h-11 shrink-0 rounded-full px-4 text-sm ${section === id ? "bg-primary text-surface" : "border border-line bg-surface"}`,
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [
					section === "dash" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {
						tiles: [
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
							["اتفاقيات قاربت على الانتهاء", expiring.length]
						],
						byKind: countBy(networks, (row) => KINDS[s(row, "kind")] || s(row, "kind")),
						byCountry: countBy(partners, (row) => s(row, "country") || "غير محددة"),
						byNetwork: volumeBy(posted, networks),
						months: monthBars(posted),
						expiring
					}) : null,
					section === "networks" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetworkForm, {
						desk,
						rows: desk.networks,
						act,
						error: setError
					}) : null,
					section === "partners" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerForm, {
						rows: desk.partners,
						act,
						error: setError
					}) : null,
					section === "links" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkForm, {
						desk,
						act,
						error: setError
					}) : null,
					section === "corridors" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CorridorForm, {
						desk,
						act,
						error: setError
					}) : null,
					section === "fees" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeeForm, {
						desk,
						act,
						error: setError
					}) : null,
					section === "balances" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceDesk, {
						desk,
						includeDemo,
						act,
						error: setError
					}) : null,
					section === "agreements" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgreementForm, {
						desk,
						expiring,
						act,
						error: setError
					}) : null,
					section === "tech" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechForm, {
						desk,
						act,
						error: setError
					}) : null,
					section === "services" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceMatrix, {
						desk,
						act,
						error: setError
					}) : null,
					section === "reports" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reports, {
						desk,
						includeDemo
					}) : null
				]
			})
		]
	});
}
function sumSigned(entries, prefix, includeDemo, creditNormal) {
	return entries.reduce((sum, row) => {
		if (!s(row, "account_code").startsWith(prefix)) return sum;
		if (!includeDemo && on(row, "is_demo")) return sum;
		const debit = Number(s(row, "debit") || 0);
		const credit = Number(s(row, "credit") || 0);
		return sum + (creditNormal ? credit - debit : debit - credit);
	}, 0);
}
function countBy(rows, label) {
	const map = /* @__PURE__ */ new Map();
	for (const row of rows) map.set(label(row), (map.get(label(row)) ?? 0) + 1);
	return [...map.entries()].map(([name, value]) => ({
		name,
		value
	}));
}
function volumeBy(transfers, networks) {
	const names = new Map(networks.map((row) => [n(row, "id"), s(row, "name_ar")]));
	const map = /* @__PURE__ */ new Map();
	for (const row of transfers) {
		const name = names.get(n(row, "network_id")) || "شبكة";
		map.set(name, (map.get(name) ?? 0) + Number(s(row, "amount") || 0));
	}
	return [...map.entries()].map(([name, value]) => ({
		name,
		value
	}));
}
function monthBars(transfers) {
	const map = /* @__PURE__ */ new Map();
	for (const row of transfers) {
		const month = s(row, "created_at").slice(0, 7) || "—";
		const bag = map.get(month) ?? {
			out: 0,
			in: 0
		};
		const amount = Number(s(row, "amount") || 0);
		if (s(row, "direction") === "in") bag.in += amount;
		else bag.out += amount;
		map.set(month, bag);
	}
	return [...map.entries()].map(([name, value]) => ({
		name,
		value: value.out + value.in,
		hint: `صادر ${value.out.toFixed(0)} / وارد ${value.in.toFixed(0)}`
	}));
}
function Dashboard({ tiles, byKind, byCountry, byNetwork, months, expiring }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: tiles.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-line bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-3xl tabular-nums",
						children: value
					})]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "توزيع الشبكات حسب النوع",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, { items: byKind })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "توزيع الشركاء حسب الدولة",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, { items: byCountry })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "حجم التحويلات حسب الشبكة",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, { items: byNetwork })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "الصادر والوارد عبر الزمن",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, { items: months })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "اتفاقيات قاربت على الانتهاء",
				children: expiring.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "لا اتفاقية تشغيلية تنتهي خلال مهلة التنبيه."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2 text-sm",
					children: expiring.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						s(row, "code"),
						" — حتى ",
						s(row, "ends_on")
					] }, s(row, "id")))
				})
			})
		]
	});
}
function Bars({ items }) {
	const max = Math.max(1, ...items.map((item) => item.value));
	if (!items.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "لا بيانات ضمن هذا المرشح."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between gap-3 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums text-muted",
				children: item.hint || item.value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 h-2 rounded-full bg-paper",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 rounded-full bg-primary",
				style: { width: `${Math.max(4, item.value / max * 100)}%` }
			})
		})] }, item.name))
	});
}
function Panel({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-line bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children
		})]
	});
}
function useForm(initial) {
	const [form, setForm] = (0, import_react.useState)(initial);
	function set(key, value) {
		setForm((prev) => ({
			...prev,
			[key]: value
		}));
	}
	return {
		form,
		set,
		reset: setForm
	};
}
function NetworkForm({ rows, act, error }) {
	const blank = {
		id: "",
		code: "",
		nameAr: "",
		nameEn: "",
		logoUrl: "",
		kind: "local_ye",
		country: "",
		ownerName: "",
		operatorName: "",
		website: "",
		phone: "",
		email: "",
		address: "",
		coverage: "",
		currencies: "",
		transferTypes: "",
		feeNote: "",
		commissionNote: "",
		startedOn: "",
		agreementEndsOn: "",
		status: "pending",
		notes: "",
		demo: ""
	};
	const { form, set, reset } = useForm(blank);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: form.id ? `تعديل شبكة ${form.code}` : "شبكة جديدة",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الرقم التعريفي",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.code,
							onChange: (e) => set("code", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الاسم بالعربية",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.nameAr,
							onChange: (e) => set("nameAr", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الاسم بالإنجليزية",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.nameEn,
							onChange: (e) => set("nameEn", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "رابط الشعار",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.logoUrl,
							onChange: (e) => set("logoUrl", e.target.value),
							placeholder: "https://"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "النوع",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: form.kind,
							onChange: (value) => set("kind", value),
							options: KINDS
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الحالة",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: form.status,
							onChange: (value) => set("status", value),
							options: STATUS
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الدولة الرئيسية",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.country,
							onChange: (e) => set("country", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الشركة المالكة",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.ownerName,
							onChange: (e) => set("ownerName", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الشركة المشغلة",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.operatorName,
							onChange: (e) => set("operatorName", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الموقع",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.website,
							onChange: (e) => set("website", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الهاتف",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.phone,
							onChange: (e) => set("phone", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "البريد",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.email,
							onChange: (e) => set("email", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "العنوان",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.address,
							onChange: (e) => set("address", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "دول التغطية",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.coverage,
							onChange: (e) => set("coverage", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "العملات",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.currencies,
							onChange: (e) => set("currencies", e.target.value),
							placeholder: "YER,SAR"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "أنواع الحوالات",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.transferTypes,
							onChange: (e) => set("transferTypes", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "رسوم التحويل",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.feeNote,
							onChange: (e) => set("feeNote", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "نظام العمولة",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.commissionNote,
							onChange: (e) => set("commissionNote", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "بدء التعامل",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							type: "date",
							value: form.startedOn,
							onChange: (e) => set("startedOn", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "انتهاء الاتفاقية",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							type: "date",
							value: form.agreementEndsOn,
							onChange: (e) => set("agreementEndsOn", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "ملاحظات",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.notes,
							onChange: (e) => set("notes", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.demo === "1",
							onChange: (e) => set("demo", e.target.checked ? "1" : "")
						}), " سجل تجريبي"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
					onClick: () => act({
						type: "save-network",
						...form,
						id: Number(form.id || 0),
						demo: form.demo === "1"
					}).catch((err) => error(err instanceof Error ? err.message : "Error")),
					children: "حفظ"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 rounded-full border border-line px-4 text-sm",
					onClick: () => reset(blank),
					children: "جديد"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
			columns: [
				"الرمز",
				"الاسم",
				"النوع",
				"الحالة",
				"الدولة"
			],
			rows: rows.map((row) => [
				s(row, "code"),
				s(row, "name_ar"),
				KINDS[s(row, "kind")] || "",
				STATUS[s(row, "status")] || "",
				s(row, "country") + (on(row, "is_demo") ? " · تجريبي" : "")
			]),
			onPick: (index) => {
				const row = rows[index];
				reset({
					id: s(row, "id"),
					code: s(row, "code"),
					nameAr: s(row, "name_ar"),
					nameEn: s(row, "name_en"),
					logoUrl: s(row, "logo_url"),
					kind: s(row, "kind"),
					country: s(row, "country"),
					ownerName: s(row, "owner_name"),
					operatorName: s(row, "operator_name"),
					website: s(row, "website"),
					phone: s(row, "phone"),
					email: s(row, "email"),
					address: s(row, "address"),
					coverage: s(row, "coverage"),
					currencies: s(row, "currencies"),
					transferTypes: s(row, "transfer_types"),
					feeNote: s(row, "fee_note"),
					commissionNote: s(row, "commission_note"),
					startedOn: s(row, "started_on").slice(0, 10),
					agreementEndsOn: s(row, "agreement_ends_on").slice(0, 10),
					status: s(row, "status"),
					notes: s(row, "notes"),
					demo: on(row, "is_demo") ? "1" : ""
				});
			}
		})]
	});
}
function PartnerForm({ rows, act, error }) {
	const { form, set, reset } = useForm({
		id: "",
		code: "",
		tradeName: "",
		legalName: "",
		logoUrl: "",
		kind: "exchange",
		country: "",
		city: "",
		address: "",
		phones: "",
		email: "",
		website: "",
		contactName: "",
		contactInfo: "",
		licenseNo: "",
		regulator: "",
		relationStartedOn: "",
		agreementOn: "",
		agreementEndsOn: "",
		status: "pending",
		documents: "",
		notes: "",
		demo: ""
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: form.id ? `ملف ${form.tradeName}` : "شريك جديد",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "رقم الشريك",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.code,
							onChange: (e) => set("code", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الاسم التجاري",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.tradeName,
							onChange: (e) => set("tradeName", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الاسم القانوني",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.legalName,
							onChange: (e) => set("legalName", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الشعار",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.logoUrl,
							onChange: (e) => set("logoUrl", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "النوع",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: form.kind,
							onChange: (value) => set("kind", value),
							options: PTR
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الحالة",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: form.status,
							onChange: (value) => set("status", value),
							options: STATUS
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الدولة",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.country,
							onChange: (e) => set("country", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "المدينة",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.city,
							onChange: (e) => set("city", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "العنوان",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.address,
							onChange: (e) => set("address", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الهواتف",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.phones,
							onChange: (e) => set("phones", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "البريد",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.email,
							onChange: (e) => set("email", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الموقع",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.website,
							onChange: (e) => set("website", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "المسؤول",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.contactName,
							onChange: (e) => set("contactName", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "بيانات التواصل",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.contactInfo,
							onChange: (e) => set("contactInfo", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "رقم الترخيص",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.licenseNo,
							onChange: (e) => set("licenseNo", e.target.value),
							placeholder: "إن وُجد"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "الجهة الرقابية",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.regulator,
							onChange: (e) => set("regulator", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "بدء العلاقة",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							type: "date",
							value: form.relationStartedOn,
							onChange: (e) => set("relationStartedOn", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "تاريخ الاتفاقية",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							type: "date",
							value: form.agreementOn,
							onChange: (e) => set("agreementOn", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "انتهاء الاتفاقية",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							type: "date",
							value: form.agreementEndsOn,
							onChange: (e) => set("agreementEndsOn", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "مستندات (روابط)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.documents,
							onChange: (e) => set("documents", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "ملاحظات",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.notes,
							onChange: (e) => set("notes", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.demo === "1",
							onChange: (e) => set("demo", e.target.checked ? "1" : "")
						}), " تجريبي"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
					onClick: () => act({
						type: "save-partner",
						...form,
						id: Number(form.id || 0),
						demo: form.demo === "1"
					}).catch((err) => error(err instanceof Error ? err.message : "Error")),
					children: "حفظ الشريك"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
			columns: [
				"الرقم",
				"الاسم",
				"النوع",
				"الدولة",
				"الحالة"
			],
			rows: rows.map((row) => [
				s(row, "code"),
				s(row, "trade_name"),
				PTR[s(row, "kind")] || "",
				s(row, "country"),
				STATUS[s(row, "status")] || ""
			]),
			onPick: (index) => {
				const row = rows[index];
				reset({
					id: s(row, "id"),
					code: s(row, "code"),
					tradeName: s(row, "trade_name"),
					legalName: s(row, "legal_name"),
					logoUrl: s(row, "logo_url"),
					kind: s(row, "kind"),
					country: s(row, "country"),
					city: s(row, "city"),
					address: s(row, "address"),
					phones: s(row, "phones"),
					email: s(row, "email"),
					website: s(row, "website"),
					contactName: s(row, "contact_name"),
					contactInfo: s(row, "contact_info"),
					licenseNo: s(row, "license_no"),
					regulator: s(row, "regulator"),
					relationStartedOn: s(row, "relation_started_on").slice(0, 10),
					agreementOn: s(row, "agreement_on").slice(0, 10),
					agreementEndsOn: s(row, "agreement_ends_on").slice(0, 10),
					status: s(row, "status"),
					documents: s(row, "documents"),
					notes: s(row, "notes"),
					demo: on(row, "is_demo") ? "1" : ""
				});
			}
		})]
	});
}
function nameOf(rows, id, key = "name_ar") {
	return s(rows.find((row) => s(row, "id") === id) || {}, key);
}
function LinkForm({ desk, act, error }) {
	const networks = desk.networks;
	const partners = desk.partners;
	const links = desk.links;
	const { form, set, reset } = useForm({
		id: "",
		networkId: "",
		partnerId: "",
		services: "send,receive",
		currencies: "",
		minAmount: "",
		maxAmount: "",
		agreementRef: "",
		status: "active",
		notes: "",
		branchIds: ""
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: "ربط شبكة بشريك",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm text-muted",
					children: "شبكة واحدة تتصل بعدة شركاء، والشريك بعدة شبكات وفروع. كل علاقة تحتفظ بخدماتها وعملاتها وحدودها."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الشبكة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitySelect, {
								rows: networks,
								labelKey: "name_ar",
								value: form.networkId,
								onChange: (value) => set("networkId", value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الشريك",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitySelect, {
								rows: partners,
								labelKey: "trade_name",
								value: form.partnerId,
								onChange: (value) => set("partnerId", value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الخدمات",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.services,
								onChange: (e) => set("services", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "العملات",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.currencies,
								onChange: (e) => set("currencies", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الحد الأدنى",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.minAmount,
								onChange: (e) => set("minAmount", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الحد الأعلى",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.maxAmount,
								onChange: (e) => set("maxAmount", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "مرجع الاتفاقية",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.agreementRef,
								onChange: (e) => set("agreementRef", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الفروع (أرقام مفصولة)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.branchIds,
								onChange: (e) => set("branchIds", e.target.value),
								placeholder: desk.branches.map((row) => `${s(row, "id")} ${s(row, "name_ar")}`).join(" · ")
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الحالة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: form.status,
								onChange: (value) => set("status", value),
								options: {
									active: "نشطة",
									inactive: "غير نشطة",
									pending: "قيد التفعيل",
									suspended: "معلقة"
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "ملاحظات",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.notes,
								onChange: (e) => set("notes", e.target.value)
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						onClick: () => act({
							type: "save-link",
							...form,
							id: Number(form.id || 0)
						}).catch((err) => error(err instanceof Error ? err.message : "Error")),
						children: "حفظ العلاقة"
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
			columns: [
				"الشبكة",
				"الشريك",
				"الخدمات",
				"الفروع",
				"الحالة"
			],
			rows: links.map((row) => [
				nameOf(networks, s(row, "network_id")),
				nameOf(partners, s(row, "partner_id"), "trade_name"),
				s(row, "services"),
				s(row, "branch_ids"),
				s(row, "status")
			]),
			onPick: (index) => {
				const row = links[index];
				reset({
					id: s(row, "id"),
					networkId: s(row, "network_id"),
					partnerId: s(row, "partner_id"),
					services: s(row, "services"),
					currencies: s(row, "currencies"),
					minAmount: s(row, "min_amount"),
					maxAmount: s(row, "max_amount"),
					agreementRef: s(row, "agreement_ref"),
					status: s(row, "status"),
					notes: s(row, "notes"),
					branchIds: s(row, "branch_ids")
				});
			}
		})]
	});
}
function CorridorForm({ desk, act, error }) {
	const networks = desk.networks;
	const partners = desk.partners;
	const rows = desk.corridors;
	const { form, set, reset } = useForm({
		id: "",
		sendCountry: "",
		recvCountry: "",
		networkId: "",
		sendPartnerId: "",
		recvPartnerId: "",
		currencies: "",
		minAmount: "",
		maxAmount: "",
		feeNote: "",
		etaNote: "",
		status: "inactive",
		demo: ""
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: "ممر تحويل",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm text-muted",
					children: "مثال الشكل: السعودية ← اليمن. لا يُفعَّل الممر إلا بعد ربطه بشبكة وشريك تعتمدهما الشركة. زمن التنفيذ يُكتب كما هو متفق، ولا يُفترض رقم."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "دولة الإرسال",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.sendCountry,
								onChange: (e) => set("sendCountry", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "دولة الاستلام",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.recvCountry,
								onChange: (e) => set("recvCountry", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الشبكة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitySelect, {
								rows: networks,
								labelKey: "name_ar",
								value: form.networkId,
								onChange: (value) => set("networkId", value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الشريك المرسل",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitySelect, {
								rows: partners,
								labelKey: "trade_name",
								value: form.sendPartnerId,
								onChange: (value) => set("sendPartnerId", value),
								allowEmpty: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الشريك المستلم",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitySelect, {
								rows: partners,
								labelKey: "trade_name",
								value: form.recvPartnerId,
								onChange: (value) => set("recvPartnerId", value),
								allowEmpty: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "العملات",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.currencies,
								onChange: (e) => set("currencies", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الحد الأدنى",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.minAmount,
								onChange: (e) => set("minAmount", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الحد الأعلى",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.maxAmount,
								onChange: (e) => set("maxAmount", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "رسوم الممر",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.feeNote,
								onChange: (e) => set("feeNote", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "زمن التنفيذ المتوقع",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.etaNote,
								onChange: (e) => set("etaNote", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الحالة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: form.status,
								onChange: (value) => set("status", value),
								options: {
									active: "نشط",
									inactive: "غير نشط"
								}
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						onClick: () => act({
							type: "save-corridor",
							...form,
							id: Number(form.id || 0)
						}).catch((err) => error(err instanceof Error ? err.message : "Error")),
						children: "حفظ الممر"
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
			columns: [
				"من",
				"إلى",
				"الشبكة",
				"الحالة"
			],
			rows: rows.map((row) => [
				`${s(row, "send_country")} ←`,
				s(row, "recv_country"),
				nameOf(networks, s(row, "network_id")),
				s(row, "status") + (on(row, "is_demo") ? " · تجريبي" : "")
			]),
			onPick: (index) => {
				const row = rows[index];
				reset({
					id: s(row, "id"),
					sendCountry: s(row, "send_country"),
					recvCountry: s(row, "recv_country"),
					networkId: s(row, "network_id"),
					sendPartnerId: s(row, "send_partner_id"),
					recvPartnerId: s(row, "recv_partner_id"),
					currencies: s(row, "currencies"),
					minAmount: s(row, "min_amount"),
					maxAmount: s(row, "max_amount"),
					feeNote: s(row, "fee_note"),
					etaNote: s(row, "eta_note"),
					status: s(row, "status"),
					demo: ""
				});
			}
		})]
	});
}
function FeeForm({ desk, act, error }) {
	const plans = desk.plans;
	const { form, set } = useForm({
		replacesId: "",
		networkId: "",
		partnerId: "",
		serviceCode: "send",
		currency: "YER",
		country: "",
		side: "send",
		kind: "percent",
		minAmount: "0",
		maxAmount: "",
		percent: "0",
		fixed: "0",
		companyShare: "100",
		startsOn: "",
		endsOn: "",
		tierMin: "",
		tierMax: "",
		tierPercent: "0",
		tierFixed: "0"
	});
	const [preview, setPreview] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: "اتفاقية عمولة",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm text-muted",
					children: "التعديل ينشئ نسخة جديدة ويغلق السابقة. العمليات القديمة تحتفظ بالعمولة المحسوبة وقتها ولا تتغير."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الشبكة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitySelect, {
								rows: desk.networks,
								labelKey: "name_ar",
								value: form.networkId,
								onChange: (value) => set("networkId", value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الشريك (اختياري)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitySelect, {
								rows: desk.partners,
								labelKey: "trade_name",
								value: form.partnerId,
								onChange: (value) => set("partnerId", value),
								allowEmpty: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الخدمة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: form.serviceCode,
								onChange: (value) => set("serviceCode", value),
								options: SVC
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الجهة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: form.side,
								onChange: (value) => set("side", value),
								options: {
									send: "إرسال",
									receive: "استلام"
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "النوع",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: form.kind,
								onChange: (value) => set("kind", value),
								options: {
									fixed: "ثابتة",
									percent: "نسبة",
									tiered: "متدرجة"
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "العملة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.currency,
								onChange: (e) => set("currency", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الدولة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.country,
								onChange: (e) => set("country", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "من مبلغ",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.minAmount,
								onChange: (e) => set("minAmount", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "إلى مبلغ",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.maxAmount,
								onChange: (e) => set("maxAmount", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "النسبة %",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.percent,
								onChange: (e) => set("percent", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "القيمة الثابتة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.fixed,
								onChange: (e) => set("fixed", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "حصة الشركة %",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.companyShare,
								onChange: (e) => set("companyShare", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "يبدأ",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								type: "date",
								value: form.startsOn,
								onChange: (e) => set("startsOn", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "ينتهي",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								type: "date",
								value: form.endsOn,
								onChange: (e) => set("endsOn", e.target.value)
							})
						})
					]
				}),
				form.kind === "tiered" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-3 md:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "شريحة من",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.tierMin,
								onChange: (e) => set("tierMin", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "شريحة إلى",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.tierMax,
								onChange: (e) => set("tierMax", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "نسبة الشريحة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.tierPercent,
								onChange: (e) => set("tierPercent", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "ثابت الشريحة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.tierFixed,
								onChange: (e) => set("tierFixed", e.target.value)
							})
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						onClick: () => act({
							type: "save-plan",
							...form,
							replacesId: Number(form.replacesId || 0),
							tiers: form.kind === "tiered" ? [{
								minAmount: form.tierMin || 0,
								maxAmount: form.tierMax,
								percent: form.tierPercent,
								fixed: form.tierFixed
							}] : []
						}).catch((err) => error(err instanceof Error ? err.message : "Error")),
						children: "حفظ نسخة"
					})
				}),
				preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm",
					children: preview
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
			columns: [
				"#",
				"الشبكة",
				"النوع",
				"العملة",
				"حصة الشركة",
				"سارية"
			],
			rows: plans.map((row) => [
				s(row, "id"),
				nameOf(desk.networks, s(row, "network_id")),
				s(row, "kind"),
				s(row, "currency"),
				s(row, "company_share"),
				on(row, "active") ? "نعم" : "مغلقة"
			]),
			onPick: (index) => {
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
			}
		})]
	});
}
function BalanceDesk({ desk, includeDemo, act, error }) {
	const entries = desk.entries.filter((row) => includeDemo || !on(row, "is_demo"));
	const holds = desk.holds.filter((row) => (includeDemo || !on(row, "is_demo")) && s(row, "status") === "active");
	const balances = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const row of entries) {
			if (!s(row, "account_code").startsWith("NET:")) continue;
			map.set(s(row, "account_code"), (map.get(s(row, "account_code")) ?? 0) + Number(s(row, "debit") || 0) - Number(s(row, "credit") || 0));
		}
		return [...map.entries()];
	}, [entries]);
	const { form, set } = useForm({
		idempotencyKey: "",
		networkId: "",
		currency: "YER",
		amount: "",
		kind: "deposit",
		note: "",
		costCenter: ""
	});
	const [tx, setTx] = (0, import_react.useState)({
		idempotencyKey: "",
		networkId: "",
		direction: "out",
		currency: "YER",
		amount: "",
		status: "posted",
		sendPartnerId: "",
		recvPartnerId: "",
		note: "",
		costCenter: ""
	});
	const [settlement, setSettlement] = (0, import_react.useState)({
		code: "",
		networkId: "",
		partnerId: "",
		currency: "YER",
		periodStart: "",
		periodEnd: "",
		statementAmount: "",
		note: "",
		documents: "",
		costCenter: "",
		diffNote: ""
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "أرصدة الشبكات",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm text-muted",
					children: "الرصيد = افتتاحي + إيداع + وارد − سحب − صادر. المتاح = الرصيد − المحجوز. المستحق للشريك يظهر في حساب PTR ضمن القيود. هذه قيود الوحدة، وليست ترحيلاً إلى نظام محاسبي خارجي."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
					columns: [
						"الحساب",
						"الرصيد",
						"محجوز"
					],
					rows: balances.map(([code, value]) => {
						const held = holds.filter((row) => `NET:${s(row, "network_id")}:${s(row, "currency")}` === code).reduce((sum, row) => sum + Number(s(row, "amount") || 0), 0);
						return [
							code,
							value.toFixed(2),
							held.toFixed(2)
						];
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "حركة رصيد",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "مفتاح منع التكرار",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.idempotencyKey,
								onChange: (e) => set("idempotencyKey", e.target.value),
								placeholder: "dep-20261106-1"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الشبكة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitySelect, {
								rows: desk.networks,
								labelKey: "name_ar",
								value: form.networkId,
								onChange: (value) => set("networkId", value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "النوع",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: form.kind,
								onChange: (value) => set("kind", value),
								options: {
									deposit: "إيداع",
									withdrawal: "سحب",
									opening: "رصيد افتتاحي"
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "العملة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.currency,
								onChange: (e) => set("currency", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "المبلغ",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.amount,
								onChange: (e) => set("amount", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "مركز التكلفة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.costCenter,
								onChange: (e) => set("costCenter", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "بيان",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.note,
								onChange: (e) => set("note", e.target.value)
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						onClick: () => act({
							type: "post-movement",
							...form
						}).catch((err) => error(err instanceof Error ? err.message : "Error")),
						children: "ترحيل الحركة"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "حوالة عبر الشبكة",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "مرجع فريد",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: tx.idempotencyKey,
									onChange: (e) => setTx({
										...tx,
										idempotencyKey: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "الشبكة",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitySelect, {
									rows: desk.networks,
									labelKey: "name_ar",
									value: tx.networkId,
									onChange: (value) => setTx({
										...tx,
										networkId: value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "الاتجاه",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									value: tx.direction,
									onChange: (value) => setTx({
										...tx,
										direction: value
									}),
									options: {
										out: "صادرة",
										in: "واردة"
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "الحالة",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									value: tx.status,
									onChange: (value) => setTx({
										...tx,
										status: value
									}),
									options: {
										posted: "مرحّلة",
										failed: "فاشلة",
										rejected: "مرفوضة"
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "العملة",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: tx.currency,
									onChange: (e) => setTx({
										...tx,
										currency: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "المبلغ",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: tx.amount,
									onChange: (e) => setTx({
										...tx,
										amount: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "شريك الإرسال",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitySelect, {
									rows: desk.partners,
									labelKey: "trade_name",
									value: tx.sendPartnerId,
									onChange: (value) => setTx({
										...tx,
										sendPartnerId: value
									}),
									allowEmpty: true
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "شريك الاستلام",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitySelect, {
									rows: desk.partners,
									labelKey: "trade_name",
									value: tx.recvPartnerId,
									onChange: (value) => setTx({
										...tx,
										recvPartnerId: value
									}),
									allowEmpty: true
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "ملاحظة",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: tx.note,
									onChange: (e) => setTx({
										...tx,
										note: e.target.value
									})
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: "العمولة تُحسب من الاتفاقية السارية عند الترحيل. إعادة نفس المرجع لا تنشئ قيداً ثانياً. الفشل والرفض لا يرحّلان قيداً."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
							onClick: () => act({
								type: "post-transfer",
								...tx
							}).catch((err) => error(err instanceof Error ? err.message : "Error")),
							children: "تسجيل"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
				columns: [
					"المرجع",
					"الاتجاه",
					"المبلغ",
					"العمولة",
					"حصة الشركة",
					"الحالة"
				],
				rows: desk.transfers.map((row) => [
					s(row, "reference"),
					s(row, "direction"),
					s(row, "amount"),
					s(row, "fee"),
					s(row, "company_share"),
					s(row, "status")
				])
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "تسوية",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "الرمز",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: settlement.code,
									onChange: (e) => setSettlement({
										...settlement,
										code: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "الشبكة",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitySelect, {
									rows: desk.networks,
									labelKey: "name_ar",
									value: settlement.networkId,
									onChange: (value) => setSettlement({
										...settlement,
										networkId: value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "الشريك",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitySelect, {
									rows: desk.partners,
									labelKey: "trade_name",
									value: settlement.partnerId,
									onChange: (value) => setSettlement({
										...settlement,
										partnerId: value
									}),
									allowEmpty: true
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "العملة",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: settlement.currency,
									onChange: (e) => setSettlement({
										...settlement,
										currency: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "من",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									type: "date",
									value: settlement.periodStart,
									onChange: (e) => setSettlement({
										...settlement,
										periodStart: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "إلى",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									type: "date",
									value: settlement.periodEnd,
									onChange: (e) => setSettlement({
										...settlement,
										periodEnd: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "مبلغ كشف الشريك",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: settlement.statementAmount,
									onChange: (e) => setSettlement({
										...settlement,
										statementAmount: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "ملاحظة الفرق",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: settlement.diffNote,
									onChange: (e) => setSettlement({
										...settlement,
										diffNote: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "مستندات",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: settlement.documents,
									onChange: (e) => setSettlement({
										...settlement,
										documents: e.target.value
									})
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: "مبلغ النظام يُجمع من حصص الشركاء المرحّلة في الفترة. الاعتماد يرحّل القيد مرة واحدة، ولا يجوز لمن أنشأ المسودة أن يعتمدها."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
							onClick: () => act({
								type: "save-settlement",
								...settlement
							}).catch((err) => error(err instanceof Error ? err.message : "Error")),
							children: "إنشاء مسودة"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
				columns: [
					"الرمز",
					"النظام",
					"الكشف",
					"الفرق",
					"الحالة"
				],
				rows: desk.settlements.map((row) => [
					s(row, "code"),
					s(row, "system_amount"),
					s(row, "statement_amount"),
					s(row, "difference"),
					s(row, "status")
				]),
				onPick: (index) => {
					const row = desk.settlements[index];
					if (s(row, "status") === "approved") return;
					act({
						type: "approve-settlement",
						id: n(row, "id")
					}).catch((err) => error(err instanceof Error ? err.message : "Error"));
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "النقر على تسوية غير معتمدة يرسلها للاعتماد."
			})
		]
	});
}
function AgreementForm({ desk, expiring, act, error }) {
	const rows = desk.agreements;
	const { form, set, reset } = useForm({
		id: "",
		code: "",
		networkId: "",
		partnerId: "",
		kind: "تعامل",
		signedOn: "",
		startsOn: "",
		endsOn: "",
		terms: "",
		commissionNote: "",
		limitsNote: "",
		obligations: "",
		documents: "",
		status: "draft",
		alertDays: "30"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			expiring.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "تنبيه",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "text-sm",
					children: expiring.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						s(row, "code"),
						" تنتهي ",
						s(row, "ends_on")
					] }, s(row, "id")))
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "اتفاقية",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "رقم الاتفاقية",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.code,
								onChange: (e) => set("code", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "النوع",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.kind,
								onChange: (e) => set("kind", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الشبكة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitySelect, {
								rows: desk.networks,
								labelKey: "name_ar",
								value: form.networkId,
								onChange: (value) => set("networkId", value),
								allowEmpty: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الشريك",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitySelect, {
								rows: desk.partners,
								labelKey: "trade_name",
								value: form.partnerId,
								onChange: (value) => set("partnerId", value),
								allowEmpty: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "التوقيع",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								type: "date",
								value: form.signedOn,
								onChange: (e) => set("signedOn", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "البداية",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								type: "date",
								value: form.startsOn,
								onChange: (e) => set("startsOn", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الانتهاء",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								type: "date",
								value: form.endsOn,
								onChange: (e) => set("endsOn", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "مهلة التنبيه بالأيام",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.alertDays,
								onChange: (e) => set("alertDays", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الحالة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: form.status,
								onChange: (value) => set("status", value),
								options: {
									draft: "مسودة",
									active: "سارية",
									expired: "منتهية",
									terminated: "منهية"
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الشروط",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.terms,
								onChange: (e) => set("terms", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "العمولات",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.commissionNote,
								onChange: (e) => set("commissionNote", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الحدود",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.limitsNote,
								onChange: (e) => set("limitsNote", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الالتزامات",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.obligations,
								onChange: (e) => set("obligations", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "المستندات",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: form.documents,
								onChange: (e) => set("documents", e.target.value)
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						onClick: () => act({
							type: "save-agreement",
							...form,
							id: Number(form.id || 0)
						}).catch((err) => error(err instanceof Error ? err.message : "Error")),
						children: "حفظ"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
				columns: [
					"الرقم",
					"النوع",
					"الانتهاء",
					"الحالة"
				],
				rows: rows.map((row) => [
					s(row, "code"),
					s(row, "kind"),
					s(row, "ends_on"),
					s(row, "status")
				]),
				onPick: (index) => {
					const row = rows[index];
					reset({
						id: s(row, "id"),
						code: s(row, "code"),
						networkId: s(row, "network_id"),
						partnerId: s(row, "partner_id"),
						kind: s(row, "kind"),
						signedOn: s(row, "signed_on").slice(0, 10),
						startsOn: s(row, "starts_on").slice(0, 10),
						endsOn: s(row, "ends_on").slice(0, 10),
						terms: s(row, "terms"),
						commissionNote: s(row, "commission_note"),
						limitsNote: s(row, "limits_note"),
						obligations: s(row, "obligations"),
						documents: s(row, "documents"),
						status: s(row, "status"),
						alertDays: s(row, "alert_days")
					});
				}
			})
		]
	});
}
function TechForm({ desk, act, error }) {
	const rows = desk.integrations;
	const { form, set } = useForm({
		networkId: "",
		provider: "",
		mode: "manual",
		apiBase: "",
		sandboxBase: "",
		secret: "",
		errorNote: "",
		log: ""
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "ربط تقني",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm text-muted",
						children: "الوضع اليدوي هو المسار العامل حتى تُسلَّم بيئة الربط. لا يُجرى اتصال خارجي من هذه الشاشة، ولا يُعاد إظهار المفتاح بعد حفظه."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "الشبكة",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntitySelect, {
									rows: desk.networks,
									labelKey: "name_ar",
									value: form.networkId,
									onChange: (value) => set("networkId", value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "المزود",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: form.provider,
									onChange: (e) => set("provider", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "الوسيلة",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									value: form.mode,
									onChange: (value) => set("mode", value),
									options: {
										manual: "إدخال يدوي",
										rest: "REST API",
										webhook: "Webhooks",
										file: "ملفات تبادل",
										direct: "ربط مباشر"
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "عنوان API",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: form.apiBase,
									onChange: (e) => set("apiBase", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "بيئة التجربة",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: form.sandboxBase,
									onChange: (e) => set("sandboxBase", e.target.value)
								})
							}),
							desk.caps.secrets ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "مفتاح جديد",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									type: "password",
									value: form.secret,
									onChange: (e) => set("secret", e.target.value),
									autoComplete: "off"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "حفظ المفتاح لمدير النظام فقط."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "ملاحظة خطأ",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: form.errorNote,
									onChange: (e) => set("errorNote", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "سجل",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: form.log,
									onChange: (e) => set("log", e.target.value)
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
							onClick: () => act({
								type: "save-integration",
								...form
							}).then(() => set("secret", "")).catch((err) => error(err instanceof Error ? err.message : "Error")),
							children: "حفظ الربط"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
				columns: [
					"الشبكة",
					"الوسيلة",
					"الحالة",
					"تلميح المفتاح",
					"آخر خطأ"
				],
				rows: rows.map((row) => [
					nameOf(desk.networks, s(row, "network_id")),
					s(row, "mode"),
					s(row, "status"),
					s(row, "secret_hint"),
					s(row, "last_error")
				])
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "سجل الأخطاء",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-1 text-sm",
					children: desk.logs.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						s(row, "created_at"),
						" — ",
						s(row, "message")
					] }, s(row, "id")))
				})
			})
		]
	});
}
function ServiceMatrix({ desk, act, error }) {
	const services = desk.services;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: "خدمات كل شبكة",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-muted",
			children: "الخدمة لا تُعد متاحة إلا إذا فُعّلت واعتُمدت. الإلغاء والاسترداد يبقيان وفق شروط الشبكة ولا يُنفَّذان آلياً من هنا."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-line text-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2",
						children: "الشبكة"
					}), Object.values(SVC).map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-2 py-2 font-medium",
						children: label
					}, label))]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: desk.networks.map((network) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-line",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-2",
						children: s(network, "name_ar")
					}), Object.keys(SVC).map((code) => {
						const row = services.find((item) => s(item, "network_id") === s(network, "id") && s(item, "service_code") === code);
						const enabled = row ? on(row, "enabled") : false;
						const approved = row ? on(row, "approved") : false;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-2 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "underline-offset-2 hover:underline",
								onClick: () => act({
									type: "set-service",
									networkId: n(network, "id"),
									serviceCode: code,
									enabled: !enabled,
									approved: !enabled ? false : approved
								}).catch((err) => error(err instanceof Error ? err.message : "Error")),
								children: enabled ? approved ? "معتمدة" : "مفعلة" : "موقفة"
							}), enabled && !approved && desk.caps.approve ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-1 block text-xs text-primary",
								onClick: () => act({
									type: "set-service",
									networkId: n(network, "id"),
									serviceCode: code,
									enabled: true,
									approved: true
								}).catch((err) => error(err instanceof Error ? err.message : "Error")),
								children: "اعتماد"
							}) : null]
						}, code);
					})]
				}, s(network, "id"))) })]
			})
		})]
	});
}
function Reports({ desk, includeDemo }) {
	const [kind, setKind] = (0, import_react.useState)("networks");
	const networks = desk.networks.filter((row) => includeDemo || !on(row, "is_demo"));
	const partners = desk.partners.filter((row) => includeDemo || !on(row, "is_demo"));
	const transfers = desk.transfers.filter((row) => includeDemo || !on(row, "is_demo"));
	const settlements = desk.settlements.filter((row) => includeDemo || !on(row, "is_demo"));
	const views = {
		networks: {
			title: "جميع الشبكات",
			columns: [
				"الرمز",
				"الاسم",
				"النوع",
				"الحالة"
			],
			rows: networks.map((row) => [
				s(row, "code"),
				s(row, "name_ar"),
				KINDS[s(row, "kind")] || "",
				STATUS[s(row, "status")] || ""
			])
		},
		partners: {
			title: "الشركاء",
			columns: [
				"الرقم",
				"الاسم",
				"النوع",
				"الدولة"
			],
			rows: partners.map((row) => [
				s(row, "code"),
				s(row, "trade_name"),
				PTR[s(row, "kind")] || "",
				s(row, "country")
			])
		},
		activity: {
			title: "النشطة والمتوقفة",
			columns: ["الاسم", "الحالة"],
			rows: networks.map((row) => [s(row, "name_ar"), STATUS[s(row, "status")] || ""])
		},
		byNetwork: {
			title: "حوالات حسب الشبكة",
			columns: [
				"الشبكة",
				"العدد",
				"المبلغ"
			],
			rows: volumeBy(transfers, networks).map((item) => [
				item.name,
				String(transfers.filter((row) => nameOf(networks, s(row, "network_id")) === item.name).length),
				item.value.toFixed(2)
			])
		},
		byCountry: {
			title: "حوالات حسب الدولة",
			columns: ["ممر", "مبلغ"],
			rows: desk.corridors.map((row) => [`${s(row, "send_country")} → ${s(row, "recv_country")}`, s(row, "status")])
		},
		byPartner: {
			title: "حوالات حسب الشريك",
			columns: [
				"المرجع",
				"شريك الإرسال",
				"المبلغ"
			],
			rows: transfers.map((row) => [
				s(row, "reference"),
				nameOf(partners, s(row, "send_partner_id"), "trade_name"),
				s(row, "amount")
			])
		},
		fees: {
			title: "العمولات",
			columns: [
				"المرجع",
				"الرسم",
				"حصة الشركة",
				"حصة الشريك"
			],
			rows: transfers.map((row) => [
				s(row, "reference"),
				s(row, "fee"),
				s(row, "company_share"),
				s(row, "partner_share")
			])
		},
		balances: {
			title: "أرصدة",
			columns: [
				"الحساب",
				"مدين",
				"دائن"
			],
			rows: desk.entries.filter((row) => includeDemo || !on(row, "is_demo")).map((row) => [
				s(row, "account_code"),
				s(row, "debit"),
				s(row, "credit")
			])
		},
		settlements: {
			title: "التسويات",
			columns: [
				"الرمز",
				"النظام",
				"الكشف",
				"الحالة"
			],
			rows: settlements.map((row) => [
				s(row, "code"),
				s(row, "system_amount"),
				s(row, "statement_amount"),
				s(row, "status")
			])
		},
		diffs: {
			title: "الفروقات",
			columns: ["الرمز", "الفرق"],
			rows: settlements.filter((row) => Number(s(row, "difference") || 0) !== 0).map((row) => [s(row, "code"), s(row, "difference")])
		},
		agreements: {
			title: "الاتفاقيات",
			columns: [
				"الرقم",
				"الانتهاء",
				"الحالة"
			],
			rows: desk.agreements.map((row) => [
				s(row, "code"),
				s(row, "ends_on"),
				s(row, "status")
			])
		},
		performance: {
			title: "أداء الشبكات",
			columns: [
				"الشبكة",
				"مرحّل",
				"فاشل أو مرفوض"
			],
			rows: networks.map((row) => [
				s(row, "name_ar"),
				String(transfers.filter((item) => s(item, "network_id") === s(row, "id") && s(item, "status") === "posted").length),
				String(transfers.filter((item) => s(item, "network_id") === s(row, "id") && (s(item, "status") === "failed" || s(item, "status") === "rejected")).length)
			])
		},
		serviceReport: {
			title: "الخدمات المتاحة",
			columns: [
				"الشبكة",
				"الخدمة",
				"الحالة"
			],
			rows: desk.services.filter((row) => on(row, "enabled") && on(row, "approved")).map((row) => [
				nameOf(networks, s(row, "network_id")),
				SVC[s(row, "service_code")] || s(row, "service_code"),
				"معتمدة"
			])
		},
		failed: {
			title: "المرفوضة والفاشلة",
			columns: [
				"المرجع",
				"الحالة",
				"المبلغ"
			],
			rows: transfers.filter((row) => [
				"failed",
				"rejected",
				"void"
			].includes(s(row, "status"))).map((row) => [
				s(row, "reference"),
				s(row, "status"),
				s(row, "amount")
			])
		}
	};
	const view = views[kind];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: "مركز التقارير",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: inputClass,
					value: kind,
					onChange: (event) => setKind(event.target.value),
					children: Object.entries(views).map(([id, item]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: id,
						children: item.title
					}, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 rounded-full border border-line px-4 text-sm",
					onClick: () => downloadCsv(view.title, [view.columns, ...view.rows]),
					children: "Excel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 rounded-full border border-line px-4 text-sm",
					onClick: () => window.print(),
					children: "طباعة / PDF"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
			columns: view.columns,
			rows: view.rows
		})]
	});
}
function downloadCsv(title, rows) {
	const body = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, "\"\"")}"`).join(",")).join("\n");
	const blob = new Blob([`\uFEFF${body}`], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `${title}.csv`;
	link.click();
	URL.revokeObjectURL(url);
}
function Table({ columns, rows, onPick }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const shown = rows.filter((row) => row.join(" ").includes(query));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-x-auto rounded-2xl border border-line bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				value: query,
				onChange: (event) => setQuery(event.target.value),
				placeholder: "بحث"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-b border-line",
				children: columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-3 py-2 text-start font-medium",
					children: column
				}, column))
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [shown.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-b border-line last:border-0",
				onClick: () => onPick?.(rows.indexOf(row)),
				children: row.map((cell, cellIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-3 py-2",
					children: cell
				}, cellIndex))
			}, `${row.join("-")}-${index}`)), shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-3 py-4 text-muted",
				colSpan: columns.length,
				children: "لا صفوف."
			}) }) : null] })]
		})]
	});
}
function Select({ value, onChange, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: inputClass,
		value,
		onChange: (event) => onChange(event.target.value),
		children: Object.entries(options).map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: id,
			children: label
		}, id))
	});
}
function EntitySelect({ rows, labelKey, value, onChange, allowEmpty = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		className: inputClass,
		value,
		onChange: (event) => onChange(event.target.value),
		children: [allowEmpty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: "—"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: "اختر"
		}), rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
			value: s(row, "id"),
			children: [s(row, labelKey), on(row, "is_demo") ? " (تجريبي)" : ""]
		}, s(row, "id")))]
	});
}
//#endregion
export { NetworksDesk as component };
