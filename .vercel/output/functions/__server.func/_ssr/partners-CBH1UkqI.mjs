import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { h as Route$30 } from "./router-DlFaDcyt.mjs";
import { a as PageIntro, l as inputClass } from "./ui-YTjt0IH-.mjs";
import { t as PARTNER_GROUPS } from "./partner-groups-Cc26E6Gk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/partners-CBH1UkqI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PartnersPage() {
	const { partners } = Route$30.useLoaderData();
	const { lang, t } = useI18n();
	const text = (ar, en) => lang === "ar" ? ar : en;
	const [q, setQ] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("all");
	const groups = PARTNER_GROUPS.filter((group) => group.kind !== "local_circular");
	const visible = (0, import_react.useMemo)(() => partners.filter((partner) => {
		const blob = `${partner.nameAr} ${partner.nameEn} ${partner.country ?? ""}`.toLowerCase();
		return (kind === "all" || partner.kind === kind) && blob.includes(q.trim().toLowerCase());
	}), [
		partners,
		q,
		kind
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t("الشبكة", "Network"),
		title: t("شركاء التحويل", "Transfer partners"),
		crumbs: [{
			href: "/",
			label: t("الرئيسية", "Home")
		}, {
			href: "/partners",
			label: t("الشركاء", "Partners")
		}]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-8 px-4 py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: inputClass,
				value: q,
				onChange: (e) => setQ(e.target.value),
				"aria-label": t("بحث", "Search"),
				placeholder: t("ابحث بالاسم", "Search by name")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: inputClass,
				value: kind,
				onChange: (e) => setKind(e.target.value),
				"aria-label": t("النوع", "Type"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "all",
					children: t("كل الأنواع", "All types")
				}), groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: group.kind,
					children: text(group.titleAr, group.titleEn)
				}, group.kind))]
			})]
		}), groups.map((group) => {
			const items = visible.filter((partner) => partner.kind === group.kind);
			if (!items.length) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: text(group.titleAr, group.titleEn)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-3xl text-sm text-muted",
					children: text(group.bodyAr, group.bodyEn)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: items.map((partner) => {
						const name = text(partner.nameAr, partner.nameEn);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: partner.slug ? `/transfers/networks/${partner.slug}` : "/partners",
							className: "flex items-center gap-3 rounded-2xl border border-line bg-surface p-4",
							children: [partner.logoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: partner.logoUrl,
								alt: "",
								className: "h-11 w-11 rounded-2xl object-contain"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary font-display text-lg text-gold-soft",
								children: name.trim().charAt(0)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: name
							})]
						}) }, partner.id);
					})
				})
			] }, group.kind);
		})]
	})] });
}
//#endregion
export { PartnersPage as component };
