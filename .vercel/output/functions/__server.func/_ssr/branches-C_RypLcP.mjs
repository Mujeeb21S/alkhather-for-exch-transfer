import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, _ as Outlet, et as require_react, g as useChildMatches } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n, t as Fa } from "./shell-DdDjRdsi.mjs";
import { S as Route$41 } from "./router-DlFaDcyt.mjs";
import { a as PageIntro, d as openNow, l as inputClass, n as EmptyState, s as PhoneLines, t as DemoMark, u as mapsSearch } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/branches-C_RypLcP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function approvedPin(branch) {
	return !branch.demo && Boolean(branch.lat) && Boolean(branch.lng);
}
function googleHref(branch, lang) {
	const address = lang === "ar" ? `${branch.addressAr} ${branch.cityAr}` : `${branch.addressEn} ${branch.cityEn}`;
	return mapsSearch(address);
}
function BranchesPage() {
	const nested = useChildMatches().length > 0;
	const { branches } = Route$41.useLoaderData();
	const { lang, t } = useI18n();
	const text = (ar, en) => lang === "ar" ? ar : en;
	const [gov, setGov] = (0, import_react.useState)("all");
	const [city, setCity] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const govs = Array.from(new Set(branches.map((b) => lang === "ar" ? b.governorateAr : b.governorateEn)));
	const cities = Array.from(new Set(branches.map((b) => lang === "ar" ? b.cityAr : b.cityEn)));
	const filtered = (0, import_react.useMemo)(() => {
		return branches.filter((b) => {
			const g = lang === "ar" ? b.governorateAr : b.governorateEn;
			const c = lang === "ar" ? b.cityAr : b.cityEn;
			const blob = `${b.nameAr} ${b.nameEn} ${b.cityAr} ${b.cityEn} ${b.addressAr} ${b.phone}`.toLowerCase();
			return (gov === "all" || g === gov) && (city === "all" || c === city) && blob.includes(q.trim().toLowerCase());
		});
	}, [
		branches,
		gov,
		city,
		q,
		lang
	]);
	const pins = filtered.filter(approvedPin);
	const [focusId, setFocusId] = (0, import_react.useState)(null);
	const focus = pins.find((branch) => branch.id === focusId) ?? pins[0] ?? null;
	if (nested) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t("الشبكة", "Network"),
		title: t("الفروع والوكلاء", "Branches and agents"),
		body: t("عناوين وأرقام نقاط الخدمة.", "Addresses and phone numbers of the service points.")
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "relative block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
							name: "magnifying-glass",
							className: "pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-gold"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: `${inputClass} ps-10`,
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: t("ابحث بالاسم أو المدينة أو الهاتف", "Search by name, city, or phone")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "relative block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
							name: "filter",
							className: "pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-gold"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: `${inputClass} ps-10`,
							value: gov,
							onChange: (e) => setGov(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: t("كل المحافظات", "All governorates")
							}), govs.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: name }, name))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "relative block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
							name: "location-dot",
							className: "pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-gold"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: `${inputClass} ps-10`,
							value: city,
							onChange: (e) => setCity(e.target.value),
							"aria-label": t("المدينة", "City"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: t("كل المدن", "All cities")
							}), cities.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: name }, name))]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "soft-card mt-6 overflow-hidden",
				children: focus ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					title: t("خريطة النقطة المعتمدة", "Approved point map"),
					className: "h-72 w-full border-0",
					src: `https://maps.google.com/maps?q=${encodeURIComponent(`${focus.lat},${focus.lng}`)}&z=15&output=embed`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "inline-flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
							name: "location-dot",
							className: "text-gold"
						}), text(focus.nameAr, focus.nameEn)]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "inline-flex items-center gap-2 text-primary underline-offset-4 hover:underline",
						href: googleHref(focus, lang),
						target: "_blank",
						rel: "noreferrer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "map" }), t("فتح في خرائط جوجل", "Open in Google Maps")]
					})]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "inline-flex items-start gap-2 px-4 py-10 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
						name: "map",
						className: "mt-0.5 text-gold"
					}), t("لا توجد إحداثيات لهذه التصفية.", "No coordinates for this filter.")]
				})
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: t("لا نتائج", "No matches"),
					body: t("غيّر البحث أو أزل التصفية.", "Change the search or clear the filter.")
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 grid gap-4 md:grid-cols-2",
				children: filtered.map((branch) => {
					const photo = !branch.demo && (/^https:\/\//.test(branch.photoUrl) || branch.photoUrl.startsWith("/")) ? branch.photoUrl : "";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "soft-card p-5",
						children: [
							photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: photo,
								alt: "",
								className: "mb-4 aspect-[16/9] w-full rounded-xl object-cover object-center"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-gold",
									children: branch.nameAr === "المركز الرئيسي" ? t("المركز الرئيسي", "Head office") : branch.kind === "agent" ? t("وكيل", "Agent") : t("فرع", "Branch")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 font-display text-2xl",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `/branches/${branch.slug || branch.id}`,
										className: "hover:text-primary",
										children: text(branch.nameAr, branch.nameEn)
									})
								})] }), branch.demo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoMark, { children: t("تجريبي", "Sample") }) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 inline-flex items-start gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
									name: "location-dot",
									className: "mt-0.5 text-gold"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									text(branch.governorateAr, branch.governorateEn),
									" — ",
									text(branch.cityAr, branch.cityEn),
									" · ",
									text(branch.addressAr, branch.addressEn)
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 inline-flex items-start gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
									name: "phone",
									className: "mt-0.5 text-gold"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted",
									children: t("الهاتف", "Phone")
								}), branch.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneLines, { value: branch.phone }) : null] })]
							}),
							text(branch.hoursAr, branch.hoursEn) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 inline-flex items-center gap-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
										name: "clock",
										className: "text-gold"
									}),
									text(branch.hoursAr, branch.hoursEn),
									openNow(text(branch.hoursAr, branch.hoursEn)) == null ? "" : openNow(text(branch.hoursAr, branch.hoursEn)) ? t(" · مفتوح الآن", " · Open now") : t(" · مغلق الآن", " · Closed now")
								]
							}) : null,
							text(branch.servicesAr, branch.servicesEn) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm",
								children: [
									t("الخدمات:", "Services:"),
									" ",
									text(branch.servicesAr, branch.servicesEn)
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "mt-3 inline-flex items-center gap-2 text-sm text-primary",
								href: googleHref(branch, lang),
								target: "_blank",
								rel: "noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "map" }), t("افتح في خرائط جوجل", "Open in Google Maps")]
							}),
							approvedPin(branch) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-2 inline-flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline",
								onClick: () => setFocusId(branch.id),
								children: t("إظهارها على الخريطة", "Show on the map")
							}) : null
						]
					}, branch.id);
				})
			})
		]
	})] });
}
//#endregion
export { BranchesPage as component };
