import { T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n, t as Fa } from "./shell-DdDjRdsi.mjs";
import { l as Route$19 } from "./router-DlFaDcyt.mjs";
import { a as PageIntro, d as openNow, s as PhoneLines, u as mapsSearch } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/branches._slug-nYL3BHmb.js
var import_jsx_runtime = require_jsx_runtime();
function BranchPage() {
	const branch = Route$19.useLoaderData();
	const { lang, t } = useI18n();
	const text = (ar, en) => lang === "ar" ? ar : en;
	const open = openNow(text(branch.hoursAr, branch.hoursEn));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: text(branch.cityAr, branch.cityEn),
		title: text(branch.nameAr, branch.nameEn),
		body: text(branch.addressAr, branch.addressEn),
		crumbs: [
			{
				href: "/",
				label: t("الرئيسية", "Home")
			},
			{
				href: "/branches",
				label: t("الفروع", "Branches")
			},
			{
				href: `/branches/${branch.slug}`,
				label: text(branch.nameAr, branch.nameEn)
			}
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-3xl gap-4 px-4 py-12",
		children: [
			branch.photoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: branch.photoUrl,
				alt: "",
				className: "w-full rounded-3xl object-cover"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneLines, { value: branch.phone }),
			branch.hoursAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [text(branch.hoursAr, branch.hoursEn), open == null ? "" : open ? t(" · مفتوح الآن", " · Open now") : t(" · مغلق الآن", " · Closed now")] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				className: "inline-flex min-h-11 items-center gap-2 text-primary",
				href: mapsSearch(`${text(branch.addressAr, branch.addressEn)} ${text(branch.cityAr, branch.cityEn)}`),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "location-dot" }), t("افتح في خرائط جوجل", "Open in Google Maps")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				className: "inline-flex min-h-11 items-center gap-2 text-primary",
				href: "https://wa.me/967712720300",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
					name: "whatsapp",
					brand: true
				}), t("واتساب خدمة العملاء", "Customer-service WhatsApp")]
			})
		]
	})] });
}
//#endregion
export { BranchPage as component };
