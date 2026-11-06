import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { u as Route$21 } from "./router-DlFaDcyt.mjs";
import { a as PageIntro } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trust-Co8aAc5i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [[
	"license",
	"الترخيص",
	"License"
], [
	"fraud",
	"الاحتيال",
	"Fraud"
]];
function TrustPage() {
	const data = Route$21.useLoaderData();
	const { lang, t } = useI18n();
	const [tab, setTab] = (0, import_react.useState)("license");
	const approved = new Set(data.publication.approvedPages);
	const extra = [
		[
			"privacy",
			"/privacy",
			"الخصوصية",
			"Privacy"
		],
		[
			"terms",
			"/terms",
			"الشروط",
			"Terms"
		],
		[
			"compliance",
			"/compliance",
			"الامتثال",
			"Compliance"
		],
		[
			"aml",
			"/aml",
			"مكافحة غسل الأموال",
			"AML"
		],
		[
			"kyc",
			"/kyc",
			"اعرف عميلك",
			"KYC"
		]
	].filter(([slug]) => approved.has(slug));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t("الثقة", "Trust"),
		title: t("الترخيص والأمان", "License and safety"),
		crumbs: [{
			href: "/",
			label: t("الرئيسية", "Home")
		}, {
			href: "/trust",
			label: t("الثقة", "Trust")
		}]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-3xl gap-4 px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: TABS.map(([id, ar, en]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: `min-h-11 rounded-full px-4 text-sm ${tab === id ? "bg-primary text-surface" : "border border-line bg-surface"}`,
					children: lang === "ar" ? ar : en
				}, id))
			}),
			tab === "license" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "soft-card grid gap-3 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("ترخيص رقم 486 صادر عن البنك المركزي اليمني.", "License No. 486, issued by the Central Bank of Yemen.") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("السند: القانون رقم 14 لسنة 2000.", "Basis: Law No. 14 of 2000.") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("المكتب الرئيسي: مأرب، الشارع العام، جوار مؤسسة الكهرباء.", "Head office: Marib, Main Street, beside the Electricity Corporation.") }),
					data.settings.foundedOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: data.settings.foundedOn }) : null,
					data.settings.licenseImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: data.settings.licenseImage,
						alt: t("شهادة الترخيص", "License certificate"),
						className: "max-h-80 rounded-2xl"
					}) : null
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "soft-card grid gap-3 p-5 leading-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("لا تشارك رمز الحوالة في مكالمة أو رسالة من رقم غير منشور على هذا الموقع.", "Do not share a transfer code on a call or message from a number that is not published on this site.") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("من يطلب الرمز ثم يطلب تحويل رسم إلى حساب شخصي لإتمام الاستلام، لا تتابعه. الرسم إن وُجد يُذكر في نقطة الخدمة.", "If someone asks for the code and then for a fee sent to a personal account, stop. Any fee is stated at the service point.") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("رسالة باسم الشركة من رقم لا يطابق صفحة الفروع ليست قناة رسمية.", "A message in the company's name from a number that does not match the branches page is not an official channel.") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("القنوات الرسمية هي أرقام الفروع المنشورة وخدمة العملاء 712720300 وواتساب الرقم نفسه.", "Official channels are the published branch numbers and customer service 712720300, including WhatsApp on that number.") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("للتحقق من رقم فرع، طابقه مع صفحة الفروع قبل التحويل.", "To check a branch number, match it with the branches page before you send money.") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/complaints",
						className: "text-primary underline-offset-4 hover:underline",
						children: t("أبلغ عن اشتباه", "Report a concern")
					})
				]
			}),
			extra.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-wrap gap-3 text-sm",
				children: extra.map(([slug, href, ar, en]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href,
					className: "text-primary underline-offset-4 hover:underline",
					children: lang === "ar" ? ar : en
				}) }, slug))
			}) : null
		]
	})] });
}
//#endregion
export { TrustPage as component };
