import { T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n, t as Fa } from "./shell-DdDjRdsi.mjs";
import { d as Route$23 } from "./router-DlFaDcyt.mjs";
import { a as PageIntro } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools-C9delb2n.js
var import_jsx_runtime = require_jsx_runtime();
function ToolsPage() {
	const data = Route$23.useLoaderData();
	const { t } = useI18n();
	const items = [
		[
			"/transfers/track",
			"magnifying-glass",
			t("تتبع حوالة", "Track a transfer"),
			t("الحالة والعملة ومدينة الاستلام فقط.", "Status, currency, and pickup city only.")
		],
		[
			"/transfers/receive-guide",
			"hand-holding-dollar",
			t("دليل الاستلام", "How to receive"),
			t("خطوات الاستلام في نقطة الخدمة.", "How pickup works at a service point.")
		],
		[
			"/transfers/send-guide",
			"paper-plane",
			t("دليل الإرسال", "How to send"),
			t("الحوالة تُنشأ في الفرع، لا من الموقع.", "A transfer is created at a branch, not on the site.")
		],
		[
			"/complaints",
			"comment-dots",
			t("شكوى أو مقترح", "Complaint or suggestion"),
			t("رقم متابعة بعد التسجيل.", "A follow-up number after you file it.")
		],
		...data.ratesLive ? [[
			"/rates",
			"coins",
			t("الأسعار والمحوّل", "Rates and converter"),
			t("الأسعار المعتمدة حالياً.", "Rates currently published.")
		]] : []
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t("أدوات", "Tools"),
		title: t("متابعة وتواصل", "Follow-up and contact"),
		crumbs: [{
			href: "/",
			label: t("الرئيسية", "Home")
		}, {
			href: "/tools",
			label: t("أدوات", "Tools")
		}]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mx-auto grid max-w-3xl gap-3 px-4 py-12",
		children: items.map(([href, icon, title, body]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href,
			className: "soft-card flex items-start gap-3 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
				name: icon,
				className: "mt-1 text-gold"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-medium",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-sm text-muted",
				children: body
			})] })]
		}) }, href))
	})] });
}
//#endregion
export { ToolsPage as component };
