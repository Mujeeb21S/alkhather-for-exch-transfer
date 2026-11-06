import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, _ as Outlet, et as require_react, g as useChildMatches } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as formatMoney } from "./queries.server-CYegzkZO.mjs";
import { lt as useI18n, t as Fa } from "./shell-DdDjRdsi.mjs";
import { p as Route$27 } from "./router-DlFaDcyt.mjs";
import { a as PageIntro, l as inputClass, o as Panel, t as DemoMark } from "./ui-YTjt0IH-.mjs";
import { t as Converter } from "./tools-BYCUI5lb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rates-BQsMuEHn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RatesPage() {
	const nested = useChildMatches().length > 0;
	const data = Route$27.useLoaderData();
	const { rates } = data;
	const { lang, t } = useI18n();
	const text = (ar, en) => lang === "ar" ? ar : en;
	const regions = Array.from(new Set(rates.map((rate) => rate.region).filter(Boolean)));
	const [region, setRegion] = (0, import_react.useState)("");
	const shown = rates.filter((rate) => rate.region === region);
	const latest = shown.find((rate) => !rate.base)?.updatedAt ?? shown[0]?.updatedAt ?? "";
	if (nested) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	if (!data.publication.ratesLive) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t("الصرف", "Exchange"),
		title: t("أسعار الصرف", "Exchange rates"),
		body: t("لا توجد أسعار منشورة حالياً.", "No rates are published right now.")
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: t("الصرف", "Exchange"),
			title: t("أسعار الصرف", "Exchange rates"),
			body: t(`آخر تحديث: ${latest}`, `Last update: ${latest}`),
			crumbs: [{
				href: "/",
				label: t("الرئيسية", "Home")
			}, {
				href: "/rates",
				label: t("الأسعار", "Rates")
			}]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-wrap gap-3 px-4 pt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm text-surface",
				onClick: () => shareBoard(shown, latest),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "share-nodes" }), t("شارك الأسعار", "Share rates")]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/rates/history",
				className: "inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-4 text-sm",
				children: t("سجل التغير", "Change history")
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-4 px-4 py-12 lg:grid-cols-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "soft-card overflow-x-auto",
					children: [regions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-line p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: inputClass,
							value: region,
							onChange: (e) => setRegion(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: t("السعر العام", "National board")
							}), regions.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: name,
								children: name
							}, name))]
						})
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[40rem] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-line",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-start font-medium",
										children: t("العملة", "Currency")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-start font-medium",
										children: t("الرمز", "Code")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-end font-medium",
										children: t("شراء", "Buy")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-end font-medium",
										children: t("بيع", "Sell")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-end font-medium",
										children: t("التغير", "Change")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-start font-medium",
										children: t("الاتجاه", "Move")
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: shown.map((rate) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "grid h-9 min-w-9 place-items-center rounded-xl bg-primary px-2 text-xs text-gold-soft",
												children: rate.code
											}),
											text(rate.nameAr, rate.nameEn),
											rate.base ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoMark, { children: t("أساس", "Base") }) : null,
											rate.demo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoMark, { children: t("تجريبي", "Sample") }) : null
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 tabular-nums",
									children: rate.code
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-end tabular-nums",
									children: rate.base ? "—" : formatMoney(rate.buy)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-end tabular-nums",
									children: rate.base ? "—" : formatMoney(rate.sell)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-end tabular-nums",
									children: rate.base ? "—" : `${Number(rate.changePct).toFixed(2)}%`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [
										rate.direction === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
											name: "arrow-trend-up",
											className: "text-up"
										}) : null,
										rate.direction === "down" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
											name: "arrow-trend-down",
											className: "text-down"
										}) : null,
										rate.direction === "flat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
											name: "minus",
											className: "text-muted"
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "sr-only",
											children: rate.direction
										})
									]
								})
							]
						}, `${rate.code}-${rate.region}`)) })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 inline-flex items-start gap-2 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
						name: "circle-info",
						className: "mt-0.5 text-gold"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						t("آخر تحديث مخزّن:", "Stored update:"),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: latest
						}),
						" · ",
						t("الأساس الريال اليمني.", "Quoted against the Yemeni rial.")
					] })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: t("محول العملات", "Currency converter")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Converter, { rates: shown.filter((rate) => rate.region === region) })
				})]
			})]
		})
	] });
}
async function shareBoard(rows, updated) {
	const canvas = document.createElement("canvas");
	canvas.width = 900;
	canvas.height = 80 + rows.length * 64;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	ctx.fillStyle = "#0e2a22";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#e8d5a3";
	ctx.font = "600 36px Cairo, sans-serif";
	ctx.fillText("الخضر للصرافة — ترخيص 486", 40, 52);
	ctx.font = "400 22px Cairo, sans-serif";
	rows.forEach((row, index) => {
		ctx.fillStyle = "#ffffff";
		ctx.fillText(`${row.code}  ${row.buy} / ${row.sell}`, 40, 110 + index * 64);
	});
	ctx.fillStyle = "#e8d5a3";
	ctx.fillText(updated, 40, canvas.height - 24);
	const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
	if (!blob) return;
	const file = new File([blob], "alkhadher-rates.png", { type: "image/png" });
	if (navigator.share && navigator.canShare?.({ files: [file] })) {
		await navigator.share({
			files: [file],
			title: "أسعار الخضر للصرافة"
		});
		return;
	}
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = "alkhadher-rates.png";
	link.click();
	URL.revokeObjectURL(url);
}
//#endregion
export { RatesPage as component };
