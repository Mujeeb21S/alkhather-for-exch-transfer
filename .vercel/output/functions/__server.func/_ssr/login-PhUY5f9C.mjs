import { o as __toESM } from "../_runtime.mjs";
import { C as useNavigate, T as require_jsx_runtime, et as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-1vAx-gM_.mjs";
import { t as GROK_PROVIDERS } from "./server-BUkZopro.mjs";
import { ct as useCurrentUserState, lt as useI18n } from "./shell-DdDjRdsi.mjs";
import { c as PrimaryButton, i as Field, l as inputClass, r as ErrorNote } from "./ui-YTjt0IH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-PhUY5f9C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { user, isPending } = useCurrentUserState();
	const { t } = useI18n();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-md px-4 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-2xl bg-line" })
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md px-4 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: t("أنت داخل الحساب", "You are signed in")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "mt-6 text-primary underline-offset-4 hover:underline",
			onClick: () => navigate({ to: "/portal" }),
			children: t("إلى البوابة", "To the portal")
		})]
	});
	async function onSubmit(e) {
		e.preventDefault();
		setPending(true);
		setError("");
		try {
			const result = mode === "up" ? await authClient.signUp.email({
				email,
				password,
				name: name || email,
				callbackURL: "/portal"
			}) : await authClient.signIn.email({
				email,
				password,
				callbackURL: "/portal"
			});
			if (result.error) throw new Error(result.error.message || "Sign-in failed");
			window.location.href = "/portal";
		} catch (err) {
			setError(err instanceof Error ? err.message : t("تعذر الدخول", "Could not sign in"));
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-md gap-4 px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: mode === "up" ? t("إنشاء حساب", "Create an account") : t("تسجيل الدخول", "Sign in")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: t("الحساب للملف الشخصي ومتابعة حوالاتك وطلبات الدعم. لا يفتح قناة دفع.", "The account is for your profile, linked transfers, and support. It does not open a payment rail.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3 rounded-2xl border border-line bg-surface p-5",
				onSubmit,
				children: [
					mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("الاسم", "Name"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: name,
							onChange: (e) => setName(e.target.value),
							required: true
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("البريد", "Email"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("كلمة المرور", "Password"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							type: "password",
							minLength: 8,
							value: password,
							onChange: (e) => setPassword(e.target.value),
							required: true
						})
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { children: error }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						type: "submit",
						disabled: pending,
						children: pending ? t("لحظات…", "One moment…") : mode === "up" ? t("إنشاء الحساب", "Create account") : t("دخول", "Sign in")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-primary",
						onClick: () => setMode(mode === "up" ? "in" : "up"),
						children: mode === "up" ? t("لدي حساب", "I already have an account") : t("حساب جديد بالبريد", "New email account")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "min-h-11 rounded-full border border-line bg-surface px-4 text-sm",
					onClick: () => void signIn(provider.providerId, { callbackURL: "/portal" }),
					children: [
						t("المتابعة عبر", "Continue with"),
						" ",
						provider.label
					]
				}, provider.providerId))
			})
		]
	});
}
//#endregion
export { LoginPage as component };
