import { T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { c as Route$18 } from "./router-DlFaDcyt.mjs";
import { a as PageIntro } from "./ui-YTjt0IH-.mjs";
import { r as newsKindLabel } from "./labels-Aw3jd-vz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/news-4cTyUgOD.js
var import_jsx_runtime = require_jsx_runtime();
function NewsIndex() {
	const { news } = Route$18.useLoaderData();
	const { lang, t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t("المحتوى", "Editorial"),
		title: t("الأخبار والإعلانات", "News and notices")
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mx-auto grid max-w-6xl gap-4 px-4 py-12",
		children: news.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/news/$slug",
			params: { slug: item.slug },
			className: "block rounded-2xl border border-line bg-surface p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs text-gold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: item.publishedAt
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: newsKindLabel(item.kind, lang) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-3xl",
					children: lang === "ar" ? item.titleAr : item.titleEn
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted",
					children: lang === "ar" ? item.excerptAr : item.excerptEn
				})
			]
		}) }, item.slug))
	})] });
}
//#endregion
export { NewsIndex as component };
