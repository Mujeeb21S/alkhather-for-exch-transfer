import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { a as PageIntro, o as Panel } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/developers-MYnG2dDm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DevelopersPage() {
	const { t } = useI18n();
	const [spec, setSpec] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		fetch("/api/v1/openapi").then((res) => res.json()).then((body) => setSpec(body)).catch(() => void 0);
	}, []);
	const rows = [
		[
			"GET",
			"/api/v1/health",
			t("جاهزية الخدمة", "Liveness")
		],
		[
			"GET",
			"/api/v1/rates",
			t("لوحة الأسعار كما تحفظها الإدارة", "The rate board as saved by staff")
		],
		[
			"GET",
			"/api/v1/branches",
			t("الفروع والوكلاء النشطون", "Active branches and agents")
		],
		[
			"GET",
			"/api/v1/services",
			t("الخدمات المنشورة", "Published services")
		],
		[
			"GET",
			"/api/v1/news",
			t("الأخبار المنشورة", "Published news")
		],
		[
			"GET",
			"/api/v1/partners",
			t("الشركاء المنشورون", "Published partners")
		],
		[
			"POST",
			"/api/v1/transfers/status",
			t("حالة حوالة بالرقم والرمز، بلا أسماء ولا مبلغ", "Transfer status by reference and code, no names or amount")
		],
		[
			"GET",
			"/api/v1/openapi",
			t("وصف OpenAPI", "OpenAPI description")
		]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: "API",
		title: t("واجهة التكامل", "Integration surface"),
		crumbs: [{
			href: "/",
			label: t("الرئيسية", "Home")
		}, {
			href: "/developers",
			label: t("للمطورين", "Developers")
		}],
		body: t("قراءة عامة. لا تنفّذ قيداً مالياً ولا تنشئ حوالة.", "Public reads. They do not post a ledger entry and they do not create a transfer.")
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-4 px-4 py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-2xl border border-line bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
				className: "w-full min-w-[36rem] text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map(([method, path, note]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-line last:border-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 font-medium text-gold",
							children: method
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 tabular-nums",
							children: path
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted",
							children: note
						})
					]
				}, path)) })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-display text-2xl",
				children: ["OpenAPI ", spec?.info?.version ?? ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: spec?.info?.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-2",
				children: Object.entries(spec?.paths ?? {}).map(([path, methods]) => Object.entries(methods).map(([method, operation]) => {
					const id = `${method} ${path}`;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex min-h-11 w-full items-center gap-3 px-3 text-start text-sm",
							"aria-expanded": open === id,
							onClick: () => setOpen(open === id ? null : id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium uppercase text-gold",
								children: method
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: path
							})]
						}), open === id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "border-t border-line px-3 py-3 text-sm text-muted",
							children: operation.summary
						}) : null]
					}, id);
				}))
			})
		] })]
	})] });
}
//#endregion
export { DevelopersPage as component };
