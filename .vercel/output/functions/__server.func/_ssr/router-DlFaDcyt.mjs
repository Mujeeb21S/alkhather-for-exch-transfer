import { o as __toESM } from "../_runtime.mjs";
import { $ as notFound, T as require_jsx_runtime, X as redirect, _ as Outlet, b as createRootRoute, d as Scripts, et as require_react, f as HeadContent, h as createRouter, v as lazyRouteComponent, w as useRouter, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as __exportAll } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { B as loadPublicHome, I as loadHome, lt as trackTransfer } from "./queries.server-CYegzkZO.mjs";
import { n as auth } from "./server-BUkZopro.mjs";
import { G as getPublicBranch, H as getJobs, J as getRateHistory, K as getPublicHome, U as getManagedPage, W as getNewsPage, Y as getServicePage, i as SiteShell, n as LangProvider, q as getPublication } from "./shell-DdDjRdsi.mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DlFaDcyt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-B1U6t0eb.css";
var Route$46 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "الخضر للصرافة والتحويلات" },
			{
				name: "description",
				content: "شركة محسن الخضر للصرافة والتحويلات. ترخيص رقم 486. الخدمات والفروع ومتابعة حالة الحوالة."
			},
			{
				name: "theme-color",
				content: "#0e2a22"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cairo:wght@500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ar",
		dir: "rtl",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$33 = () => import("./routes-Dqt3ALXr.mjs");
var Route$45 = createFileRoute("/")({
	loader: () => getPublicHome(),
	head: () => ({
		meta: [{ title: "الخضر للصرافة والتحويلات" }, {
			name: "description",
			content: "صرافة وتحويلات في الجمهورية اليمنية. تعرّف على الخدمات والفروع، وتابع حالة الحوالة بعد التحقق."
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "FinancialService",
				name: "الخضر للصرافة والتحويلات",
				alternateName: "Al Khadher Exchange & Money Transfers",
				areaServed: "YE",
				description: "شركة محسن الخضر للصرافة والتحويلات. ترخيص رقم 486 من البنك المركزي اليمني، والمكتب الرئيسي في مأرب."
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
var $$splitComponentImporter$32 = () => import("./about-BMKeL7Or.mjs");
var Route$44 = createFileRoute("/about")({
	loader: () => getPublicHome(),
	head: () => ({ meta: [{ title: "من نحن | الخضر للصرافة" }, {
		name: "description",
		content: "شركة محسن الخضر للصرافة والتحويلات النقدية. ترخيص رقم 486 من البنك المركزي اليمني، والمكتب الرئيسي في مأرب."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("./admin-BNFYkBtw.mjs");
var Route$43 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "لوحة الإدارة | الخضر للصرافة" }, {
		name: "description",
		content: "إدارة محتوى وأسعار وفروع وطلبات الخضر للصرافة."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./aml-CfuPId0H.mjs");
var Route$42 = createFileRoute("/aml")({
	loader: async () => {
		const page = await getManagedPage({ data: "aml" });
		if (!page) throw notFound();
		return page;
	},
	head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.titleAr ?? "مكافحة غسل الأموال"} | الخضر للصرافة` }, {
		name: "description",
		content: loaderData?.bodyAr.slice(0, 160) ?? ""
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./branches-C_RypLcP.mjs");
var Route$41 = createFileRoute("/branches")({
	loader: () => getPublicHome(),
	head: () => ({ meta: [{ title: "الفروع والوكلاء | الخضر للصرافة" }, {
		name: "description",
		content: "عناوين فروع الخضر للصرافة وأرقامها في مأرب وصنعاء وشبوة."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./careers-CAYnm0Pn.mjs");
var Route$40 = createFileRoute("/careers")({
	loader: () => getJobs(),
	head: () => ({ meta: [{ title: "الوظائف | الخضر للصرافة" }, {
		name: "description",
		content: "الوظائف المنشورة لدى الخضر للصرافة والتحويلات."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./complaints-DC17JbUf.mjs");
var Route$39 = createFileRoute("/complaints")({
	head: () => ({ meta: [{ title: "الشكاوى | الخضر للصرافة" }, {
		name: "description",
		content: "تقديم شكوى ومتابعة حالتها بالرقم والرمز. الرد لا يظهر إلا بعد التحقق."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./compliance-DbFQbyKL.mjs");
var Route$38 = createFileRoute("/compliance")({
	loader: async () => {
		const page = await getManagedPage({ data: "compliance" });
		if (!page) throw notFound();
		return page;
	},
	head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.titleAr ?? "الامتثال"} | الخضر للصرافة` }, {
		name: "description",
		content: loaderData?.bodyAr.slice(0, 160) ?? ""
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./contact-B6yqtpos.mjs");
var Route$37 = createFileRoute("/contact")({
	loader: () => getPublicHome(),
	head: () => ({ meta: [
		{ title: "تواصل | الخضر للصرافة" },
		{
			name: "description",
			content: "تواصل مع الخضر للصرافة. خدمة العملاء 712720300."
		},
		{
			property: "og:title",
			content: "تواصل | الخضر للصرافة"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./developers-MYnG2dDm.mjs");
var Route$36 = createFileRoute("/developers")({
	head: () => ({ meta: [{ title: "واجهة التكامل | الخضر للصرافة" }, {
		name: "description",
		content: "واجهة قراءة عامة للأسعار والفروع والخدمات، واستعلام حالة الحوالة."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var Route$35 = createFileRoute("/faq")({ beforeLoad: () => {
	throw redirect({ to: "/help" });
} });
var $$splitComponentImporter$23 = () => import("./fraud-CT_yv0lA.mjs");
var Route$34 = createFileRoute("/fraud")({
	loader: async () => {
		const page = await getManagedPage({ data: "fraud" });
		if (!page) throw notFound();
		return page;
	},
	head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.titleAr ?? "التحذير من الاحتيال"} | الخضر للصرافة` }, {
		name: "description",
		content: loaderData?.bodyAr.slice(0, 160) ?? ""
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./help-Dug623zI.mjs");
var Route$33 = createFileRoute("/help")({
	loader: () => getPublicHome(),
	head: ({ loaderData }) => ({
		meta: [
			{ title: "المساعدة | الخضر للصرافة" },
			{
				name: "description",
				content: "أسئلة عن الأسعار والحوالات والفروع وخدمات المنظمات لدى الخضر للصرافة."
			},
			{
				property: "og:title",
				content: "المساعدة | الخضر للصرافة"
			}
		],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "FAQPage",
				mainEntity: (loaderData?.faqs ?? []).slice(0, 20).map((faq) => ({
					"@type": "Question",
					name: faq.questionAr,
					acceptedAnswer: {
						"@type": "Answer",
						text: faq.answerAr
					}
				}))
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./kyc-X7ckKSu4.mjs");
var Route$32 = createFileRoute("/kyc")({
	loader: async () => {
		const page = await getManagedPage({ data: "kyc" });
		if (!page) throw notFound();
		return page;
	},
	head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.titleAr ?? "اعرف عميلك"} | الخضر للصرافة` }, {
		name: "description",
		content: loaderData?.bodyAr.slice(0, 160) ?? ""
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./login-PhUY5f9C.mjs");
var Route$31 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "الدخول | الخضر للصرافة" }, {
		name: "description",
		content: "تسجيل الدخول إلى بوابة عملاء الخضر للصرافة."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./partners-CBH1UkqI.mjs");
var Route$30 = createFileRoute("/partners")({
	loader: () => getPublicHome(),
	head: () => ({ meta: [{ title: "الشركاء | الخضر للصرافة" }, {
		name: "description",
		content: "شبكات التحويل الدولية والإقليمية والمحلية التي أعلنتها شركة محسن الخضر."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./portal-upqX_Mct.mjs");
var Route$29 = createFileRoute("/portal")({
	head: () => ({ meta: [{ title: "بوابة العميل | الخضر للصرافة" }, {
		name: "description",
		content: "الملف الشخصي، الحوالات المرتبطة، الإشعارات، وطلبات الدعم."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./privacy-eLCZ0zHD.mjs");
var Route$28 = createFileRoute("/privacy")({
	loader: async () => {
		const page = await getManagedPage({ data: "privacy" });
		if (!page) throw notFound();
		return page;
	},
	head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.titleAr ?? "الخصوصية"} | الخضر للصرافة` }, {
		name: "description",
		content: loaderData?.bodyAr.slice(0, 160) ?? ""
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./rates-BQsMuEHn.mjs");
var Route$27 = createFileRoute("/rates")({
	loader: () => getPublicHome(),
	head: () => ({ meta: [{ title: "أسعار الصرف | الخضر للصرافة" }, {
		name: "description",
		content: "أسعار الصرف المنشورة لشركة محسن الخضر مقابل الريال اليمني."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var Route$26 = createFileRoute("/robots.txt")({ server: { handlers: { GET: async ({ request }) => {
	const body = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /portal\nDisallow: /login\nSitemap: ${new URL(request.url).origin}/sitemap.xml\n`;
	return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
} } } });
var Route$25 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async ({ request }) => {
	const origin = new URL(request.url).origin;
	const home = await loadPublicHome();
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
		"/",
		"/about",
		"/services",
		"/transfers",
		"/transfers/track",
		"/transfers/receive-guide",
		"/transfers/send-guide",
		"/branches",
		"/partners",
		"/help",
		"/tools",
		"/trust",
		"/contact",
		"/complaints",
		"/news",
		...home.publication.ratesLive ? ["/rates", "/rates/history"] : [],
		...home.publication.openJobs ? ["/careers"] : [],
		...home.publication.approvedPages.map((slug) => `/${slug}`),
		...home.services.map((service) => `/services/${service.slug}`),
		...home.news.map((item) => `/news/${item.slug}`),
		...home.branches.filter((branch) => branch.slug).map((branch) => `/branches/${branch.slug}`),
		...home.partners.filter((partner) => partner.slug).map((partner) => `/transfers/networks/${partner.slug}`)
	].map((path) => `  <url><loc>${origin}${path}</loc></url>`).join("\n")}
</urlset>`;
	return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
} } } });
var $$splitComponentImporter$15 = () => import("./terms-DoUF1Y1g.mjs");
var Route$24 = createFileRoute("/terms")({
	loader: async () => {
		const page = await getManagedPage({ data: "terms" });
		if (!page) throw notFound();
		return page;
	},
	head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.titleAr ?? "الشروط"} | الخضر للصرافة` }, {
		name: "description",
		content: loaderData?.bodyAr.slice(0, 160) ?? ""
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./tools-C9delb2n.mjs");
var Route$23 = createFileRoute("/tools")({
	loader: () => getPublication(),
	head: () => ({ meta: [{ title: "أدوات المتابعة | الخضر للصرافة" }, {
		name: "description",
		content: "تتبع الحوالة، ودليل الإرسال والاستلام، وتقديم شكوى لدى الخضر للصرافة."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./transfers-DcHpTqUR.mjs");
var Route$22 = createFileRoute("/transfers")({
	head: () => ({ meta: [{ title: "الحوالات | الخضر للصرافة" }, {
		name: "description",
		content: "استعلام عن حالة حوالة بالرقم ورمز التحقق. لا تُعرض أسماء الأطراف ولا المبلغ."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./trust-Co8aAc5i.mjs");
var Route$21 = createFileRoute("/trust")({
	loader: () => getPublicHome(),
	head: () => ({ meta: [
		{ title: "الثقة والأمان | الخضر للصرافة" },
		{
			name: "description",
			content: "ترخيص 486 وقنوات الخضر للصرافة الرسمية، وكيف تتحقق من رقم الفرع قبل التعامل."
		},
		{
			property: "og:title",
			content: "الثقة والأمان | الخضر للصرافة"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./admin.networks-DyeKSYKG.mjs");
var Route$20 = createFileRoute("/admin/networks")({
	head: () => ({ meta: [{ title: "شبكات التحويل والشركاء | الخضر للصرافة" }, {
		name: "description",
		content: "وحدة إدارة شبكات التحويل والشركاء الماليين والتسويات."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./branches._slug-nYL3BHmb.mjs");
var Route$19 = createFileRoute("/branches/$slug")({
	loader: async ({ params }) => {
		const branch = await getPublicBranch({ data: params.slug });
		if (!branch) throw notFound();
		return branch;
	},
	head: ({ loaderData }) => ({
		meta: [{ title: `${loaderData?.nameAr ?? "فرع"} | الخضر للصرافة` }, {
			name: "description",
			content: loaderData ? `${loaderData.addressAr}. ${loaderData.phone}` : "فرع الخضر للصرافة"
		}],
		scripts: loaderData ? [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "LocalBusiness",
				name: loaderData.nameAr,
				address: loaderData.addressAr,
				telephone: loaderData.phone
			})
		}] : []
	}),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./news-4cTyUgOD.mjs");
var Route$18 = createFileRoute("/news/")({
	loader: () => getPublicHome(),
	head: () => ({ meta: [{ title: "الأخبار | الخضر للصرافة" }, {
		name: "description",
		content: "أخبار وإعلانات وتنبيهات الخضر للصرافة."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("../_slug-Dz9P9Zzm.mjs");
var Route$17 = createFileRoute("/news/$slug")({
	loader: async ({ params }) => {
		const item = await getNewsPage({ data: params.slug });
		if (!item) throw notFound();
		return item;
	},
	head: ({ loaderData }) => ({ meta: [
		{ title: `${loaderData?.titleAr ?? "خبر"} | الخضر للصرافة` },
		{
			name: "description",
			content: loaderData?.excerptAr ?? "خبر من الخضر للصرافة"
		},
		{
			property: "og:title",
			content: loaderData?.titleAr ?? "الخضر للصرافة"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./rates.history-BYFBnPBo.mjs");
var Route$16 = createFileRoute("/rates/history")({
	loader: () => getRateHistory(),
	head: () => ({ meta: [{ title: "سجل الأسعار | الخضر للصرافة" }, {
		name: "description",
		content: "تغيّر أسعار الصرف المنشورة لشركة محسن الخضر."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./services-JiOqT_gv.mjs");
var Route$15 = createFileRoute("/services/")({
	loader: () => getPublicHome(),
	head: () => ({ meta: [{ title: "خدماتنا | الخضر للصرافة" }, {
		name: "description",
		content: "خدمات الأفراد والشركات والمنظمات الإنسانية لدى الخضر للصرافة."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("../_slug-CkUFOr0i.mjs");
var Route$14 = createFileRoute("/services/$slug")({
	loader: async ({ params }) => {
		const data = await getServicePage({ data: params.slug });
		if (!data) throw notFound();
		return data;
	},
	head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.service.titleAr ?? "خدمة"} | الخضر للصرافة` }, {
		name: "description",
		content: loaderData?.service.summaryAr ?? ""
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./transfers.receive-guide-BTOMmTb1.mjs");
var Route$13 = createFileRoute("/transfers/receive-guide")({
	head: () => ({ meta: [{ title: "دليل الاستلام | الخضر للصرافة" }, {
		name: "description",
		content: "كيف تستلم حوالة من نقطة خدمة تابعة للخضر للصرافة."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./transfers.send-guide-BYzNoTrl.mjs");
var Route$12 = createFileRoute("/transfers/send-guide")({
	head: () => ({ meta: [{ title: "دليل الإرسال | الخضر للصرافة" }, {
		name: "description",
		content: "إرسال الحوالة يتم في الفرع، لا من الموقع."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./transfers.track-CLngvOv4.mjs");
var Route$11 = createFileRoute("/transfers/track")({
	head: () => ({ meta: [{ title: "تتبع حوالة | الخضر للصرافة" }, {
		name: "description",
		content: "استعلم عن حالة حوالة بالرقم والرمز. لا تُعرض الأسماء ولا المبلغ."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var Route$10 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var Route$9 = createFileRoute("/api/v1/branches")({ server: { handlers: { GET: async () => {
	const home = await loadHome();
	return Response.json({ branches: home.branches });
} } } });
var Route$8 = createFileRoute("/api/v1/health")({ server: { handlers: { GET: async () => Response.json({
	ok: true,
	service: "alkhadher",
	financialRails: false,
	note: "No bank or payout-network connection is configured."
}) } } });
var Route$7 = createFileRoute("/api/v1/news")({ server: { handlers: { GET: async () => {
	const home = await loadHome();
	return Response.json({ news: home.news });
} } } });
var spec = {
	openapi: "3.0.3",
	info: {
		title: "Al Khadher Exchange public API",
		version: "1.1.0",
		description: "Read-only content API plus transfer-status lookup. Not connected to a bank, card scheme, or international payout network. Rates may be illustrative."
	},
	paths: {
		"/api/v1/health": { get: {
			summary: "Service health",
			responses: { "200": { description: "OK" } }
		} },
		"/api/v1/rates": { get: {
			summary: "Exchange board against YER",
			responses: { "200": { description: "Rates" } }
		} },
		"/api/v1/branches": { get: {
			summary: "Active branches and agents",
			responses: { "200": { description: "Directory" } }
		} },
		"/api/v1/services": { get: {
			summary: "Published services",
			responses: { "200": { description: "Services" } }
		} },
		"/api/v1/news": { get: {
			summary: "Published news",
			responses: { "200": { description: "News" } }
		} },
		"/api/v1/partners": { get: {
			summary: "Published transfer partners named by the company.",
			responses: { "200": { description: "Partners" } }
		} },
		"/api/v1/transfers/status": { post: {
			summary: "Status only. Requires reference and pin. Does not return names or amount.",
			responses: {
				"200": { description: "Status" },
				"404": { description: "Not verified" },
				"429": { description: "Rate limited" }
			}
		} }
	}
};
var Route$6 = createFileRoute("/api/v1/openapi")({ server: { handlers: { GET: async () => Response.json(spec) } } });
var Route$5 = createFileRoute("/api/v1/partners")({ server: { handlers: { GET: async () => {
	const home = await loadHome();
	return Response.json({ partners: home.partners.map((partner) => ({
		id: partner.id,
		nameAr: partner.nameAr,
		nameEn: partner.nameEn,
		kind: partner.kind,
		noteAr: partner.noteAr,
		noteEn: partner.noteEn,
		url: partner.url,
		demo: partner.demo
	})) });
} } } });
var Route$4 = createFileRoute("/api/v1/rates")({ server: { handlers: { GET: async () => {
	const home = await loadHome();
	return Response.json({
		base: "YER",
		illustrative: home.rates.some((rate) => rate.demo),
		updatedAt: home.rates[0]?.updatedAt ?? null,
		rates: home.rates
	});
} } } });
var Route$3 = createFileRoute("/api/v1/services")({ server: { handlers: { GET: async () => {
	const home = await loadHome();
	return Response.json({ services: home.services });
} } } });
var $$splitComponentImporter$1 = () => import("./services_._slug.request-DcAJfjka.mjs");
var Route$2 = createFileRoute("/services_/$slug/request")({
	loader: async ({ params }) => {
		if (params.slug !== "corporate" && params.slug !== "humanitarian") throw notFound();
		const home = await getPublicHome();
		return {
			slug: params.slug,
			channelAr: home.settings.secureChannelAr,
			channelEn: home.settings.secureChannelEn
		};
	},
	head: () => ({ meta: [{ title: "طلب خدمة | الخضر للصرافة" }, {
		name: "description",
		content: "طلب تواصل للشركات أو المنظمات. لا تُرفع كشوف مستفيدين من الموقع."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./transfers.networks._slug-n6HVJXjN.mjs");
var Route$1 = createFileRoute("/transfers/networks/$slug")({
	loader: async ({ params }) => {
		const partner = (await getPublicHome()).partners.find((item) => item.slug === params.slug);
		if (!partner) throw notFound();
		return partner;
	},
	head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.nameAr ?? "شبكة"} | الخضر للصرافة` }, {
		name: "description",
		content: "الاستلام عبر نقاط خدمة الخضر للصرافة المنشورة."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route = createFileRoute("/api/v1/transfers/status")({ server: { handlers: { POST: async ({ request }) => {
	const body = await request.json().catch(() => null);
	if (!body?.reference || !body.pin) return Response.json({ ok: false }, { status: 400 });
	try {
		const result = await trackTransfer(body.reference, body.pin);
		return Response.json(result, { status: result.ok ? 200 : 404 });
	} catch (error) {
		const message = error instanceof Error ? error.message : "limited";
		return Response.json({
			ok: false,
			message
		}, { status: 429 });
	}
} } } });
var IndexRoute = Route$45.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$46
});
var AboutRoute = Route$44.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$46
});
var AdminRoute = Route$43.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$46
});
var AmlRoute = Route$42.update({
	id: "/aml",
	path: "/aml",
	getParentRoute: () => Route$46
});
var BranchesRoute = Route$41.update({
	id: "/branches",
	path: "/branches",
	getParentRoute: () => Route$46
});
var CareersRoute = Route$40.update({
	id: "/careers",
	path: "/careers",
	getParentRoute: () => Route$46
});
var ComplaintsRoute = Route$39.update({
	id: "/complaints",
	path: "/complaints",
	getParentRoute: () => Route$46
});
var ComplianceRoute = Route$38.update({
	id: "/compliance",
	path: "/compliance",
	getParentRoute: () => Route$46
});
var ContactRoute = Route$37.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$46
});
var DevelopersRoute = Route$36.update({
	id: "/developers",
	path: "/developers",
	getParentRoute: () => Route$46
});
var FaqRoute = Route$35.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$46
});
var FraudRoute = Route$34.update({
	id: "/fraud",
	path: "/fraud",
	getParentRoute: () => Route$46
});
var HelpRoute = Route$33.update({
	id: "/help",
	path: "/help",
	getParentRoute: () => Route$46
});
var KycRoute = Route$32.update({
	id: "/kyc",
	path: "/kyc",
	getParentRoute: () => Route$46
});
var LoginRoute = Route$31.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$46
});
var PartnersRoute = Route$30.update({
	id: "/partners",
	path: "/partners",
	getParentRoute: () => Route$46
});
var PortalRoute = Route$29.update({
	id: "/portal",
	path: "/portal",
	getParentRoute: () => Route$46
});
var PrivacyRoute = Route$28.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$46
});
var RatesRoute = Route$27.update({
	id: "/rates",
	path: "/rates",
	getParentRoute: () => Route$46
});
var RobotsDottxtRoute = Route$26.update({
	id: "/robots.txt",
	path: "/robots.txt",
	getParentRoute: () => Route$46
});
var SitemapDotxmlRoute = Route$25.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$46
});
var TermsRoute = Route$24.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$46
});
var ToolsRoute = Route$23.update({
	id: "/tools",
	path: "/tools",
	getParentRoute: () => Route$46
});
var TransfersRoute = Route$22.update({
	id: "/transfers",
	path: "/transfers",
	getParentRoute: () => Route$46
});
var TrustRoute = Route$21.update({
	id: "/trust",
	path: "/trust",
	getParentRoute: () => Route$46
});
var AdminNetworksRoute = Route$20.update({
	id: "/networks",
	path: "/networks",
	getParentRoute: () => AdminRoute
});
var BranchesSlugRoute = Route$19.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => BranchesRoute
});
var NewsIndexRoute = Route$18.update({
	id: "/news/",
	path: "/news/",
	getParentRoute: () => Route$46
});
var NewsSlugRoute = Route$17.update({
	id: "/news/$slug",
	path: "/news/$slug",
	getParentRoute: () => Route$46
});
var RatesHistoryRoute = Route$16.update({
	id: "/history",
	path: "/history",
	getParentRoute: () => RatesRoute
});
var ServicesIndexRoute = Route$15.update({
	id: "/services/",
	path: "/services/",
	getParentRoute: () => Route$46
});
var ServicesSlugRoute = Route$14.update({
	id: "/services/$slug",
	path: "/services/$slug",
	getParentRoute: () => Route$46
});
var TransfersReceiveGuideRoute = Route$13.update({
	id: "/receive-guide",
	path: "/receive-guide",
	getParentRoute: () => TransfersRoute
});
var TransfersSendGuideRoute = Route$12.update({
	id: "/send-guide",
	path: "/send-guide",
	getParentRoute: () => TransfersRoute
});
var TransfersTrackRoute = Route$11.update({
	id: "/track",
	path: "/track",
	getParentRoute: () => TransfersRoute
});
var ApiAuthSplatRoute = Route$10.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$46
});
var ApiV1BranchesRoute = Route$9.update({
	id: "/api/v1/branches",
	path: "/api/v1/branches",
	getParentRoute: () => Route$46
});
var ApiV1HealthRoute = Route$8.update({
	id: "/api/v1/health",
	path: "/api/v1/health",
	getParentRoute: () => Route$46
});
var ApiV1NewsRoute = Route$7.update({
	id: "/api/v1/news",
	path: "/api/v1/news",
	getParentRoute: () => Route$46
});
var ApiV1OpenapiRoute = Route$6.update({
	id: "/api/v1/openapi",
	path: "/api/v1/openapi",
	getParentRoute: () => Route$46
});
var ApiV1PartnersRoute = Route$5.update({
	id: "/api/v1/partners",
	path: "/api/v1/partners",
	getParentRoute: () => Route$46
});
var ApiV1RatesRoute = Route$4.update({
	id: "/api/v1/rates",
	path: "/api/v1/rates",
	getParentRoute: () => Route$46
});
var ApiV1ServicesRoute = Route$3.update({
	id: "/api/v1/services",
	path: "/api/v1/services",
	getParentRoute: () => Route$46
});
var ServicesSlugRequestRoute = Route$2.update({
	id: "/services_/$slug/request",
	path: "/services/$slug/request",
	getParentRoute: () => Route$46
});
var TransfersNetworksSlugRoute = Route$1.update({
	id: "/networks/$slug",
	path: "/networks/$slug",
	getParentRoute: () => TransfersRoute
});
var ApiV1TransfersStatusRoute = Route.update({
	id: "/api/v1/transfers/status",
	path: "/api/v1/transfers/status",
	getParentRoute: () => Route$46
});
var AdminRouteChildren = { AdminNetworksRoute };
var AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
var BranchesRouteChildren = { BranchesSlugRoute };
var BranchesRouteWithChildren = BranchesRoute._addFileChildren(BranchesRouteChildren);
var RatesRouteChildren = { RatesHistoryRoute };
var RatesRouteWithChildren = RatesRoute._addFileChildren(RatesRouteChildren);
var TransfersRouteChildren = {
	TransfersReceiveGuideRoute,
	TransfersSendGuideRoute,
	TransfersTrackRoute,
	TransfersNetworksSlugRoute
};
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AdminRoute: AdminRouteWithChildren,
	AmlRoute,
	BranchesRoute: BranchesRouteWithChildren,
	CareersRoute,
	ComplaintsRoute,
	ComplianceRoute,
	ContactRoute,
	DevelopersRoute,
	FaqRoute,
	FraudRoute,
	HelpRoute,
	KycRoute,
	LoginRoute,
	PartnersRoute,
	PortalRoute,
	PrivacyRoute,
	RatesRoute: RatesRouteWithChildren,
	RobotsDottxtRoute,
	SitemapDotxmlRoute,
	TermsRoute,
	ToolsRoute,
	TransfersRoute: TransfersRoute._addFileChildren(TransfersRouteChildren),
	TrustRoute,
	NewsSlugRoute,
	ServicesSlugRoute,
	NewsIndexRoute,
	ServicesIndexRoute,
	ApiAuthSplatRoute,
	ApiV1BranchesRoute,
	ApiV1HealthRoute,
	ApiV1NewsRoute,
	ApiV1OpenapiRoute,
	ApiV1PartnersRoute,
	ApiV1RatesRoute,
	ApiV1ServicesRoute,
	ServicesSlugRequestRoute,
	ApiV1TransfersStatusRoute
};
var routeTree = Route$46._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function NotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-[60vh] max-w-lg flex-col items-start justify-center px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-gold",
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl text-ink",
				children: "الصفحة غير موجودة"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: "This page is not on the Al Khadher site."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/",
				className: "mt-6 text-sm font-medium text-primary underline-offset-4 hover:underline",
				children: "العودة للرئيسية"
			})
		]
	});
}
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent,
		defaultNotFoundComponent: NotFound
	});
}
//#endregion
export { Route$42 as C, Route$41 as S, Route$45 as T, Route$33 as _, Route$15 as a, Route$38 as b, Route$18 as c, Route$23 as d, Route$24 as f, Route$32 as g, Route$30 as h, Route$14 as i, Route$19 as l, Route$28 as m, Route$1 as n, Route$16 as o, Route$27 as p, Route$2 as r, Route$17 as s, router_exports as t, Route$21 as u, Route$34 as v, Route$44 as w, Route$40 as x, Route$37 as y };
