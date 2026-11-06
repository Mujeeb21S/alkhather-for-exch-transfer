import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as formatMoney } from "./queries.server-CYegzkZO.mjs";
import { $ as myTickets, B as createTicket, Q as myNotices, R as attachTransfer, ct as useCurrentUserState, et as myTransfers, lt as useI18n, nt as saveProfile, r as RedirectToSignIn, st as syncProfile, tt as readNotice } from "./shell-DdDjRdsi.mjs";
import { c as PrimaryButton, i as Field, l as inputClass, n as EmptyState, r as ErrorNote, t as DemoMark } from "./ui-YTjt0IH-.mjs";
import { a as statusLabel, i as roleLabel } from "./labels-Aw3jd-vz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal-upqX_Mct.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PortalPage() {
	const { user, isPending } = useCurrentUserState();
	const { lang, t } = useI18n();
	const [tab, setTab] = (0, import_react.useState)("home");
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [transfers, setTransfers] = (0, import_react.useState)([]);
	const [notices, setNotices] = (0, import_react.useState)([]);
	const [tickets, setTickets] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!user?.id) return;
		let gone = false;
		setLoading(true);
		syncProfile({ data: { name: user.displayName ?? "" } }).then(async (next) => {
			if (gone) return;
			setProfile(next);
			const [a, b, c] = await Promise.all([
				myTransfers(),
				myNotices(),
				myTickets()
			]);
			if (gone) return;
			setTransfers(a);
			setNotices(b);
			setTickets(c);
		}).catch((err) => {
			if (!gone) setError(err instanceof Error ? err.message : "Error");
		}).finally(() => {
			if (!gone) setLoading(false);
		});
		return () => {
			gone = true;
		};
	}, [user?.id, user?.displayName]);
	if (isPending || user && loading && !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-5xl px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-2xl bg-line" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const tabs = [
		["home", t("ملخص", "Overview")],
		["transfers", t("حوالاتي", "Transfers")],
		["notices", t("الإشعارات", "Notices")],
		["support", t("الدعم", "Support")],
		["profile", t("الملف", "Profile")]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-gold",
				children: t("بوابة العميل", "Customer portal")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: profile?.displayName || user.displayName || t("حسابي", "My account")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					t("الدور:", "Role:"),
					" ",
					roleLabel(profile?.role ?? "customer", lang),
					".",
					" ",
					t("التحقق برسالة نصية غير مفعّل حتى اعتماد مزوّد رسائل. رقم الهاتف المحفوظ ليس رقماً موثّقاً.", "SMS verification is off until a message provider is approved. A saved phone is not a verified phone.")
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { children: error })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex gap-2 overflow-x-auto",
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
					tab === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: t("حوالات مرتبطة", "Linked transfers"),
								value: String(transfers.length)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: t("إشعارات غير مقروءة", "Unread notices"),
								value: String(notices.filter((n) => !n.readAt).length)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: t("طلبات دعم", "Support requests"),
								value: String(tickets.length)
							})
						]
					}) : null,
					tab === "transfers" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransfersPanel, {
						rows: transfers,
						onLinked: setTransfers,
						lang
					}) : null,
					tab === "notices" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoticesPanel, {
						rows: notices,
						onChange: setNotices
					}) : null,
					tab === "support" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportPanel, {
						rows: tickets,
						onChange: setTickets
					}) : null,
					tab === "profile" && profile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePanel, {
						profile,
						onChange: setProfile
					}) : null
				]
			})
		]
	});
}
function Stat({ label, value }) {
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
function TransfersPanel({ rows, onLinked, lang }) {
	const { t } = useI18n();
	const [reference, setReference] = (0, import_react.useState)("");
	const [pin, setPin] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-3 rounded-2xl border border-line bg-surface p-5 md:grid-cols-3",
			onSubmit: async (e) => {
				e.preventDefault();
				setPending(true);
				setError("");
				try {
					onLinked(await attachTransfer({ data: {
						reference,
						pin
					} }));
					setReference("");
					setPin("");
				} catch (err) {
					setError(err instanceof Error ? err.message : "Error");
				} finally {
					setPending(false);
				}
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t("رقم الحوالة", "Reference"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						value: reference,
						onChange: (e) => setReference(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t("رمز التحقق", "Code"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						value: pin,
						onChange: (e) => setPin(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "self-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						type: "submit",
						disabled: pending,
						children: t("ربط بالحساب", "Link to account")
					})
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { children: error })
				}) : null
			]
		}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: t("لا حوالات مرتبطة", "No linked transfers"),
			body: t("الربط يتم برقم ورمز صحيحين. بعدها تظهر التفاصيل لصاحب الحساب فقط.", "Linking needs a valid reference and code. Details then appear only for this account.")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3",
			children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-2xl border border-line bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium tabular-nums",
								children: row.reference
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: statusLabel(row.status, lang) }),
							row.demo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoMark, { children: t("تجريبي", "Sample") }) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 tabular-nums",
						children: [
							formatMoney(row.amount),
							" ",
							row.currency
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							row.senderName,
							" → ",
							row.beneficiaryName
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							lang === "ar" ? row.pickupCityAr : row.pickupCityEn,
							" · ",
							row.updatedAt
						]
					})
				]
			}, row.id))
		})]
	});
}
function NoticesPanel({ rows, onChange }) {
	const { lang, t } = useI18n();
	if (!rows.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: t("لا إشعارات", "No notices"),
		body: t("يصل إشعار عند ربط حوالة أو عند رد الدعم.", "A notice arrives when a transfer is linked or support replies.")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "grid gap-3",
		children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-2xl border border-line bg-surface p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: lang === "ar" ? row.titleAr : row.titleEn
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: lang === "ar" ? row.bodyAr : row.bodyEn
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted tabular-nums",
					children: row.createdAt
				}),
				!row.readAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-3 text-sm text-primary",
					onClick: () => void readNotice({ data: row.id }).then(onChange),
					children: t("تعليم كمقروء", "Mark read")
				}) : null
			]
		}, row.id))
	});
}
function SupportPanel({ rows, onChange }) {
	const { t } = useI18n();
	const [subject, setSubject] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const key = `t-${subject.length}-${body.length}-${rows.length}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-3 rounded-2xl border border-line bg-surface p-5",
			onSubmit: async (e) => {
				e.preventDefault();
				setPending(true);
				setError("");
				try {
					onChange(await createTicket({ data: {
						subject,
						body,
						key: `${Date.now()}-${subject.slice(0, 12)}`
					} }));
					setSubject("");
					setBody("");
				} catch (err) {
					setError(err instanceof Error ? err.message : "Error");
				} finally {
					setPending(false);
				}
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t("الموضوع", "Subject"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						value: subject,
						onChange: (e) => setSubject(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t("التفاصيل", "Details"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: `${inputClass} min-h-28 py-3`,
						value: body,
						onChange: (e) => setBody(e.target.value)
					})
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { children: error }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
					type: "submit",
					disabled: pending,
					children: t("إرسال طلب", "Send request")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden",
					children: key
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3",
			children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-2xl border border-line bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: row.subject
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: row.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted",
						children: [
							row.status,
							" · ",
							row.createdAt
						]
					}),
					row.reply ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 rounded-xl bg-paper p-3 text-sm",
						children: row.reply
					}) : null
				]
			}, row.id))
		})]
	});
}
function ProfilePanel({ profile, onChange }) {
	const { t } = useI18n();
	const [displayName, setDisplayName] = (0, import_react.useState)(profile.displayName);
	const [phone, setPhone] = (0, import_react.useState)(profile.phone);
	const [error, setError] = (0, import_react.useState)("");
	const [ok, setOk] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid max-w-lg gap-3 rounded-2xl border border-line bg-surface p-5",
		onSubmit: async (e) => {
			e.preventDefault();
			setError("");
			setOk(false);
			try {
				onChange(await saveProfile({ data: {
					displayName,
					phone
				} }));
				setOk(true);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error");
			}
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("الاسم الظاهر", "Display name"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputClass,
					value: displayName,
					onChange: (e) => setDisplayName(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("الهاتف", "Phone"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputClass,
					value: phone,
					onChange: (e) => setPhone(e.target.value)
				})
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { children: error }) : null,
			ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-up",
				children: t("حُفظ الملف. الهاتف غير موثّق.", "Saved. The phone is not verified.")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
				type: "submit",
				children: t("حفظ", "Save")
			})
		]
	});
}
//#endregion
export { PortalPage as component };
