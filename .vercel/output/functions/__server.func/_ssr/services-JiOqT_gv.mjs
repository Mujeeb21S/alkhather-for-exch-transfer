import { T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { a as Route$15 } from "./router-DlFaDcyt.mjs";
import { a as PageIntro } from "./ui-YTjt0IH-.mjs";
import { t as ServiceMenu } from "./services-menu-Dttz2giE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services-JiOqT_gv.js
var import_jsx_runtime = require_jsx_runtime();
function ServicesPage() {
	const { services } = Route$15.useLoaderData();
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t("ما نقدمه", "What we offer"),
		title: t("خدماتنا", "Our services"),
		body: t("الخدمات كما تعتمدها الشركة. تحويل العملات وتتبع الحوالة والشكاوى تفتح أدواتها مباشرة، والتنفيذ المالي يبقى في نقطة الخدمة.", "Services as the company lists them. Currency conversion, transfer tracking, and complaints open their tools directly. The financial transaction stays at the service point.")
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceMenu, { services })
	})] });
}
//#endregion
export { ServicesPage as component };
