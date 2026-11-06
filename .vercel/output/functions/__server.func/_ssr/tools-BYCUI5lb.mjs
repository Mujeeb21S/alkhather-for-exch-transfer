import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as exchange, p as formatMoney } from "./queries.server-CYegzkZO.mjs";
import { Z as lookupTransfer, lt as useI18n, t as Fa } from "./shell-DdDjRdsi.mjs";
import { c as PrimaryButton, i as Field, l as inputClass, r as ErrorNote } from "./ui-YTjt0IH-.mjs";
import { a as statusLabel } from "./labels-Aw3jd-vz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools-BYCUI5lb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Converter({ rates }) {
	const { t } = useI18n();
	const tradable = rates.filter((rate) => !rate.base && rate.region === "");
	const [amount, setAmount] = (0, import_react.useState)("100");
	const [from, setFrom] = (0, import_react.useState)(tradable[0]?.code ?? "USD");
	const [to, setTo] = (0, import_react.useState)("YER");
	const quotes = tradable.map((rate) => ({
		code: rate.code,
		buy: Number(rate.buy),
		sell: Number(rate.sell)
	}));
	const result = (0, import_react.useMemo)(() => exchange(Number(amount), from, to, quotes), [
		amount,
		from,
		to,
		quotes
	]);
	const options = ["YER", ...tradable.map((rate) => rate.code)];
	const formula = from === "YER" ? t("المبلغ ÷ سعر البيع", "Amount ÷ sell price") : to === "YER" ? t("المبلغ × سعر الشراء", "Amount × buy price") : t("إلى الريال بسعر الشراء، ثم إلى العملة الثانية بسعر البيع", "Into the rial at the buy price, then into the second currency at the sell price");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("المبلغ", "Amount"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputClass,
					inputMode: "decimal",
					"aria-label": t("المبلغ", "Amount"),
					value: amount,
					onChange: (e) => setAmount(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[1fr_auto_1fr] items-end gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("من", "From"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: inputClass,
							"aria-label": t("من", "From"),
							value: from,
							onChange: (e) => setFrom(e.target.value),
							children: options.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: code }, `f-${code}`))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mb-1 grid h-11 w-11 place-items-center rounded-full border border-line",
						"aria-label": t("عكس الاتجاه", "Swap direction"),
						onClick: () => {
							setFrom(to);
							setTo(from);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "right-left" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("إلى", "To"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: inputClass,
							"aria-label": t("إلى", "To"),
							value: to,
							onChange: (e) => setTo(e.target.value),
							children: options.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: code }, `t-${code}`))
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "inline-flex items-center gap-2 font-display text-4xl tabular-nums",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
					name: "right-left",
					className: "text-lg text-gold"
				}), result.ok ? formatMoney(result.result) : t("غير متاح", "Unavailable")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: formula
			})
		]
	});
}
var NEXT = {
	draft: ["الحوالة لم تُستكمل بعد في نقطة الخدمة.", "The transfer is not finished at the service point yet."],
	processing: ["العملية قيد المراجعة. احتفظ بالرقم والرمز.", "The transfer is being reviewed. Keep the reference and code."],
	sent: ["أُرسلت الحوالة. انتظر حتى تصبح جاهزة للاستلام.", "The transfer was sent. Wait until it is ready for pickup."],
	ready: ["يمكن الاستلام في المدينة الظاهرة بعد إبراز الهوية والرمز.", "Pickup is possible in the city shown, with identification and the code."],
	collected: ["سُجّل الاستلام. للمراجعة استخدم مركز الشكاوى.", "Pickup is recorded. Use the complaints desk for a review."],
	cancelled: ["الحوالة ملغاة. راجع نقطة الخدمة أو قدّم شكوى.", "The transfer is cancelled. See the service point or file a complaint."],
	rejected: ["رُفضت الحوالة. قدم شكوى إن كنت صاحب الحق.", "The transfer was rejected. File a complaint if you are the entitled party."]
};
function TrackBox() {
	const { lang, t } = useI18n();
	const [reference, setReference] = (0, import_react.useState)("");
	const [pin, setPin] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-3",
		onSubmit: async (e) => {
			e.preventDefault();
			setPending(true);
			setError("");
			setResult(null);
			try {
				const next = await lookupTransfer({ data: {
					reference,
					pin
				} });
				setResult(next);
				if (!next.ok) setError(t("الرقم أو الرمز غير مطابق.", "The reference or the code does not match."));
			} catch (err) {
				setError(err instanceof Error ? err.message : t("تعذر الاستعلام", "Lookup failed"));
			} finally {
				setPending(false);
			}
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
				label: t("رقم الحوالة", "Reference"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputClass,
					value: reference,
					onChange: (e) => setReference(e.target.value),
					autoComplete: "off"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: t("الرقم الصادر من الفرع أو الوكيل.", "The number issued by the branch or agent.")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
				label: t("رمز التحقق", "Verification code"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputClass,
					value: pin,
					onChange: (e) => setPin(e.target.value),
					inputMode: "numeric",
					autoComplete: "off"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: t("لا تشارك الرمز في قناة لا تعرفها.", "Do not share the code on a channel you do not trust.")
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { children: error }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/complaints",
				className: "mt-2 inline-flex text-sm text-primary underline-offset-4 hover:underline",
				children: t("قدّم شكوى", "File a complaint")
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
				type: "submit",
				disabled: pending,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "magnifying-glass" }), pending ? t("جارٍ التحقق…", "Checking…") : t("عرض الحالة", "Show status")]
			}),
			result?.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusTimeline, {
				status: result.status,
				currency: result.currency,
				city: lang === "ar" ? result.pickupCityAr : result.pickupCityEn,
				updatedAt: result.updatedAt,
				note: lang === "ar" ? NEXT[result.status]?.[0] : NEXT[result.status]?.[1]
			}) : null
		]
	});
}
var FLOW = [
	"draft",
	"processing",
	"sent",
	"ready",
	"collected"
];
function StatusTimeline({ status, currency, city, updatedAt, note }) {
	const { lang, t } = useI18n();
	const stopped = status === "cancelled" || status === "rejected";
	const at = FLOW.indexOf(status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-paper p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-3xl",
				children: statusLabel(status, lang)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [currency, city ? ` · ${city}` : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs tabular-nums text-muted",
				children: updatedAt
			}),
			stopped ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 grid gap-2",
				children: FLOW.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: `flex items-center gap-2 text-sm ${index <= at ? "text-ink" : "text-muted"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `grid h-6 w-6 place-items-center rounded-full text-xs ${index <= at ? "bg-primary text-surface" : "bg-line"}`,
						children: index + 1
					}), statusLabel(step, lang)]
				}, step))
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/complaints",
				className: "mt-3 inline-flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "comment-dots" }), t("مشكلة في الحوالة؟ قدّم شكوى", "A problem with the transfer? File a complaint")]
			})
		]
	});
}
//#endregion
export { TrackBox as n, Converter as t };
