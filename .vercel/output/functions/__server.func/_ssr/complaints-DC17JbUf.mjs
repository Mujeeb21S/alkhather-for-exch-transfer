import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { X as lookupComplaint, it as submitComplaint, lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { a as PageIntro, c as PrimaryButton, i as Field, l as inputClass, o as Panel, r as ErrorNote } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/complaints-DC17JbUf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TOPICS = [
	[
		"service",
		"خدمة",
		"Service"
	],
	[
		"transfer",
		"حوالة",
		"Transfer"
	],
	[
		"branch",
		"فرع أو وكيل",
		"Branch or agent"
	],
	[
		"staff",
		"موظف",
		"Staff"
	],
	[
		"fraud",
		"اشتباه احتيال",
		"Suspected fraud"
	],
	[
		"other",
		"أخرى",
		"Other"
	]
];
var STATUS = {
	received: ["وُجدت", "Received"],
	reviewing: ["قيد المراجعة", "In review"],
	closed: ["مغلقة", "Closed"]
};
function ComplaintsPage() {
	const { lang, t } = useI18n();
	const key = (0, import_react.useRef)(Math.random().toString(36).slice(2) + Date.now().toString(36));
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [issued, setIssued] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		phone: "",
		email: "",
		topic: "service",
		message: "",
		companyWebsite: ""
	});
	const [trackRef, setTrackRef] = (0, import_react.useState)("");
	const [trackPin, setTrackPin] = (0, import_react.useState)("");
	const [trackError, setTrackError] = (0, import_react.useState)("");
	const [track, setTrack] = (0, import_react.useState)(null);
	async function onSubmit(e) {
		e.preventDefault();
		setPending(true);
		setError("");
		try {
			const result = await submitComplaint({ data: {
				...form,
				idempotencyKey: key.current
			} });
			if (result.duplicate || !result.reference) {
				setError(t("أُرسل هذا النموذج من قبل. إن لم تحتفظ بالرمز قدّم طلباً جديداً من جلسة أخرى.", "This form was already sent. If you did not keep the code, submit again from a new session."));
				return;
			}
			setIssued({
				reference: result.reference,
				pin: result.pin
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : t("تعذر الإرسال", "Could not send"));
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t("خدمة العملاء", "Customer desk"),
		title: t("الشكاوى والبلاغات", "Complaints"),
		body: t("يُحفظ الطلب لدى خدمة العملاء. يظهر الرقم والرمز مرة واحدة. المتابعة لا تكشف نص الشكوى للزائر، بل الحالة والرد.", "The request is kept by customer service. The reference and code are shown once. Follow-up does not reveal the complaint text to a visitor, only the status and reply.")
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-4 px-4 py-12 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: issued ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: t("احتفظ بهذين الرقمين", "Keep both numbers")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: t("لن يُعرض الرمز مرة أخرى.", "The code will not be shown again.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-display text-3xl tabular-nums",
				id: "complaint-ref",
				children: issued.reference
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-display text-3xl tabular-nums",
				children: issued.pin
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 rounded-full border border-line px-4 text-sm",
					onClick: () => navigator.clipboard.writeText(`${issued.reference} ${issued.pin}`),
					children: t("نسخ", "Copy")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 rounded-full border border-line px-4 text-sm",
					onClick: () => window.print(),
					children: t("طباعة الإيصال", "Print the receipt")
				})]
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-3",
			onSubmit,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t("الاسم", "Name"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						required: true,
						value: form.name,
						onChange: (e) => setForm({
							...form,
							name: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t("الهاتف", "Phone"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						required: true,
						value: form.phone,
						onChange: (e) => setForm({
							...form,
							phone: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t("البريد، اختياري", "Email, optional"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						type: "email",
						value: form.email,
						onChange: (e) => setForm({
							...form,
							email: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t("النوع", "Topic"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: inputClass,
						value: form.topic,
						onChange: (e) => setForm({
							...form,
							topic: e.target.value
						}),
						children: TOPICS.map(([id, ar, en]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: id,
							children: lang === "ar" ? ar : en
						}, id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t("التفاصيل", "Details"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: `${inputClass} min-h-32 py-3`,
						required: true,
						value: form.message,
						onChange: (e) => setForm({
							...form,
							message: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "absolute -left-[9999px]",
					"aria-hidden": "true",
					children: ["Website", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						tabIndex: -1,
						autoComplete: "off",
						value: form.companyWebsite,
						onChange: (e) => setForm({
							...form,
							companyWebsite: e.target.value
						})
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { children: error }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
					type: "submit",
					disabled: pending,
					children: pending ? t("جارٍ الإرسال…", "Sending…") : t("تسجيل الشكوى", "File the complaint")
				})
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: t("متابعة شكوى", "Track a complaint")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 grid gap-3",
				onSubmit: async (e) => {
					e.preventDefault();
					setTrackError("");
					setTrack(null);
					try {
						const next = await lookupComplaint({ data: {
							reference: trackRef,
							pin: trackPin
						} });
						setTrack(next);
						if (!next.ok) setTrackError(t("تعذر التحقق.", "Could not verify."));
					} catch (err) {
						setTrackError(err instanceof Error ? err.message : t("تعذر الاستعلام", "Lookup failed"));
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("رقم الشكوى", "Complaint number"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: trackRef,
							onChange: (e) => setTrackRef(e.target.value),
							autoComplete: "off"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("الرمز", "Code"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: trackPin,
							onChange: (e) => setTrackPin(e.target.value),
							inputMode: "numeric",
							autoComplete: "off"
						})
					}),
					trackError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { children: trackError }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						type: "submit",
						children: t("عرض الحالة", "Show status")
					})
				]
			}),
			track?.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-2xl bg-paper p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl",
						children: lang === "ar" ? STATUS[track.status]?.[0] : STATUS[track.status]?.[1]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: track.reply || t("لا رد منشوراً بعد.", "No reply published yet.")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs tabular-nums text-muted",
						children: track.createdAt
					})
				]
			}) : null
		] })]
	})] });
}
//#endregion
export { ComplaintsPage as component };
