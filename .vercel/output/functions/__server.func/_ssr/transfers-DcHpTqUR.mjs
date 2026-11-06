import { T as require_jsx_runtime, _ as Outlet, g as useChildMatches, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n, t as Fa } from "./shell-DdDjRdsi.mjs";
import { a as PageIntro, o as Panel } from "./ui-YTjt0IH-.mjs";
import { n as TrackBox } from "./tools-BYCUI5lb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/transfers-DcHpTqUR.js
var import_jsx_runtime = require_jsx_runtime();
function TransfersPage() {
	const nested = useChildMatches().length > 0;
	const { t } = useI18n();
	const steps = [
		t("احتفظ بالرقم المرجعي ورمز التحقق الصادرين من نقطة الخدمة.", "Keep the reference and verification code issued at the service point."),
		t("أدخلهما معاً. النتيجة حالة وعملة ومدينة استلام إن وُجدت.", "Enter both. The result is status, currency, and payout city if any."),
		t("عند الجاهزية أظهر الهوية والرمز في المدينة الظاهرة.", "When it is ready, show identification and the code in the city shown."),
		t("إن وُجدت مشكلة استخدم مركز الشكاوى، لا تشارك الرمز في قناة غير معروفة.", "If there is a problem use the complaints desk. Do not share the code on an unknown channel.")
	];
	if (nested) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t("متابعة", "Follow-up"),
		title: t("حالة الحوالة", "Transfer status"),
		crumbs: [{
			href: "/",
			label: t("الرئيسية", "Home")
		}, {
			href: "/transfers",
			label: t("الحوالات", "Transfers")
		}],
		body: t("يظهر بعد التحقق: الحالة، العملة، مدينة الاستلام، وتاريخ التحديث، مع تعليمات عامة. لا يظهر الاسم ولا المبلغ.", "After verification you see status, currency, payout city, and the update time, plus general instructions. Name and amount stay hidden.")
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-4 px-4 py-12 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mb-1 inline-flex items-center gap-2 font-display text-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
					name: "lock",
					className: "text-gold"
				}), t("الاستعلام", "Lookup")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-4 rounded-2xl bg-gold-soft/40 px-3 py-3 text-sm text-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
					name: "shield-halved",
					className: "me-2"
				}), t("الخصوصية: يُطلب الرقم والرمز معاً. لا يُعرض الاسم ولا المبلغ ولا بيانات الطرف الآخر.", "Privacy: both the reference and the code are required. Name, amount, and the other party stay hidden.")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackBox, {})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "inline-flex items-center gap-2 font-display text-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
					name: "circle-question",
					className: "text-gold"
				}), t("كيف يتم الاستلام", "How pickup works")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 grid gap-3",
				children: steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs text-surface tabular-nums",
						children: index + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "pt-1",
						children: step
					})]
				}, step))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 flex flex-wrap gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/transfers/receive-guide",
						className: "text-primary underline-offset-4 hover:underline",
						children: t("دليل الاستلام", "Receive guide")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/transfers/send-guide",
						className: "text-primary underline-offset-4 hover:underline",
						children: t("دليل الإرسال", "Send guide")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tools",
						className: "text-primary underline-offset-4 hover:underline",
						children: t("كل الأدوات", "All tools")
					})
				]
			})
		] })]
	})] });
}
//#endregion
export { TransfersPage as component };
