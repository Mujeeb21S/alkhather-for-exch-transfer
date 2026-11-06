import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { lt as useI18n, rt as submitApplication } from "./shell-DdDjRdsi.mjs";
import { x as Route$40 } from "./router-DlFaDcyt.mjs";
import { a as PageIntro, c as PrimaryButton, i as Field, l as inputClass, n as EmptyState, r as ErrorNote } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/careers-CAYnm0Pn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CareersPage() {
	const jobs = Route$40.useLoaderData();
	const { lang, t } = useI18n();
	const text = (ar, en) => lang === "ar" ? ar : en;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t("العمل", "Work"),
		title: t("الوظائف", "Careers"),
		body: t("لا تُنشر وظيفة إلا بعد أن تعتمدها الإدارة. التقديم يصل إلى سجل الطلبات ولا يُنشئ عقداً.", "A role is published only after an administrator approves it. An application is stored. It does not create a contract.")
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-12",
		children: jobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: t("لا شواغر منشورة", "No published roles"),
			body: t("عند فتح وظيفة حقيقية ستظهر هنا مع مدينة التقديم ووصفه.", "When a real role opens it will appear here with its city and description.")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-4",
			children: jobs.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobCard, {
				id: job.id,
				title: text(job.titleAr, job.titleEn),
				city: text(job.cityAr, job.cityEn),
				body: text(job.bodyAr, job.bodyEn)
			}, job.id))
		})
	})] });
}
function JobCard({ id, title, city, body }) {
	const { t } = useI18n();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		phone: "",
		email: "",
		message: ""
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-2xl border border-line bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: title
			}),
			city ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-gold",
				children: city
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 whitespace-pre-wrap text-sm text-muted",
				children: body
			}),
			done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm",
				children: t("وصل طلبك إلى سجل التوظيف.", "Your application reached the hiring record.")
			}) : open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 grid gap-3",
				onSubmit: async (e) => {
					e.preventDefault();
					setError("");
					try {
						await submitApplication({ data: {
							jobId: id,
							...form
						} });
						setDone(true);
					} catch (err) {
						setError(err instanceof Error ? err.message : t("تعذر الإرسال", "Could not send"));
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("الاسم", "Name"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							required: true,
							value: form.name,
							onChange: (e) => setForm({
								...form,
								name: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("الهاتف", "Phone"),
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
						label: t("البريد", "Email"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							type: "email",
							value: form.email,
							onChange: (e) => setForm({
								...form,
								email: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("نبذة", "Note"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: `${inputClass} min-h-24 py-3`,
							required: true,
							value: form.message,
							onChange: (e) => setForm({
								...form,
								message: e.target.value
							})
						})
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { children: error }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						type: "submit",
						children: t("إرسال الطلب", "Send application")
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-4 min-h-11 text-sm text-primary underline-offset-4 hover:underline",
				onClick: () => setOpen(true),
				children: t("تقديم", "Apply")
			})
		]
	});
}
//#endregion
export { CareersPage as component };
