import { T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { o as Route$16 } from "./router-DlFaDcyt.mjs";
import { a as PageIntro } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rates.history-BYFBnPBo.js
var import_jsx_runtime = require_jsx_runtime();
function HistoryPage() {
	const rows = Route$16.useLoaderData();
	const { t } = useI18n();
	const codes = Array.from(new Set(rows.map((row) => row.code)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t("الصرف", "Exchange"),
		title: t("سجل التغير", "Rate history"),
		crumbs: [
			{
				href: "/",
				label: t("الرئيسية", "Home")
			},
			{
				href: "/rates",
				label: t("الأسعار", "Rates")
			},
			{
				href: "/rates/history",
				label: t("السجل", "History")
			}
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto grid max-w-6xl gap-6 px-4 py-12",
		children: codes.length === 0 ? null : codes.map((code) => {
			const points = rows.filter((row) => row.code === code);
			const max = Math.max(...points.map((point) => Number(point.sell)), 1);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "soft-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: code
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 320 80",
					className: "mt-4 h-24 w-full",
					role: "img",
					"aria-label": code,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
						fill: "none",
						stroke: "#0e2a22",
						strokeWidth: "3",
						points: points.map((point, index) => `${index / Math.max(points.length - 1, 1) * 320},${80 - Number(point.sell) / max * 70}`).join(" ")
					})
				})]
			}, code);
		})
	})] });
}
//#endregion
export { HistoryPage as component };
