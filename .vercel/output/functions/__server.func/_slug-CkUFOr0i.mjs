import { T as require_jsx_runtime, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n } from "./_ssr/shell-DdDjRdsi.mjs";
import { i as Route$14 } from "./_ssr/router-DlFaDcyt.mjs";
import { a as PageIntro, o as Panel } from "./_ssr/ui-YTjt0IH-.mjs";
import { n as ServicePhoto, t as ServiceGlyph } from "./_ssr/service-visual-Cq0Buso_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-CkUFOr0i.js
var import_jsx_runtime = require_jsx_runtime();
function ServiceDetail() {
	const { service, faqs } = Route$14.useLoaderData();
	const { lang, t } = useI18n();
	const text = (ar, en) => lang === "ar" ? ar : en;
	const steps = lang === "ar" ? service.stepsAr : service.stepsEn;
	const reqs = lang === "ar" ? service.requirementsAr : service.requirementsEn;
	const covers = lang === "ar" ? service.coversAr : service.coversEn;
	const related = faqs.filter((faq) => faq.serviceSlug === service.slug);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t("خدمة", "Service"),
		title: text(service.titleAr, service.titleEn),
		body: text(service.summaryAr, service.summaryEn)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-4 px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "overflow-hidden rounded-2xl border border-line bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServicePhoto, {
						slug: service.slug,
						className: "aspect-[16/8] w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute bottom-4 start-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceGlyph, {
							slug: service.slug,
							className: "h-14 w-14"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
					className: "px-5 py-3 text-xs text-muted",
					children: t("صورة تعبيرية للخدمة، وليست صورة فرع بعينه.", "An illustrative image for the service, not a photo of a specific branch.")
				})]
			}),
			service.audienceAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: t("لمن هذه الخدمة", "Who it is for")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: text(service.audienceAr, service.audienceEn)
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: t("تفاصيل الخدمة", "Service details")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid gap-3 text-muted",
					children: text(service.bodyAr, service.bodyEn).split(/\n\n+/).map((paragraph) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: paragraph }, paragraph))
				}),
				service.slug === "individuals" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/branches",
					className: "mt-5 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm text-surface",
					children: t("دليل الفروع", "Branch directory")
				}) : null,
				service.slug === "currency-convert" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/rates",
					className: "mt-5 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm text-surface",
					children: t("افتح لوحة التحويل", "Open the converter")
				}) : null,
				service.slug === "track-transfer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/transfers",
					className: "mt-5 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm text-surface",
					children: t("تتبع الحوالة", "Track a transfer")
				}) : null,
				service.slug === "suggestions" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/complaints",
					className: "mt-5 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm text-surface",
					children: t("قدّم شكوى أو مقترحاً", "Send a complaint or suggestion")
				}) : null,
				service.slug === "corporate" || service.slug === "humanitarian" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `/services/${service.slug}/request`,
					className: "mt-5 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm text-surface",
					children: t("قدّم طلباً", "Send a request")
				}) : null,
				service.slug.startsWith("aid-") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/services/humanitarian/request",
					className: "mt-5 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm text-surface",
					children: t("قدّم طلب المنظمة", "Send an organization request")
				}) : null
			] }),
			covers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: t("ماذا تشمل", "What it covers")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-2 md:grid-cols-2",
				children: covers.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "border-s-2 border-gold ps-3",
					children: item
				}, item))
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: t("خطوات التنفيذ", "Steps")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 grid gap-3",
					children: steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums text-gold",
							children: index + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step })]
					}, step))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: t("الشروط والمتطلبات", "Requirements")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 grid gap-2",
					children: reqs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "border-s-2 border-gold ps-3",
						children: item
					}, item))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: t("الرسوم", "Fees")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: text(service.feesAr, service.feesEn)
			})] }),
			related.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: t("أسئلة هذه الخدمة", "Questions on this service")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 divide-y divide-line",
				children: related.map((faq) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer font-medium",
						children: text(faq.questionAr, faq.questionEn)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: text(faq.answerAr, faq.answerEn)
					})]
				}, faq.id))
			})] }) : null
		]
	})] });
}
//#endregion
export { ServiceDetail as component };
