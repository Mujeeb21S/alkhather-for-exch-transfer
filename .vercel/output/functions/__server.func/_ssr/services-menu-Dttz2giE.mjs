import { T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { n as ServicePhoto, t as ServiceGlyph } from "./service-visual-Cq0Buso_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services-menu-Dttz2giE.js
var import_jsx_runtime = require_jsx_runtime();
var MAIN = ["individuals", "corporate"];
var AID = [
	"aid-cash",
	"aid-guarantor",
	"aid-deposit"
];
function ServiceMenu({ services }) {
	const { lang, t } = useI18n();
	const text = (ar, en) => lang === "ar" ? ar : en;
	const by = new Map(services.map((service) => [service.slug, service]));
	const main = MAIN.map((slug) => by.get(slug)).filter((service) => Boolean(service));
	const aid = AID.map((slug) => by.get(slug)).filter((service) => Boolean(service));
	const parent = by.get("humanitarian");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: main.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceCard, { service }, service.slug))
		}), parent || aid.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-3xl",
					children: parent ? text(parent.titleAr, parent.titleEn) : t("خدمات المنظمات الإنسانية", "Humanitarian organizations")
				}) }),
				parent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceCard, {
					service: parent,
					wide: true
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-3",
					children: aid.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceCard, { service }, service.slug))
				})
			]
		}) : null]
	});
}
function ServiceCard({ service, wide = false }) {
	const { lang, t } = useI18n();
	const text = (ar, en) => lang === "ar" ? ar : en;
	const covers = (lang === "ar" ? service.coversAr : service.coversEn).slice(0, wide ? 4 : 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/services/$slug",
		params: { slug: service.slug },
		className: "soft-card lift block overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServicePhoto, {
				slug: service.slug,
				className: wide ? "aspect-[21/8] w-full object-cover" : "aspect-[16/9] w-full object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute bottom-3 start-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceGlyph, { slug: service.slug })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-2xl",
					children: text(service.titleAr, service.titleEn)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: text(service.summaryAr, service.summaryEn)
				}),
				covers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 grid gap-1.5 text-sm",
					children: covers.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gold",
							"aria-hidden": true,
							children: "•"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
					}, item))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-primary",
					children: t("تفاصيل الخدمة", "Service details")
				})
			]
		})]
	});
}
//#endregion
export { ServiceMenu as t };
