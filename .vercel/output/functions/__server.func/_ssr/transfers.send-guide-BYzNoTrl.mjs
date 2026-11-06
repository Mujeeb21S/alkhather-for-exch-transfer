import { T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { a as PageIntro } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/transfers.send-guide-BYzNoTrl.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		title: t("دليل الإرسال", "How to send"),
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
				href: "/transfers/send-guide",
				label: t("الإرسال", "Send")
			}
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-3xl gap-3 px-4 py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "soft-card p-4",
			children: t("تُنشأ الحوالة في الفرع. يسلّمك الموظف رقماً ورمزاً. لا يُرسل مبلغ من هذه الصفحة.", "A transfer is created at the branch. The teller gives you a reference and a code. This page does not send money.")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/branches",
			className: "text-primary",
			children: t("اختر الفرع", "Choose a branch")
		})]
	})] });
}
//#endregion
export { Page as component };
