import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { at as submitInquiry, lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { y as Route$37 } from "./router-DlFaDcyt.mjs";
import { a as PageIntro, c as PrimaryButton, i as Field, l as inputClass, o as Panel, r as ErrorNote, s as PhoneLines } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-B6yqtpos.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TOPICS = [
	[
		"general",
		"استفسار عام",
		"General"
	],
	[
		"rates",
		"أسعار الصرف",
		"Rates"
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
		"corporate",
		"شركات وتجار",
		"Corporate"
	],
	[
		"complaint",
		"ملاحظة أو شكوى",
		"Complaint"
	]
];
function ContactPage() {
	const { settings } = Route$37.useLoaderData();
	const { lang, t } = useI18n();
	const text = (ar, en) => lang === "ar" ? ar : en;
	const key = (0, import_react.useRef)(Math.random().toString(36).slice(2) + Date.now().toString(36));
	const [pending, setPending] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		phone: "",
		email: "",
		topic: "general",
		message: "",
		companyWebsite: ""
	});
	async function onSubmit(e) {
		e.preventDefault();
		setPending(true);
		setError("");
		try {
			await submitInquiry({ data: {
				...form,
				idempotencyKey: key.current
			} });
			setDone(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : t("تعذر الإرسال", "Could not send"));
		} finally {
			setPending(false);
		}
	}
	const channels = [
		[t("الهاتف", "Phone"), settings.phone],
		[t("البريد", "Email"), settings.email],
		[t("العنوان", "Address"), text(settings.addressAr, settings.addressEn)],
		[t("واتساب", "WhatsApp"), settings.whatsapp]
	].filter(([, value]) => value.trim());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t("خدمة العملاء", "Customer desk"),
		title: t("تواصل معنا", "Contact"),
		body: text(settings.replySlaAr, settings.replySlaEn) || t("خدمة العملاء 712720300.", "Customer service 712720300."),
		crumbs: [{
			href: "/",
			label: t("الرئيسية", "Home")
		}, {
			href: "/contact",
			label: t("تواصل", "Contact")
		}]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-4 px-4 py-12 lg:grid-cols-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			className: "lg:col-span-3",
			children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-lg",
				children: t("وصل طلبك.", "Your request arrived.")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3",
				onSubmit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("الاسم", "Name"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.name,
							onChange: (e) => setForm({
								...form,
								name: e.target.value
							}),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("الهاتف", "Phone"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.phone,
							onChange: (e) => setForm({
								...form,
								phone: e.target.value
							}),
							required: true
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
						label: t("نوع الاستفسار", "Topic"),
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
						label: t("الرسالة", "Message"),
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "hidden",
						tabIndex: -1,
						autoComplete: "off",
						value: form.companyWebsite,
						onChange: (e) => setForm({
							...form,
							companyWebsite: e.target.value
						})
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { children: error }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						type: "submit",
						disabled: pending,
						children: pending ? t("جارٍ الإرسال…", "Sending…") : t("إرسال", "Send")
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "lg:col-span-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl",
					children: "712720300"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: t("خدمة العملاء", "Customer service")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "tel:+967712720300",
						className: "text-primary",
						children: t("اتصال", "Call")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://wa.me/967712720300",
						className: "text-primary",
						children: "WhatsApp"
					})]
				}),
				channels.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 grid gap-3 text-sm",
					children: channels.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: value })] }, label))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "mt-6 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer font-medium",
						children: t("أرقام الإدارة", "Administration numbers")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneLines, { value: "06304990 06304991 711555724 777555724" })]
				})
			]
		})]
	})] });
}
//#endregion
export { ContactPage as component };
