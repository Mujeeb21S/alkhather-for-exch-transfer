import { T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Fa } from "./shell-DdDjRdsi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/service-visual-Cq0Buso_.js
var import_jsx_runtime = require_jsx_runtime();
var VISUAL = {
	individuals: {
		image: "/media/services/individuals.jpg",
		icon: "user"
	},
	corporate: {
		image: "/media/services/corporate.jpg",
		icon: "building"
	},
	online: {
		image: "/media/services/online.jpg",
		icon: "mobile-screen"
	},
	"currency-convert": {
		image: "/media/services/currency-convert.jpg",
		icon: "right-left"
	},
	"track-transfer": {
		image: "/media/services/track-transfer.jpg",
		icon: "magnifying-glass"
	},
	suggestions: {
		image: "/media/services/suggestions.jpg",
		icon: "comment-dots"
	},
	humanitarian: {
		image: "/media/services/humanitarian.jpg",
		icon: "hands-helping"
	},
	"aid-cash": {
		image: "/media/services/aid-cash.jpg",
		icon: "money-bill-wave"
	},
	"aid-guarantor": {
		image: "/media/services/aid-guarantor.jpg",
		icon: "user-shield"
	},
	"aid-deposit": {
		image: "/media/services/aid-deposit.jpg",
		icon: "building-columns"
	}
};
function ServiceGlyph({ slug, className = "h-11 w-11" }) {
	const icon = VISUAL[slug]?.icon ?? "hands-helping";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `grid place-items-center rounded-2xl bg-primary text-gold-soft shadow-soft ${className}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: icon })
	});
}
function ServicePhoto({ slug, className }) {
	const src = VISUAL[slug]?.image;
	if (!src) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: "",
		className: className ?? "aspect-[16/9] w-full object-cover"
	});
}
//#endregion
export { ServicePhoto as n, ServiceGlyph as t };
