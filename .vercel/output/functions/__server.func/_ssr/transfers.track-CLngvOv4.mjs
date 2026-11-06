import { T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { a as PageIntro, o as Panel } from "./ui-YTjt0IH-.mjs";
import { n as TrackBox } from "./tools-BYCUI5lb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/transfers.track-CLngvOv4.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		title: t("تتبع حوالتك", "Track your transfer"),
		kicker: t("الحوالات", "Transfers"),
		body: t("لا تشارك الرمز. النتيجة حالة وعملة ومدينة استلام فقط.", "Do not share the code. The result is status, currency, and pickup city only."),
		crumbs: [{
			href: "/",
			label: t("الرئيسية", "Home")
		}, {
			href: "/transfers/track",
			label: t("التتبع", "Track")
		}]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-xl px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackBox, {}) })
	})] });
}
//#endregion
export { Page as component };
