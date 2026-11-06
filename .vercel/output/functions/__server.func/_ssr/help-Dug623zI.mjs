import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { _ as Route$33 } from "./router-DlFaDcyt.mjs";
import { a as PageIntro, l as inputClass } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/help-Dug623zI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	[
		"all",
		"الكل",
		"All"
	],
	[
		"rates",
		"الأسعار",
		"Rates"
	],
	[
		"transfers",
		"الحوالات",
		"Transfers"
	],
	[
		"branches",
		"الفروع",
		"Branches"
	],
	[
		"aid",
		"المنظمات",
		"Organizations"
	]
];
function HelpPage() {
	const data = Route$33.useLoaderData();
	const { lang, t } = useI18n();
	const [tab, setTab] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const faqs = (0, import_react.useMemo)(() => data.faqs.filter((faq) => {
		const topicOk = tab === "all" || faq.topic === tab;
		const blob = `${faq.questionAr} ${faq.questionEn} ${faq.answerAr}`.toLowerCase();
		return topicOk && blob.includes(query.trim().toLowerCase());
	}), [
		data.faqs,
		query,
		tab
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t("المساعدة", "Help"),
		title: t("الأسئلة والإرشاد", "Questions and guidance"),
		crumbs: [{
			href: "/",
			label: t("الرئيسية", "Home")
		}, {
			href: "/help",
			label: t("المساعدة", "Help")
		}]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-3xl gap-4 px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				value: query,
				onChange: (e) => setQuery(e.target.value),
				"aria-label": t("بحث", "Search"),
				placeholder: t("ابحث في الأسئلة", "Search the questions")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto",
				children: TABS.map(([id, ar, en]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: `min-h-11 shrink-0 rounded-full px-4 text-sm ${tab === id ? "bg-primary text-surface" : "border border-line bg-surface"}`,
					children: lang === "ar" ? ar : en
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-line rounded-2xl border border-line bg-surface",
				children: faqs.map((faq) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer text-lg font-medium",
						children: lang === "ar" ? faq.questionAr : faq.questionEn
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted",
						children: lang === "ar" ? faq.answerAr : faq.answerEn
					})]
				}, faq.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/news",
						className: "text-primary underline-offset-4 hover:underline",
						children: t("الأخبار", "News")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/transfers",
						className: "text-primary underline-offset-4 hover:underline",
						children: t("متابعة حوالة", "Track a transfer")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/complaints",
						className: "text-primary underline-offset-4 hover:underline",
						children: t("شكوى", "Complaint")
					})
				]
			}),
			data.guides.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3",
				children: data.guides.map((guide) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/news/$slug",
					params: { slug: guide.slug },
					className: "block rounded-2xl border border-line bg-surface p-4",
					children: lang === "ar" ? guide.titleAr : guide.titleEn
				}) }, guide.slug))
			}) : null
		]
	})] });
}
//#endregion
export { HelpPage as component };
