import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n, ot as submitServiceRequest } from "./shell-DdDjRdsi.mjs";
import { r as Route$2 } from "./router-DlFaDcyt.mjs";
import { a as PageIntro, c as PrimaryButton, i as Field, l as inputClass, r as ErrorNote } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services_._slug.request-DcAJfjka.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RequestPage() {
	const data = Route$2.useLoaderData();
	const { lang, t } = useI18n();
	const key = (0, import_react.useRef)(Math.random().toString(36).slice(2) + Date.now().toString(36));
	const [form, setForm] = (0, import_react.useState)({
		orgName: "",
		delegateName: "",
		phone: "",
		city: "",
		need: "",
		companyWebsite: ""
	});
	const [error, setError] = (0, import_react.useState)("");
	const [issued, setIssued] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	const channel = lang === "ar" ? data.channelAr : data.channelEn;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		title: data.slug === "corporate" ? t("طلب الشركات", "Corporate request") : t("طلب المنظمات", "Organization request"),
		kicker: t("الخدمات", "Services"),
		body: t("لا يُرفع كشف أسماء من هذه الصفحة.", "Do not upload a list of names from this page.")
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
		className: "mx-auto grid max-w-xl gap-3 px-4 py-12",
		onSubmit: async (e) => {
			e.preventDefault();
			setPending(true);
			setError("");
			try {
				const result = await submitServiceRequest({ data: {
					...form,
					kind: data.slug,
					idempotencyKey: key.current
				} });
				if (!result.reference) setError(t("أُرسل الطلب من قبل.", "This request was already sent."));
				else setIssued({
					reference: result.reference,
					pin: result.pin
				});
			} catch (err) {
				setError(err instanceof Error ? err.message : t("تعذر الإرسال", "Could not send"));
			} finally {
				setPending(false);
			}
		},
		children: issued ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "soft-card p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-3xl tabular-nums",
				children: issued.reference
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-3xl tabular-nums",
				children: issued.pin
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("اسم الجهة", "Organization"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputClass,
					required: true,
					value: form.orgName,
					onChange: (e) => setForm({
						...form,
						orgName: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("المفوّض", "Authorized person"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputClass,
					required: true,
					value: form.delegateName,
					onChange: (e) => setForm({
						...form,
						delegateName: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("هاتف المفوّض", "Phone"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputClass,
					required: true,
					value: form.phone,
					onChange: (e) => setForm({
						...form,
						phone: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("المدينة", "City"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputClass,
					required: true,
					value: form.city,
					onChange: (e) => setForm({
						...form,
						city: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("نوع الاحتياج", "Need"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: `${inputClass} min-h-28 py-3`,
					required: true,
					value: form.need,
					onChange: (e) => setForm({
						...form,
						need: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "hidden",
				tabIndex: -1,
				autoComplete: "off",
				value: form.companyWebsite,
				onChange: (e) => setForm({
					...form,
					companyWebsite: e.target.value
				})
			}),
			channel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: channel
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { children: error }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
				type: "submit",
				disabled: pending,
				children: t("إرسال الطلب", "Send the request")
			})
		] })
	})] });
}
//#endregion
export { RequestPage as component };
