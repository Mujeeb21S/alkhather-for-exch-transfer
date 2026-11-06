import { T as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n } from "./_ssr/shell-DdDjRdsi.mjs";
import { s as Route$17 } from "./_ssr/router-DlFaDcyt.mjs";
import { a as PageIntro } from "./_ssr/ui-YTjt0IH-.mjs";
import { r as newsKindLabel } from "./_ssr/labels-Aw3jd-vz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-Dz9P9Zzm.js
var import_jsx_runtime = require_jsx_runtime();
function NewsArticle() {
	const item = Route$17.useLoaderData();
	const { lang, t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: newsKindLabel(item.kind, lang),
		title: lang === "ar" ? item.titleAr : item.titleEn,
		body: item.publishedAt,
		crumbs: [
			{
				href: "/",
				label: t("الرئيسية", "Home")
			},
			{
				href: "/news",
				label: t("الأخبار", "News")
			},
			{
				href: `/news/${item.slug}`,
				label: lang === "ar" ? item.titleAr : item.titleEn
			}
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "mx-auto max-w-3xl whitespace-pre-wrap px-4 py-12 leading-8",
		children: lang === "ar" ? item.bodyAr : item.bodyEn
	})] });
}
//#endregion
export { NewsArticle as component };
