import { T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { a as PageIntro } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/transfers.receive-guide-BTOMmTb1.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { t } = useI18n();
	const steps = [
		t("راجع حالة الحوالة بالرقم والرمز.", "Check the transfer with its reference and code."),
		t("توجّه إلى مدينة الاستلام الظاهرة بعد التحقق.", "Go to the pickup city shown after verification."),
		t("أبرز هويتك والرمز في نقطة الخدمة.", "Show your identification and the code at the service point.")
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		title: t("دليل الاستلام", "How to receive"),
		kicker: t("الحوالات", "Transfers"),
		crumbs: [
			{
				href: "/",
				label: t("الرئيسية", "Home")
			},
			{
				href: "/transfers",
				label: t("الحوالات", "Transfers")
			},
			{
				href: "/transfers/receive-guide",
				label: t("الاستلام", "Receive")
			}
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
		className: "mx-auto grid max-w-3xl gap-3 px-4 py-12",
		children: [steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "soft-card p-4",
			children: step
		}, step)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/branches",
			className: "text-primary",
			children: t("نقاط الخدمة", "Service points")
		})]
	})] });
}
//#endregion
export { Page as component };
