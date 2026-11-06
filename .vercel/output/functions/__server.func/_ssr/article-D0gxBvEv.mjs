import { T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { a as PageIntro } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/article-D0gxBvEv.js
var import_jsx_runtime = require_jsx_runtime();
function ManagedArticle({ page }) {
	const { lang, t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t("الخضر للصرافة", "Al Khadher"),
		title: lang === "ar" ? page.titleAr : page.titleEn
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "mx-auto max-w-3xl px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "whitespace-pre-wrap leading-8",
			children: lang === "ar" ? page.bodyAr : page.bodyEn
		})
	})] });
}
//#endregion
export { ManagedArticle as t };
