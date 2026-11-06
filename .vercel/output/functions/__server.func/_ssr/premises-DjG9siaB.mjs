import { T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/premises-DjG9siaB.js
var import_jsx_runtime = require_jsx_runtime();
function HeadOfficeFigure({ caption, address, alt, priority = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
		className: "mx-auto max-w-6xl px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-hidden rounded-2xl border border-line bg-surface",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/media/head-office.jpg",
				alt,
				width: 1600,
				height: 963,
				decoding: "async",
				fetchPriority: priority ? "high" : "auto",
				className: "aspect-[16/9] w-full object-cover object-center"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
				className: "flex flex-wrap items-baseline justify-between gap-2 px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl",
					children: caption
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: address
				})]
			})]
		})
	});
}
//#endregion
export { HeadOfficeFigure as t };
