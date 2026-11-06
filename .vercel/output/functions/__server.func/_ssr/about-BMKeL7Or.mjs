import { T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { w as Route$44 } from "./router-DlFaDcyt.mjs";
import { a as PageIntro } from "./ui-YTjt0IH-.mjs";
import { t as HeadOfficeFigure } from "./premises-DjG9siaB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-BMKeL7Or.js
var import_jsx_runtime = require_jsx_runtime();
function AboutPage() {
	const { settings } = Route$44.useLoaderData();
	const { lang, t } = useI18n();
	const text = (ar, en) => lang === "ar" ? ar : en;
	const principles = [
		[t("الالتزام", "Commitment"), text(settings.commitmentAr, settings.commitmentEn)],
		[t("الأمانة", "Trust"), text(settings.valuesAr, settings.valuesEn)],
		[t("الاحترام", "Respect"), text(settings.respectAr, settings.respectEn)],
		[t("الوضوح والشفافية", "Clarity"), text(settings.transparencyAr, settings.transparencyEn)]
	];
	const facts = [
		[t("الترخيص", "License"), t("486 — البنك المركزي اليمني", "486 — Central Bank of Yemen")],
		[t("السند النظامي", "Legal basis"), t("القانون رقم 14 لسنة 2000", "Law No. 14 of 2000")],
		[t("المكتب الرئيسي", "Head office"), text(settings.addressAr, settings.addressEn)]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: t("شركة محسن الخضر للصرافة والتحويلات النقدية", "Mohsen Al Khadher Exchange & Cash Transfers"),
			title: t("من نحن", "About"),
			body: text(settings.aboutAr, settings.aboutEn)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pt-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadOfficeFigure, {
				caption: t("المركز الرئيسي", "Head office"),
				address: text(settings.addressAr, settings.addressEn),
				alt: t("واجهة المركز الرئيسي لشركة محسن الخضر للصرافة والتحويلات", "Facade of the Mohsen Al Khadher Exchange head office")
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto grid max-w-6xl gap-3 px-4 py-8 md:grid-cols-3",
			children: facts.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-line bg-surface px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gold",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-medium",
					children: value
				})]
			}, label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-4 px-4 pb-4 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl border border-line bg-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: t("الرسالة", "Mission")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, { text: text(settings.missionAr, settings.missionEn) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl border border-line bg-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: t("الرؤية", "Vision")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, { text: text(settings.visionAr, settings.visionEn) })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-6xl px-4 py-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl border border-line bg-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: t("الأهداف", "Aims")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, { text: text(settings.goalsAr, settings.goalsEn) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl",
				children: t("القيم والمبادئ", "Values and principles")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-4 md:grid-cols-2",
				children: principles.map(([title, body]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-2xl border border-line bg-surface p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, { text: body })]
				}, title))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-4 px-4 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl bg-primary-deep p-6 text-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: t("استراتيجية الشركة", "Company strategy")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid gap-3 text-gold-soft leading-7",
					children: paragraphs(text(settings.strategyAr, settings.strategyEn)).map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: line }, line))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl border border-gold bg-gold-soft/30 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: t("الترخيص والبيانات القانونية", "License and legal data")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, { text: text(settings.legalAr, settings.legalEn) })]
			})]
		})
	] });
}
function paragraphs(text) {
	return text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
}
function Prose({ text }) {
	const lines = paragraphs(text);
	if (lines.length > 1 && lines.every((line) => /^\d+[\.\)]/.test(line))) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "mt-3 grid list-decimal gap-3 ps-5 leading-7 text-muted",
		children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line.replace(/^\d+[\.\)]\s*/, "") }, line))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-3 grid gap-3 leading-7 text-muted",
		children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: line }, line))
	});
}
//#endregion
export { AboutPage as component };
