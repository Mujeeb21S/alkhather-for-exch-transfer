import { T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-YTjt0IH-.js
var import_jsx_runtime = require_jsx_runtime();
function intlPhone(raw) {
	const digits = raw.replace(/\D/g, "");
	if (!digits) return "";
	if (digits.startsWith("967")) return `+${digits}`;
	if (digits.startsWith("0")) return `+967${digits.slice(1)}`;
	return `+${digits}`;
}
function phoneParts(value) {
	return value.split(/[^\d+]+/).map((part) => part.trim()).filter((part) => part.replace(/\D/g, "").length >= 5);
}
function mapsSearch(address) {
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}، اليمن`)}`;
}
function openNow(hours, now = /* @__PURE__ */ new Date()) {
	const match = hours.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/);
	if (!match) return null;
	const [hh, mm] = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Aden",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).format(now).split(":").map(Number);
	const cur = hh * 60 + mm;
	const start = Number(match[1]) * 60 + Number(match[2]);
	const end = Number(match[3]) * 60 + Number(match[4]);
	if (end === start) return null;
	if (end < start) return cur >= start || cur < end;
	return cur >= start && cur < end;
}
function Crumbs({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "breadcrumb",
		className: "mb-4 text-sm text-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "flex flex-wrap items-center gap-2",
			children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "inline-flex items-center gap-2",
				children: [index > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					children: "/"
				}) : null, index === items.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-ink",
					children: item.label
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: item.href,
					className: "hover:text-primary",
					children: item.label
				})]
			}, item.href))
		})
	});
}
function PageIntro({ kicker, title, body, crumbs }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "border-b border-line bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-12",
			children: [
				crumbs?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crumbs, { items: crumbs }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-gold",
					children: kicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl text-ink md:text-5xl",
					children: title
				}),
				body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-2xl text-muted",
					children: body
				}) : null
			]
		})
	});
}
function Panel({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: `soft-card p-5 ${className}`,
		children
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid gap-1 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: label
		}), children]
	});
}
var inputClass = "min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-ink outline-none transition-colors duration-150 focus:border-primary focus:bg-surface";
function PrimaryButton({ children, type = "button", disabled, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		disabled,
		onClick,
		className: "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm text-surface shadow-soft transition-colors duration-150 hover:bg-primary-mid active:scale-[0.96] disabled:cursor-wait disabled:opacity-60",
		children
	});
}
function DemoMark({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex rounded-full border border-gold bg-gold-soft/40 px-2 py-0.5 text-xs text-primary-deep",
		children
	});
}
function EmptyState({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-dashed border-line bg-paper px-4 py-8 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-medium",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: body
		})]
	});
}
function ErrorNote({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		role: "alert",
		className: "rounded-xl border border-down/40 bg-down/10 px-3 py-2 text-sm text-down",
		children
	});
}
function PhoneLines({ value }) {
	const parts = phoneParts(value);
	if (!parts.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "grid gap-1",
		children: parts.map((part) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: `tel:${intlPhone(part)}`,
			className: "tabular-nums text-primary underline-offset-4 hover:underline",
			children: intlPhone(part)
		}) }, part))
	});
}
//#endregion
export { PageIntro as a, PrimaryButton as c, openNow as d, Field as i, inputClass as l, EmptyState as n, Panel as o, ErrorNote as r, PhoneLines as s, DemoMark as t, mapsSearch as u };
