import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, _ as Outlet, et as require_react, g as useChildMatches, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as adminServices, C as adminSaveJob, D as adminSaveService, E as adminSavePartner, F as adminTransferStatus, I as adminTransfers, L as adminUpdateRate, M as adminSettings, N as adminStaff, O as adminSaveSettings, P as adminTickets, S as adminSaveBranch, T as adminSavePage, V as getAdminOverview, _ as adminPages, a as adminAddRate, b as adminReplyComplaint, c as adminComplaints, ct as useCurrentUserState, d as adminInquiries, f as adminInquiryStatus, g as adminNews, j as adminSetRole, k as adminServiceRequests, l as adminCreateTransfer, lt as useI18n, o as adminAudit, p as adminJobs, r as RedirectToSignIn, s as adminBranches, st as syncProfile, u as adminCustomers, v as adminPartners, w as adminSaveNews, x as adminReplyTicket, y as adminRates, z as bootstrapAdmin } from "./shell-DdDjRdsi.mjs";
import { c as PrimaryButton, i as Field, l as inputClass, r as ErrorNote } from "./ui-YTjt0IH-.mjs";
import { a as statusLabel, i as roleLabel, n as can, t as ROLES } from "./labels-Aw3jd-vz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BNFYkBtw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const nested = useChildMatches().length > 0;
	const { user, isPending } = useCurrentUserState();
	const { lang, t } = useI18n();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [overview, setOverview] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [loading, setLoading] = (0, import_react.useState)(true);
	async function refresh(name) {
		const next = await syncProfile({ data: { name } });
		setProfile(next);
		if (can(next.role, "read")) setOverview(await getAdminOverview());
		else setOverview(null);
	}
	(0, import_react.useEffect)(() => {
		if (!user?.id) return;
		let gone = false;
		refresh(user.displayName ?? "").catch((err) => {
			if (!gone) setError(err instanceof Error ? err.message : "Error");
		}).finally(() => {
			if (!gone) setLoading(false);
		});
		return () => {
			gone = true;
		};
	}, [user?.id, user?.displayName]);
	if (nested) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	if (isPending || user && loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-2xl bg-line" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (!profile) return error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-xl px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { children: error })
	}) : null;
	if (!can(profile.role, "read")) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: t("لوحة الإدارة", "Admin")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: t("حسابك بدور عميل. إن لم يوجد مدير نظام بعد، يمكن تعيين أول مدير مرة واحدة من هذا الحساب.", "This account is a customer. If no system admin exists yet, this account can take that role once.")
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { children: error })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
					onClick: () => {
						setError("");
						bootstrapAdmin().then(() => refresh(user.displayName ?? "")).catch((err) => setError(err instanceof Error ? err.message : "Error"));
					},
					children: t("تعيين أول مدير للنظام", "Claim the first system admin")
				})
			})
		]
	});
	const tabs = [
		[
			"overview",
			t("المؤشرات", "Overview"),
			"read"
		],
		[
			"rates",
			t("الأسعار", "Rates"),
			"rates"
		],
		[
			"branches",
			t("الفروع", "Branches"),
			"branches"
		],
		[
			"services",
			t("الخدمات", "Services"),
			"content"
		],
		[
			"news",
			t("الأخبار", "News"),
			"content"
		],
		[
			"pages",
			t("الصفحات", "Pages"),
			"content"
		],
		[
			"partners",
			t("الشركاء", "Partners"),
			"content"
		],
		[
			"jobs",
			t("الوظائف", "Jobs"),
			"content"
		],
		[
			"settings",
			t("الهوية والتواصل", "Identity"),
			"content"
		],
		[
			"inquiries",
			t("التواصل", "Inquiries"),
			"support"
		],
		[
			"complaints",
			t("الشكاوى", "Complaints"),
			"support"
		],
		[
			"requests",
			t("طلبات الخدمات", "Service requests"),
			"support"
		],
		[
			"customers",
			t("العملاء", "Customers"),
			"support"
		],
		[
			"tickets",
			t("الدعم", "Support"),
			"support"
		],
		[
			"transfers",
			t("الحوالات", "Transfers"),
			"support"
		],
		[
			"staff",
			t("الصلاحيات", "Roles"),
			"*"
		],
		[
			"audit",
			t("التدقيق", "Audit"),
			"audit"
		]
	].filter(([, , perm]) => perm === "*" ? profile.role === "system_admin" : can(profile.role, perm));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-gold",
				children: roleLabel(profile.role, lang)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: t("لوحة الإدارة", "Admin console")
			}),
			can(profile.role, "networks") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/networks",
				className: "mt-4 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm text-surface",
				children: t("شبكات التحويل والشركاء", "Transfer networks and partners")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex gap-2 overflow-x-auto pb-2",
				children: tabs.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: `min-h-11 shrink-0 rounded-full px-4 text-sm ${tab === id ? "bg-primary text-surface" : "border border-line bg-surface"}`,
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [
					tab === "overview" && overview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
								label: t("تواصل جديد", "New inquiries"),
								value: overview.newInquiries
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
								label: t("دعم مفتوح", "Open tickets"),
								value: overview.openTickets
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
								label: t("نقاط نشطة", "Active points"),
								value: overview.activeBranches
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
								label: t("أخبار منشورة", "Published news"),
								value: overview.publishedNews
							})
						]
					}) : null,
					tab === "rates" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatesDesk, {}) : null,
					tab === "branches" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BranchDesk, {}) : null,
					tab === "services" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceDesk, {}) : null,
					tab === "news" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsDesk, {}) : null,
					tab === "pages" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PagesDesk, {}) : null,
					tab === "partners" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnersDesk, {}) : null,
					tab === "jobs" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobsDesk, {}) : null,
					tab === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsDesk, {}) : null,
					tab === "inquiries" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InquiryDesk, {}) : null,
					tab === "complaints" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComplaintsDesk, {}) : null,
					tab === "requests" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequestsDesk, {}) : null,
					tab === "customers" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomersDesk, {}) : null,
					tab === "tickets" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketDesk, {}) : null,
					tab === "transfers" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransferDesk, {}) : null,
					tab === "staff" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffDesk, {}) : null,
					tab === "audit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditDesk, {}) : null
				]
			})
		]
	});
}
function Tile({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-line bg-surface p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 font-display text-4xl tabular-nums",
			children: value
		})]
	});
}
function DeskError({ error }) {
	if (!error) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { children: error })
	});
}
function RatesDesk() {
	const { t } = useI18n();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)({
		code: "",
		nameAr: "",
		nameEn: "",
		buy: "1",
		sell: "1",
		region: ""
	});
	(0, import_react.useEffect)(() => {
		adminRates().then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error }),
			rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RateEditor, {
				row,
				onSaved: setRows,
				onError: setError
			}, row.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-2 rounded-2xl border border-line bg-surface p-4 md:grid-cols-3",
				onSubmit: (e) => {
					e.preventDefault();
					adminAddRate({ data: draft }).then(setRows).catch((err) => setError(err instanceof Error ? err.message : "Error"));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						placeholder: "USD",
						value: draft.code,
						onChange: (e) => setDraft({
							...draft,
							code: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						placeholder: t("الاسم عربي", "Arabic name"),
						value: draft.nameAr,
						onChange: (e) => setDraft({
							...draft,
							nameAr: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						placeholder: t("الاسم إنجليزي", "English name"),
						value: draft.nameEn,
						onChange: (e) => setDraft({
							...draft,
							nameEn: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						"aria-label": t("شراء", "Buy"),
						value: draft.buy,
						onChange: (e) => setDraft({
							...draft,
							buy: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						"aria-label": t("بيع", "Sell"),
						value: draft.sell,
						onChange: (e) => setDraft({
							...draft,
							sell: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						placeholder: t("المنطقة، فارغة للعام", "Region, blank if national"),
						value: draft.region,
						onChange: (e) => setDraft({
							...draft,
							region: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						type: "submit",
						children: t("إضافة عملة تجريبية", "Add sample currency")
					})
				]
			})
		]
	});
}
function RateEditor({ row, onSaved, onError }) {
	const { t } = useI18n();
	const [buy, setBuy] = (0, import_react.useState)(row.buy);
	const [sell, setSell] = (0, import_react.useState)(row.sell);
	const [changePct, setChangePct] = (0, import_react.useState)(row.changePct);
	const [direction, setDirection] = (0, import_react.useState)(row.direction);
	const [demo, setDemo] = (0, import_react.useState)(row.demo);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid items-end gap-2 rounded-2xl border border-line bg-surface p-4 md:grid-cols-4",
		onSubmit: (e) => {
			e.preventDefault();
			adminUpdateRate({ data: {
				id: row.id,
				buy,
				sell,
				direction,
				demo,
				changePct
			} }).then(onSaved).catch((err) => onError(err instanceof Error ? err.message : "Error"));
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-medium",
				children: [
					row.code,
					row.region ? ` · ${row.region}` : "",
					row.base ? " · YER" : "",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-xs text-muted",
						children: row.updatedAt
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				value: buy,
				onChange: (e) => setBuy(e.target.value),
				"aria-label": "buy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				value: sell,
				onChange: (e) => setSell(e.target.value),
				"aria-label": "sell"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				value: changePct,
				onChange: (e) => setChangePct(e.target.value),
				"aria-label": "change"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: inputClass,
				value: direction,
				onChange: (e) => setDirection(e.target.value),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "flat",
						children: "flat"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "up",
						children: "up"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "down",
						children: "down"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-11 items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: demo,
					onChange: (e) => setDemo(e.target.checked)
				}), t("تجريبي", "Demo")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
				type: "submit",
				children: t("حفظ", "Save")
			})
		]
	});
}
var emptyBranch = () => ({
	id: 0,
	kind: "branch",
	nameAr: "",
	nameEn: "",
	governorateAr: "",
	governorateEn: "",
	cityAr: "",
	cityEn: "",
	addressAr: "",
	addressEn: "",
	phone: "",
	hoursAr: "",
	hoursEn: "",
	servicesAr: "",
	servicesEn: "",
	lat: "",
	lng: "",
	photoUrl: "",
	demo: true,
	active: true
});
function BranchDesk() {
	const { t } = useI18n();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)(emptyBranch());
	(0, import_react.useEffect)(() => {
		adminBranches().then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BranchForm, {
				value: draft,
				onChange: setDraft,
				submitLabel: t("إضافة نقطة", "Add point"),
				onSubmit: () => {
					adminSaveBranch({ data: draft }).then((next) => {
						setRows(next);
						setDraft(emptyBranch());
					}).catch((e) => setError(e instanceof Error ? e.message : "Error"));
				}
			}),
			rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BranchEditor, {
				row,
				onSaved: setRows,
				onError: setError
			}, row.id))
		]
	});
}
function BranchEditor({ row, onSaved, onError }) {
	const [value, setValue] = (0, import_react.useState)(row);
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BranchForm, {
		value,
		onChange: setValue,
		submitLabel: t("تحديث", "Update"),
		onSubmit: () => {
			adminSaveBranch({ data: value }).then(onSaved).catch((e) => onError(e instanceof Error ? e.message : "Error"));
		}
	});
}
function BranchForm({ value, onChange, onSubmit, submitLabel }) {
	const { t } = useI18n();
	const set = (patch) => onChange({
		...value,
		...patch
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-2 rounded-2xl border border-line bg-surface p-4 md:grid-cols-3",
		onSubmit: (e) => {
			e.preventDefault();
			onSubmit();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: inputClass,
				value: value.kind,
				onChange: (e) => set({ kind: e.target.value }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "branch",
					children: t("فرع", "Branch")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "agent",
					children: t("وكيل", "Agent")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: t("الاسم عربي", "Arabic name"),
				value: value.nameAr,
				onChange: (e) => set({ nameAr: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: t("الاسم إنجليزي", "English name"),
				value: value.nameEn,
				onChange: (e) => set({ nameEn: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: t("المحافظة", "Governorate"),
				value: value.governorateAr,
				onChange: (e) => set({ governorateAr: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: "Governorate",
				value: value.governorateEn,
				onChange: (e) => set({ governorateEn: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: t("المدينة", "City"),
				value: value.cityAr,
				onChange: (e) => set({ cityAr: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: "City",
				value: value.cityEn,
				onChange: (e) => set({ cityEn: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: t("العنوان", "Address"),
				value: value.addressAr,
				onChange: (e) => set({ addressAr: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: "Address",
				value: value.addressEn,
				onChange: (e) => set({ addressEn: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: t("الهاتف", "Phone"),
				value: value.phone,
				onChange: (e) => set({ phone: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: t("الساعات", "Hours"),
				value: value.hoursAr,
				onChange: (e) => set({ hoursAr: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: "Hours",
				value: value.hoursEn,
				onChange: (e) => set({ hoursEn: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: t("الخدمات", "Services"),
				value: value.servicesAr,
				onChange: (e) => set({ servicesAr: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: "Services",
				value: value.servicesEn,
				onChange: (e) => set({ servicesEn: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: t("خط العرض", "Latitude"),
				value: value.lat ?? "",
				onChange: (e) => set({ lat: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: t("خط الطول", "Longitude"),
				value: value.lng ?? "",
				onChange: (e) => set({ lng: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: t("صورة: https أو /media/…", "Photo: https or /media/…"),
				value: value.photoUrl,
				onChange: (e) => set({ photoUrl: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: value.demo,
					onChange: (e) => set({ demo: e.target.checked })
				}), t("تجريبي", "Demo")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: value.active,
					onChange: (e) => set({ active: e.target.checked })
				}), t("نشط", "Active")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
				type: "submit",
				children: submitLabel
			})
		]
	});
}
function ServiceDesk() {
	const { t } = useI18n();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		adminServices().then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error }), rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceEditor, {
			row,
			onSaved: setRows,
			onError: setError,
			label: t("حفظ الخدمة", "Save service")
		}, row.slug))]
	});
}
function ServiceEditor({ row, onSaved, onError, label }) {
	const [summaryAr, setSummaryAr] = (0, import_react.useState)(row.summaryAr);
	const [bodyAr, setBodyAr] = (0, import_react.useState)(row.bodyAr);
	const [published, setPublished] = (0, import_react.useState)(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-2 rounded-2xl border border-line bg-surface p-4",
		onSubmit: (e) => {
			e.preventDefault();
			adminSaveService({ data: {
				slug: row.slug,
				summaryAr,
				summaryEn: row.summaryEn,
				bodyAr,
				bodyEn: row.bodyEn,
				published
			} }).then(onSaved).catch((err) => onError(err instanceof Error ? err.message : "Error"));
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: row.titleAr
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: `${inputClass} min-h-20 py-2`,
				value: summaryAr,
				onChange: (e) => setSummaryAr(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: `${inputClass} min-h-28 py-2`,
				value: bodyAr,
				onChange: (e) => setBodyAr(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: published,
					onChange: (e) => setPublished(e.target.checked)
				}), "نشر"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
				type: "submit",
				children: label
			})
		]
	});
}
function NewsDesk() {
	const { t } = useI18n();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [titleAr, setTitleAr] = (0, import_react.useState)("");
	const [bodyAr, setBodyAr] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		adminNews().then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-2 rounded-2xl border border-line bg-surface p-4",
				onSubmit: (e) => {
					e.preventDefault();
					adminSaveNews({ data: {
						id: 0,
						slug: "",
						kind: "announcement",
						titleAr,
						titleEn: titleAr,
						excerptAr: bodyAr.slice(0, 140),
						excerptEn: "",
						bodyAr,
						bodyEn: "",
						demo: true,
						published: true
					} }).then((next) => {
						setRows(next);
						setTitleAr("");
						setBodyAr("");
					}).catch((err) => setError(err instanceof Error ? err.message : "Error"));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						placeholder: t("عنوان", "Title"),
						value: titleAr,
						onChange: (e) => setTitleAr(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: `${inputClass} min-h-28 py-2`,
						placeholder: t("النص", "Body"),
						value: bodyAr,
						onChange: (e) => setBodyAr(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						type: "submit",
						children: t("نشر إعلان تجريبي", "Publish a sample notice")
					})
				]
			}),
			rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: row.titleAr
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						row.slug,
						" · ",
						row.published ? t("منشور", "Published") : t("مخفي", "Hidden")
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-primary",
					onClick: () => {
						adminSaveNews({ data: {
							...row,
							published: !row.published
						} }).then(setRows).catch((err) => setError(err instanceof Error ? err.message : "Error"));
					},
					children: row.published ? t("إخفاء", "Hide") : t("نشر", "Publish")
				})]
			}, row.id))
		]
	});
}
function SettingsDesk() {
	const { t } = useI18n();
	const [value, setValue] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [ok, setOk] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		adminSettings().then(setValue).catch((e) => setError(e instanceof Error ? e.message : "Error"));
	}, []);
	if (!value) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error });
	const fields = [
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
		["foundedOn", t("تاريخ التأسيس عند اعتماده", "Founding date when approved")]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-3",
		onSubmit: (e) => {
			e.preventDefault();
			setOk(false);
			adminSaveSettings({ data: value }).then((next) => {
				setValue(next);
				setOk(true);
			}).catch((err) => setError(err instanceof Error ? err.message : "Error"));
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error }),
			fields.map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputClass,
					value: value[key],
					onChange: (e) => setValue({
						...value,
						[key]: e.target.value
					})
				})
			}, key)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: value.ratesLive,
					onChange: (e) => setValue({
						...value,
						ratesLive: e.target.checked
					})
				}), t("نشر لوحة الأسعار للعملاء بعد اعتماد الأرقام وإلغاء وسم التجربة", "Publish the rate board after the figures are approved and the sample mark is off")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl bg-paper p-3 text-sm",
				children: t("راجع قانونياً قبل التفعيل: عبارة المودعين والمساهمين والعوائد، وبند معايير أيزو. لن تظهر هاتان العبارتان للعميل حتى هذا الاعتماد.", "Review legally before enabling: the depositor, shareholder and return wording, and the ISO sentence. Those sentences stay off the public page until this acknowledgement.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: value.aboutReviewAck,
					onChange: (e) => setValue({
						...value,
						aboutReviewAck: e.target.checked
					})
				}), t("اعتماد صياغة المودعين وأيزو", "Acknowledge the depositor and ISO wording")]
			}),
			ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-up",
				children: t("حُفظ.", "Saved.")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
				type: "submit",
				children: t("حفظ بيانات التواصل", "Save contact details")
			})
		]
	});
}
function RequestsDesk() {
	const { t } = useI18n();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		adminServiceRequests().then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error }), rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-2xl border border-line bg-surface p-4 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-medium",
					children: [
						row.reference,
						" · ",
						row.kind
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					row.org_name,
					" — ",
					row.delegate_name,
					" — ",
					row.phone
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: row.city
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2",
					children: row.need
				})
			]
		}, row.id))]
	});
}
function InquiryDesk() {
	const { t } = useI18n();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		adminInquiries().then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error }),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: t("لا طلبات بعد.", "No requests yet.")
			}) : null,
			rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl border border-line bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-medium",
						children: [
							row.name,
							" · ",
							row.topic
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							row.phone,
							" ",
							row.email
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: row.message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex gap-2",
						children: [
							"new",
							"in_progress",
							"closed"
						].map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `rounded-full px-3 py-2 text-xs ${row.status === status ? "bg-primary text-surface" : "border border-line"}`,
							onClick: () => {
								adminInquiryStatus({ data: {
									id: row.id,
									status
								} }).then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
							},
							children: status
						}, status))
					})
				]
			}, row.id))
		]
	});
}
function TicketDesk() {
	const { t } = useI18n();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [reply, setReply] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		adminTickets().then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error }), rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-2xl border border-line bg-surface p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: row.subject
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm",
					children: row.body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: `${inputClass} mt-3 min-h-20 py-2`,
					value: reply[row.id] ?? row.reply,
					onChange: (e) => setReply({
						...reply,
						[row.id]: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						onClick: () => {
							adminReplyTicket({ data: {
								id: row.id,
								reply: reply[row.id] ?? row.reply,
								status: "answered"
							} }).then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
						},
						children: t("إرسال الرد", "Send reply")
					})
				})
			]
		}, row.id))]
	});
}
function TransferDesk() {
	const { lang, t } = useI18n();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [form, setForm] = (0, import_react.useState)({
		reference: "",
		pin: "",
		status: "processing",
		currency: "USD",
		amount: "100",
		senderName: "",
		beneficiaryName: "",
		pickupCityAr: "",
		pickupCityEn: "",
		demo: true
	});
	(0, import_react.useEffect)(() => {
		adminTransfers().then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-2 rounded-2xl border border-line bg-surface p-4 md:grid-cols-3",
				onSubmit: (e) => {
					e.preventDefault();
					adminCreateTransfer({ data: form }).then(setRows).catch((err) => setError(err instanceof Error ? err.message : "Error"));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						placeholder: "KH-10001",
						value: form.reference,
						onChange: (e) => setForm({
							...form,
							reference: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						placeholder: t("رمز 4 أرقام", "4-digit code"),
						value: form.pin,
						onChange: (e) => setForm({
							...form,
							pin: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						placeholder: "USD",
						value: form.currency,
						onChange: (e) => setForm({
							...form,
							currency: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						value: form.amount,
						onChange: (e) => setForm({
							...form,
							amount: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						placeholder: t("المرسل", "Sender"),
						value: form.senderName,
						onChange: (e) => setForm({
							...form,
							senderName: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						placeholder: t("المستفيد", "Beneficiary"),
						value: form.beneficiaryName,
						onChange: (e) => setForm({
							...form,
							beneficiaryName: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						type: "submit",
						children: t("إنشاء حوالة", "Create transfer")
					})
				]
			}),
			rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium tabular-nums",
					children: row.reference
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						statusLabel(row.status, lang),
						" · ",
						row.currency,
						" · ",
						row.linked ? t("مرتبطة بحساب", "Linked") : t("غير مرتبطة", "Unlinked")
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: inputClass,
					value: row.status,
					onChange: (e) => {
						adminTransferStatus({ data: {
							id: row.id,
							status: e.target.value
						} }).then(setRows).catch((err) => setError(err instanceof Error ? err.message : "Error"));
					},
					children: [
						"draft",
						"processing",
						"sent",
						"ready",
						"collected",
						"cancelled",
						"rejected"
					].map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: status }, status))
				})]
			}, row.id))
		]
	});
}
function StaffDesk() {
	const { lang, t } = useI18n();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		adminStaff().then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: t("أقل صلاحية: العميل لا يدير شيئاً. التقارير تقرأ المؤشرات والتدقيق. كل دور تشغيلي يغيّر جدوله فقط. لا يُحذف آخر مدير.", "Least privilege: a customer manages nothing. Reports can read indicators and the audit log. Each operating role edits only its own desk. The last admin cannot be removed.")
			}),
			rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-center gap-2 rounded-2xl border border-line bg-surface p-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: row.displayName || row.userId
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: roleLabel(row.role, lang)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: inputClass,
						value: row.role,
						onChange: (e) => {
							adminSetRole({ data: {
								userId: row.userId,
								role: e.target.value
							} }).then(setRows).catch((err) => setError(err instanceof Error ? err.message : "Error"));
						},
						children: ROLES.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: role,
							children: roleLabel(role, lang)
						}, role))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted tabular-nums",
						children: row.createdAt
					})
				]
			}, row.userId))
		]
	});
}
function AuditDesk() {
	const { t } = useI18n();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		adminAudit().then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-x-auto rounded-2xl border border-line bg-surface",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[40rem] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-line",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-start",
								children: t("الوقت", "Time")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-start",
								children: t("الإجراء", "Action")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-start",
								children: t("السجل", "Record")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-start",
								children: t("التفصيل", "Detail")
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 tabular-nums",
							children: row.createdAt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: row.action
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2",
							children: [
								row.entity,
								" ",
								row.entityId
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: row.detail
						})
					]
				}, row.id)) })]
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-4 text-sm text-muted",
				children: t("لا حركات بعد.", "No entries yet.")
			}) : null
		]
	});
}
function PagesDesk() {
	const { t } = useI18n();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		adminPages().then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error }), rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageEditor, {
			row,
			onSaved: setRows,
			onError: setError
		}, row.slug))]
	});
}
function PageEditor({ row, onSaved, onError }) {
	const { t } = useI18n();
	const [value, setValue] = (0, import_react.useState)(row);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-2 rounded-2xl border border-line bg-surface p-4",
		onSubmit: (e) => {
			e.preventDefault();
			adminSavePage({ data: value }).then(onSaved).catch((err) => onError(err instanceof Error ? err.message : "Error"));
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-gold",
				children: value.slug
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				value: value.titleAr,
				onChange: (e) => setValue({
					...value,
					titleAr: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				value: value.titleEn,
				onChange: (e) => setValue({
					...value,
					titleEn: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: `${inputClass} min-h-28 py-3`,
				value: value.bodyAr,
				onChange: (e) => setValue({
					...value,
					bodyAr: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: `${inputClass} min-h-28 py-3`,
				value: value.bodyEn,
				onChange: (e) => setValue({
					...value,
					bodyEn: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: value.published,
					onChange: (e) => setValue({
						...value,
						published: e.target.checked
					})
				}), t("منشور", "Published")]
			}),
			[
				"privacy",
				"terms",
				"compliance",
				"aml",
				"kyc",
				"fraud"
			].includes(value.slug) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: value.legalApproved,
					onChange: (e) => setValue({
						...value,
						legalApproved: e.target.checked
					})
				}), t("اعتماد المستشار القانوني للنشر العام", "Counsel approval for public release")]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
				type: "submit",
				children: t("حفظ الصفحة", "Save page")
			})
		]
	});
}
var emptyPartner = () => ({
	id: 0,
	nameAr: "",
	nameEn: "",
	kind: "network",
	noteAr: "",
	noteEn: "",
	url: "",
	demo: true,
	published: false
});
function PartnersDesk() {
	const { t } = useI18n();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)(emptyPartner());
	(0, import_react.useEffect)(() => {
		adminPartners().then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: t("لا تُنشر جهة إلا بعد اتفاق حقيقي. الرابط إن وُجد يبدأ بـ https.", "Publish a party only after a real agreement. A link, if any, starts with https.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerForm, {
				value: draft,
				onChange: setDraft,
				label: t("إضافة", "Add"),
				onSubmit: () => {
					adminSavePartner({ data: draft }).then((next) => {
						setRows(next);
						setDraft(emptyPartner());
					}).catch((e) => setError(e instanceof Error ? e.message : "Error"));
				}
			}),
			rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerEditor, {
				row,
				onSaved: setRows,
				onError: setError
			}, row.id))
		]
	});
}
function PartnerEditor({ row, onSaved, onError }) {
	const [value, setValue] = (0, import_react.useState)(row);
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerForm, {
		value,
		onChange: setValue,
		label: t("تحديث", "Update"),
		onSubmit: () => {
			adminSavePartner({ data: value }).then(onSaved).catch((e) => onError(e instanceof Error ? e.message : "Error"));
		}
	});
}
function PartnerForm({ value, onChange, onSubmit, label }) {
	const { t } = useI18n();
	const set = (patch) => onChange({
		...value,
		...patch
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-2 rounded-2xl border border-line bg-surface p-4 md:grid-cols-2",
		onSubmit: (e) => {
			e.preventDefault();
			onSubmit();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: t("الاسم عربي", "Arabic name"),
				value: value.nameAr,
				onChange: (e) => set({ nameAr: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: t("الاسم إنجليزي", "English name"),
				value: value.nameEn,
				onChange: (e) => set({ nameEn: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: t("ملاحظة", "Note"),
				value: value.noteAr,
				onChange: (e) => set({ noteAr: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: "Note",
				value: value.noteEn,
				onChange: (e) => set({ noteEn: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: "https://",
				value: value.url,
				onChange: (e) => set({ url: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: value.demo,
					onChange: (e) => set({ demo: e.target.checked })
				}), t("تجريبي", "Demo")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: value.published,
					onChange: (e) => set({ published: e.target.checked })
				}), t("منشور", "Published")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
				type: "submit",
				children: label
			})
		]
	});
}
function ComplaintsDesk() {
	const { lang, t } = useI18n();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [reply, setReply] = (0, import_react.useState)({});
	const [status, setStatus] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		adminComplaints().then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error }),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: t("لا شكاوى بعد.", "No complaints yet.")
			}) : null,
			rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl border border-line bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-medium tabular-nums",
						children: [
							row.reference,
							" · ",
							row.topic
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							row.name,
							" · ",
							row.phone,
							" · ",
							row.createdAt
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: row.message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: `${inputClass} mt-3 min-h-20 py-2`,
						value: reply[row.id] ?? row.reply,
						onChange: (e) => setReply({
							...reply,
							[row.id]: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: inputClass,
							value: status[row.id] ?? row.status,
							onChange: (e) => setStatus({
								...status,
								[row.id]: e.target.value
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "received",
									children: "received"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "reviewing",
									children: "reviewing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "closed",
									children: "closed"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
							onClick: () => {
								adminReplyComplaint({ data: {
									id: row.id,
									reply: reply[row.id] ?? row.reply,
									status: status[row.id] ?? row.status
								} }).then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
							},
							children: lang === "ar" ? "حفظ الرد" : "Save reply"
						})]
					})
				]
			}, row.id))
		]
	});
}
function CustomersDesk() {
	const { lang, t } = useI18n();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		adminCustomers().then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: t("حسابات بدور عميل فقط. تغيير الدور يتم من صلاحيات مدير النظام.", "Customer-role accounts only. Role changes stay with the system admin.")
			}),
			rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-line bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: row.displayName || row.userId
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						row.phone || t("بلا هاتف", "No phone"),
						" · ",
						roleLabel(row.role, lang),
						" · ",
						row.createdAt
					]
				})]
			}, row.userId))
		]
	});
}
var emptyJob = () => ({
	id: 0,
	titleAr: "",
	titleEn: "",
	cityAr: "",
	cityEn: "",
	bodyAr: "",
	bodyEn: "",
	published: false
});
function JobsDesk() {
	const { t } = useI18n();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)(emptyJob());
	(0, import_react.useEffect)(() => {
		adminJobs().then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Error"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskError, { error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobForm, {
				value: draft,
				onChange: setDraft,
				label: t("إضافة وظيفة", "Add role"),
				onSubmit: () => {
					adminSaveJob({ data: draft }).then((next) => {
						setRows(next);
						setDraft(emptyJob());
					}).catch((e) => setError(e instanceof Error ? e.message : "Error"));
				}
			}),
			rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobEditor, {
				row,
				onSaved: setRows,
				onError: setError
			}, row.id))
		]
	});
}
function JobEditor({ row, onSaved, onError }) {
	const [value, setValue] = (0, import_react.useState)(row);
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobForm, {
		value,
		onChange: setValue,
		label: t("تحديث", "Update"),
		onSubmit: () => {
			adminSaveJob({ data: value }).then(onSaved).catch((e) => onError(e instanceof Error ? e.message : "Error"));
		}
	});
}
function JobForm({ value, onChange, onSubmit, label }) {
	const { t } = useI18n();
	const set = (patch) => onChange({
		...value,
		...patch
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-2 rounded-2xl border border-line bg-surface p-4",
		onSubmit: (e) => {
			e.preventDefault();
			onSubmit();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: t("المسمى", "Title"),
				value: value.titleAr,
				onChange: (e) => set({ titleAr: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: "Title",
				value: value.titleEn,
				onChange: (e) => set({ titleEn: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: t("المدينة", "City"),
				value: value.cityAr,
				onChange: (e) => set({ cityAr: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				placeholder: "City",
				value: value.cityEn,
				onChange: (e) => set({ cityEn: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: `${inputClass} min-h-24 py-3`,
				value: value.bodyAr,
				onChange: (e) => set({ bodyAr: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: `${inputClass} min-h-24 py-3`,
				value: value.bodyEn,
				onChange: (e) => set({ bodyEn: e.target.value })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: value.published,
					onChange: (e) => set({ published: e.target.checked })
				}), t("منشور", "Published")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
				type: "submit",
				children: label
			})
		]
	});
}
//#endregion
export { AdminPage as component };
