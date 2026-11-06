import { T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { n as Route$1 } from "./router-DlFaDcyt.mjs";
import { a as PageIntro } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/transfers.networks._slug-n6HVJXjN.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const partner = Route$1.useLoaderData();
	const { lang, t } = useI18n();
	const name = lang === "ar" ? partner.nameAr : partner.nameEn;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t("الشبكات", "Networks"),
		title: name,
		body: t("الاستلام يتم في نقاط الخدمة المنشورة بعد التحقق من الهوية والرمز.", "Pickup is at a published service point after identification and the code are checked."),
		crumbs: [
			{
				href: "/",
				label: t("الرئيسية", "Home")
			},
			{
				href: "/partners",
				label: t("الشركاء", "Partners")
			},
			{
				href: `/transfers/networks/${partner.slug}`,
				label: name
			}
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl gap-4 px-4 py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/branches",
			className: "text-primary",
			children: t("نقاط الخدمة", "Service points")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/transfers/track",
			className: "text-primary",
			children: t("تتبع الحوالة", "Track")
		})]
	})] });
}
//#endregion
export { Page as component };
