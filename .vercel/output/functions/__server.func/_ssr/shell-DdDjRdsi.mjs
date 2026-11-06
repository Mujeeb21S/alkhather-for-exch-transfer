import { o as __toESM } from "../_runtime.mjs";
import { S as Navigate, T as require_jsx_runtime, et as require_react, p as useRouterState, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { i as signOut, t as authClient } from "./client-1vAx-gM_.mjs";
import { i as authMiddleware } from "./queries.server-CYegzkZO.mjs";
import { a as hasGateSessionMarker } from "./server-BUkZopro.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-DdDjRdsi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getPublicHome = createServerFn({ method: "GET" }).handler(createSsrRpc("40fa572d44a2a8f70ad948874b4dcc75f218ae5b7da9cab2b40f25d209a1faec"));
var getPublication = createServerFn({ method: "GET" }).handler(createSsrRpc("ca8fd8c939ee2a57ef8851785758d8a8e3dcea4bc497ba6b431b711279ed039f"));
var getPublicBranch = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("5ee25229d8e0ff618d71e680d5ab00842113ef2b63f20c77fa83909673fab111"));
var getRateHistory = createServerFn({ method: "GET" }).handler(createSsrRpc("e012264b69ed67796cf1f28a1c941b0e9b2b1487f46f8ad4c480dff92219247f"));
var submitServiceRequest = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("e81882570d4dd6fa883eaf8715a7e17ca529322395b21c0f46300df61c1cc8d1"));
var adminServiceRequests = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d13ab22b1ff742f21f7e2d41cf61b408866235c2210ef602e3de64eac5ece4c6"));
var getServicePage = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("98bf39d3f367fb2d8493b1965b0759b003d72320d351534ff565c9c3ff86d70b"));
var getNewsPage = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("9639ea26498d7223c32a72d9d3952ad8adf2e1b0c0fee5403e5f073532121a62"));
var submitInquiry = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("35e4c75fd143b21bf7673774d79548bfa05a450a42294aa57008ba5ed46c810f"));
var lookupTransfer = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("78de32b258509af910c9ceba05f1900cd8b473613c77af711d161207c9852f52"));
var syncProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ name: input?.name ?? "" })).handler(createSsrRpc("15785e8c6c9f6dea5c093c316e5b1e8f910737055ac00864c585f48dfe9f4825"));
var saveProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a7feaee2ac92df3f3e99df1620d7f6b39af48d7cf1c2ed9880f59233c4e00499"));
var myTransfers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6c8af2e3b89bcac30a731eedaf6268728b0a853d2630c5782b0535946a737220"));
var attachTransfer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8b5a57962ee204591148ab4fcdb94f6b11acd4a57ab8eb8a876a925f365ded37"));
var myNotices = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("5e15b74ba0ea25f89fd433c6f2d0a74aca828534407f783e04238ed4aa6a8d84"));
var readNotice = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("cbf43bef8dd7dbae0d6c24cd7267a7f1d005f27a87447bb13647a134e7844049"));
var myTickets = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("35ba6ecf911e4a120ae1b6ea7ff663d24f42d06cf48bc2bf398b7277fa0a545e"));
var createTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("0d487811f20eee8bad61b9b7f1b53ebbf55319457e03890206efd6b74cbc0549"));
var getAdminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4d1d13c37cd80d0e64663c265a0b4b424ef9e556b3eaf543118d4e8c24bf21bf"));
var bootstrapAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("0405473e8410adda3dd388c9aa519db26908dace3b270b6ba4e0a4d6e3b7aeb5"));
var adminRates = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ea99d0ceee80bac16b537ae685b2d892ea2dd2de2c6fa9dbbafee0d7218a6152"));
var adminUpdateRate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("bbba95455b5886fee22c984d089346779e594c838512db8a1d174bcb0e959278"));
var adminAddRate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("801996120c4c139565b2b6c20624f10f6a9492140342e64a155ffd2e06e79646"));
var adminBranches = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("849823c883f6639f669876eb1c13f532a4b3a4c63f4f0114e7e8ec30c0761906"));
var adminSaveBranch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e3903557ce5e5212fdd370eb1cbcb82ecf2a50cf5aecf4c7b74dedf59d7506b9"));
var adminNews = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f3b6d07b28eda793820552f8bd91472a1e87b99539ee7963ea82b2fb09f1a877"));
var adminSaveNews = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e9f078da31329e1d46ada5f3acd5d187a5383177abd51704c30df55d3f62fd69"));
var adminInquiries = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3b129a928544a01764af61884f2da661624b2633b1c9bb7af831a0bc889d28a4"));
var adminInquiryStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("fd753d8e2eea0d98872317b06fe93f53fa85e4ef2dfee09ad1ee3d17ad6c440b"));
var adminTickets = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b461e6a9cc2a00fa0d4e99f159099ffcc5d023bb197d2764d8f6aac2567f80a6"));
var adminReplyTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("64d9ab4730316c8054a4e5fded4028ad425c0a81358f7d348e80c606c4007ab9"));
var adminStaff = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9ee4a6cb829bd71e5cadcefcedb2292bafdefba319b8669da22b5129a39712ad"));
var adminSetRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e7c337b14a73432d0a589af61658ef1341dddec4673fc24ec3748f4dae648556"));
var adminAudit = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("cb28e0999f30a9b9e6bed4db0cef361e6c50ee66d241eb6c7253430ca0b3a55d"));
var adminSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a0d0de5be17901a6f93f89057ecb4bad7d5a5b8a9759bf6dc41c30346098b960"));
var adminSaveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("0596931ea4bfccf48cb151842efebda0b8fddb86dddd1de657d7f0079d15e6a6"));
var adminTransfers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("c7c68fd78fe130bdc387be34bba754ebc65b15a1286f82bbf7f7192c121d7d49"));
var adminCreateTransfer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("c5e06710dc2cd172ce1bca1280341a0eb77f5b2f0e2b1b3c27fd21fab5dac6c7"));
var adminTransferStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("86ad6af00587515d184338ddd02f7f1675e3576d26a78ac4bcf750a39a065692"));
var adminServices = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2e2dcbeed688ff3d04192773f444f5d4215dfeaca38d148c2ad000d276bffa19"));
var adminSaveService = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("086d4663cfacb61bfa5ec9bc26bff78f92efd1cbfffc9bbfc81c018bd9183c79"));
var getManagedPage = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("5af7e6c79c5d88f590b5742e8adedb00440e52749ec7ab4cc6b3b8ba223c0101"));
var getJobs = createServerFn({ method: "GET" }).handler(createSsrRpc("d5ac613b2e5b479c474fb5f7a509d43985f4a69119ad90b2b28586019812f204"));
var submitComplaint = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("3eef528084378310244d780348cf74ae05517ccb773757999d2938016aa61f0a"));
var lookupComplaint = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("6cf6f360f61ae877f2e6a33cf1901ff33e3277e1e28b3b3e92bfa5ca1f52aacf"));
var submitApplication = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("869171f4fa5df9da9ef074f3f57918a4c7d5a02b7f220a535a2e7743ae20c8f9"));
var adminPages = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0abff4b7bfeb608c23c0dc13fa8c4c889b9a1efbb5367c2950595d73c8b7da33"));
var adminSavePage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("1640e51ea80b25b61d9f4ac9c820397e2929738f45d850423fc97c530aa9522e"));
var adminPartners = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2488ed8a8c066f24d93c8c852dcd29bb957ed45d6016c4adabac32b3e2a98650"));
var adminSavePartner = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d3c30993b62393a141057105fdb971a64d47e8c20d8a71734a1498cb88a58fd8"));
var adminComplaints = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9869a4f874691d3f689896418e9561084269ce128328482fb5f92c76ccab8c88"));
var adminReplyComplaint = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f92ed88b1d36822ad4d7bf931318fddc9c0ee7697e4d522a46b191ff929ee1fe"));
var adminJobs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("5c7d87b0169dc07b19027cbd2b1abf916849d152d48f712840ff2cf310e5730a"));
var adminSaveJob = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("24ff3b2cc34bf06f776b6062c03478061bb7c58d41cd96f0e3737aefb2961e5a"));
var adminCustomers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7e2cd5eac52524669e776d0fffd25c6e4f45556b06a21635fd99eb85ead21fba"));
var adminNetworksDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4b06b39b73c061b30f286c52334afd7e89767af522b72f87a4c9b3b24992f529"));
var adminNetworksAct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("426f73a72558d38dfdf44e637b47929beecdcdeffe08c3750882835c6530556c"));
function Logo({ className = "h-14 w-auto sm:h-16" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/logo.png",
		alt: "",
		width: 720,
		height: 654,
		className: `shrink-0 object-contain ${className}`
	});
}
function Fa({ name, brand = false, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
		className: `${brand ? "fa-brands" : "fa-solid"} fa-${name} fa-fw ${className}`,
		"aria-hidden": "true"
	});
}
var LangContext = (0, import_react.createContext)({
	lang: "ar",
	setLang: () => void 0
});
function LangProvider({ children }) {
	const [lang, setLang] = (0, import_react.useState)("ar");
	(0, import_react.useEffect)(() => {
		const saved = window.localStorage.getItem("akh-lang");
		if (saved === "en" || saved === "ar") setLang(saved);
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.lang = lang;
		document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
		window.localStorage.setItem("akh-lang", lang);
	}, [lang]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangContext.Provider, {
		value: {
			lang,
			setLang
		},
		children
	});
}
function useI18n() {
	const { lang, setLang } = (0, import_react.useContext)(LangContext);
	const t = (ar, en) => lang === "ar" ? ar : en;
	return {
		lang,
		setLang,
		t
	};
}
var LINKS = [
	{
		to: "/",
		ar: "الرئيسية",
		en: "Home",
		icon: "house"
	},
	{
		to: "/services",
		ar: "الخدمات",
		en: "Services",
		icon: "right-left"
	},
	{
		to: "/transfers",
		ar: "الحوالات",
		en: "Transfers",
		icon: "magnifying-glass"
	},
	{
		to: "/branches",
		ar: "الفروع",
		en: "Branches",
		icon: "location-dot"
	},
	{
		to: "/partners",
		ar: "الشركاء",
		en: "Partners",
		icon: "handshake"
	},
	{
		to: "/help",
		ar: "المساعدة",
		en: "Help",
		icon: "circle-question"
	},
	{
		to: "/about",
		ar: "من نحن",
		en: "About",
		icon: "building"
	},
	{
		to: "/contact",
		ar: "تواصل",
		en: "Contact",
		icon: "phone"
	}
];
function SiteShell({ children }) {
	const { lang, setLang, t } = useI18n();
	const path = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const [pub, setPub] = (0, import_react.useState)({
		ratesLive: false,
		openJobs: 0,
		approvedPages: []
	});
	const { user, isPending } = useCurrentUserState();
	(0, import_react.useEffect)(() => {
		getPublication().then(setPub).catch(() => void 0);
		if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => void 0);
	}, []);
	(0, import_react.useEffect)(() => {
		setOpen(false);
	}, [path]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#content",
				className: "sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:bg-surface focus:px-3 focus:py-2",
				children: t("تخطي إلى المحتوى", "Skip to content")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-primary text-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "inline-flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
							name: "shield-halved",
							className: "text-gold-soft"
						}), t("ترخيص البنك المركزي اليمني رقم 486", "Central Bank of Yemen license No. 486")]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "tel:+967712720300",
								className: "inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-gold-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "phone" }), "712720300"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "https://wa.me/967712720300",
								className: "inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-gold-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
									name: "whatsapp",
									brand: true
								}), t("واتساب", "WhatsApp")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setLang(lang === "ar" ? "en" : "ar"),
								className: "min-h-11 rounded-full border border-gold/60 px-3 text-gold-soft transition-colors duration-150 hover:bg-primary-mid active:scale-[0.96]",
								children: lang === "ar" ? "English" : "العربية"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-6xl items-center gap-4 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "leading-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-display text-xl text-ink",
									children: t("الخضر للصرافة", "Al Khadher")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs text-muted",
									children: t("والتحويلات", "Exchange & Transfers")
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ms-auto flex items-center gap-2",
							children: [isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-24 animate-pulse rounded-full bg-line" }) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden items-center gap-2 sm:flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/portal",
									className: "inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "user" }), t("حسابي", "Account")]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/login",
								className: "hidden min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm text-surface transition-colors duration-150 hover:bg-primary-mid sm:inline-flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
									name: "user",
									className: "text-gold-soft"
								}), t("دخول", "Sign in")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden",
								"aria-expanded": open,
								"aria-label": t("القائمة", "Menu"),
								onClick: () => setOpen((v) => !v),
								children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "xmark" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "bars" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "mx-auto hidden max-w-6xl items-center gap-1 overflow-x-auto border-t border-line px-4 py-2 lg:flex",
						children: [LINKS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: `inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-3 text-sm transition-colors duration-150 ${path === item.to ? "bg-primary text-surface" : "text-ink hover:bg-paper"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
								name: item.icon,
								className: path === item.to ? "text-gold-soft" : "text-gold"
							}), lang === "ar" ? item.ar : item.en]
						}, item.to)), pub.ratesLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/rates",
							className: `inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-3 text-sm ${path === "/rates" ? "bg-primary text-surface" : "text-ink hover:bg-paper"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
								name: "coins",
								className: path === "/rates" ? "text-gold-soft" : "text-gold"
							}), t("الأسعار", "Rates")]
						}) : null]
					}),
					open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "border-t border-line px-4 py-3 lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto grid max-w-6xl gap-1",
							children: [LINKS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: "inline-flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-base hover:bg-paper",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
									name: item.icon,
									className: "text-gold"
								}), lang === "ar" ? item.ar : item.en]
							}, item.to)), user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/portal",
								className: "min-h-11 rounded-xl px-3 py-3 text-primary",
								children: t("بوابة العميل", "Customer portal")
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "min-h-11 rounded-xl bg-primary px-3 py-3 text-surface",
								children: t("تسجيل الدخول", "Sign in")
							})]
						})
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "content",
				className: "pb-16 sm:pb-0",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "mt-16 bg-primary text-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "h-20 w-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-2xl",
									children: t("الخضر للصرافة والتحويلات", "Al Khadher Exchange")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-sm font-medium text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "shield-halved" }), t("ترخيص رقم 486", "License No. 486")]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-md text-sm text-gold-soft",
								children: t("منشأة مصرفية فردية يمنية بموجب القانون رقم 14 لسنة 2000. المنصة للتعريف والمتابعة، ولا تُنفَّذ منها عمليات مالية.", "A Yemeni sole banking establishment under Law No. 14 of 2000. The site is for information and follow-up. It does not execute financial transactions.")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-4 grid gap-2 text-sm text-gold-soft",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "inline-flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
											name: "location-dot",
											className: "text-gold"
										}), t("مأرب، الشارع العام، جوار مؤسسة الكهرباء", "Marib, Main Street, beside the Electricity Corporation")]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "inline-flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
											name: "phone",
											className: "text-gold"
										}), "06304111 · 06303985"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "inline-flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
												name: "headset",
												className: "text-gold"
											}),
											t("خدمة العملاء", "Customer service"),
											" 712720300"
										]
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid content-start gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "inline-flex items-center gap-2 text-gold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "circle-question" }), t("الصفحات", "Pages")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/help",
								className: "inline-flex items-center gap-2 hover:text-gold-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "circle-question" }), t("المساعدة", "Help")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/tools",
								className: "inline-flex items-center gap-2 hover:text-gold-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "toolbox" }), t("أدوات المتابعة", "Tools")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/complaints",
								className: "inline-flex items-center gap-2 hover:text-gold-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "comment-dots" }), t("الشكاوى", "Complaints")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/trust",
								className: "inline-flex items-center gap-2 hover:text-gold-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "shield-halved" }), t("الثقة والأمان", "Trust")]
							}),
							pub.openJobs > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/careers",
								className: "inline-flex items-center gap-2 hover:text-gold-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "briefcase" }), t("الوظائف", "Careers")]
							}) : null,
							pub.approvedPages.includes("privacy") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/privacy",
								className: "hover:text-gold-soft",
								children: t("الخصوصية", "Privacy")
							}) : null,
							pub.approvedPages.includes("terms") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/terms",
								className: "hover:text-gold-soft",
								children: t("شروط الاستخدام", "Terms")
							}) : null
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-white/10 px-4 py-4 text-center text-xs text-gold-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("الخضر للصرافة والتحويلات — ترخيص البنك المركزي اليمني رقم 486", "Al Khadher Exchange — Central Bank of Yemen license No. 486") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/developers",
						className: "mt-2 inline-flex items-center gap-2 hover:text-surface",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "code" }), t("للمطورين", "Developers")]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed bottom-4 end-4 z-40 hidden flex-col items-end gap-2 sm:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "https://wa.me/967712720300",
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex min-h-11 items-center gap-2 rounded-full bg-primary-mid px-4 text-sm text-surface shadow-soft transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.96]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
							name: "whatsapp",
							brand: true
						}), t("واتساب", "WhatsApp")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/complaints",
						className: "inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm text-ink shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
							name: "comment-dots",
							className: "text-gold"
						}), t("شكوى", "Complaint")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/contact",
						className: "inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm text-surface shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
							name: "phone",
							className: "text-gold-soft"
						}), t("تواصل", "Contact")]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-white/10 bg-primary text-surface sm:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "tel:+967712720300",
					className: "inline-flex min-h-12 items-center justify-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
						name: "phone",
						className: "text-gold-soft"
					}), t("اتصال", "Call")]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "https://wa.me/967712720300",
					className: "inline-flex min-h-12 items-center justify-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
						name: "whatsapp",
						brand: true,
						className: "text-gold-soft"
					}), t("واتساب", "WhatsApp")]
				})]
			})
		]
	});
}
//#endregion
export { myTickets as $, adminServices as A, createTicket as B, adminSaveJob as C, adminSaveService as D, adminSavePartner as E, adminTransferStatus as F, getPublicBranch as G, getJobs as H, adminTransfers as I, getRateHistory as J, getPublicHome as K, adminUpdateRate as L, adminSettings as M, adminStaff as N, adminSaveSettings as O, adminTickets as P, myNotices as Q, attachTransfer as R, adminSaveBranch as S, adminSavePage as T, getManagedPage as U, getAdminOverview as V, getNewsPage as W, lookupComplaint as X, getServicePage as Y, lookupTransfer as Z, adminPages as _, adminAddRate as a, submitInquiry as at, adminReplyComplaint as b, adminComplaints as c, useCurrentUserState as ct, adminInquiries as d, myTransfers as et, adminInquiryStatus as f, adminNews as g, adminNetworksDesk as h, SiteShell as i, submitComplaint as it, adminSetRole as j, adminServiceRequests as k, adminCreateTransfer as l, useI18n as lt, adminNetworksAct as m, LangProvider as n, saveProfile as nt, adminAudit as o, submitServiceRequest as ot, adminJobs as p, getPublication as q, RedirectToSignIn as r, submitApplication as rt, adminBranches as s, syncProfile as st, Fa as t, readNotice as tt, adminCustomers as u, adminPartners as v, adminSaveNews as w, adminReplyTicket as x, adminRates as y, bootstrapAdmin as z };
