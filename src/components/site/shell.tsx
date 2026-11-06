import { Link, useRouterState } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SignedIn } from "@/lib/auth/gates";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { Lang } from "@/lib/labels";
import type { Publication } from "@/lib/domain";
import { getPublication } from "@/lib/server/fns";
import { Logo } from "@/components/site/logo";
import { Fa } from "@/components/site/fa";

const LangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({
  lang: "ar",
  setLang: () => undefined,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  useEffect(() => {
    const saved = window.localStorage.getItem("akh-lang");
    if (saved === "en" || saved === "ar") setLang(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("akh-lang", lang);
  }, [lang]);
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const { lang, setLang } = useContext(LangContext);
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  return { lang, setLang, t };
}

const LINKS = [
  { to: "/", ar: "الرئيسية", en: "Home", icon: "house" },
  { to: "/services", ar: "الخدمات", en: "Services", icon: "right-left" },
  { to: "/transfers", ar: "الحوالات", en: "Transfers", icon: "magnifying-glass" },
  { to: "/branches", ar: "الفروع", en: "Branches", icon: "location-dot" },
  { to: "/partners", ar: "الشركاء", en: "Partners", icon: "handshake" },
  { to: "/help", ar: "المساعدة", en: "Help", icon: "circle-question" },
  { to: "/about", ar: "من نحن", en: "About", icon: "building" },
  { to: "/contact", ar: "تواصل", en: "Contact", icon: "phone" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useI18n();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [pub, setPub] = useState<Publication>({ ratesLive: false, openJobs: 0, approvedPages: [] });
  const { user, isPending } = useCurrentUserState();

  useEffect(() => {
    void getPublication().then(setPub).catch(() => undefined);
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <div className="min-h-screen">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:bg-surface focus:px-3 focus:py-2">
        {t("تخطي إلى المحتوى", "Skip to content")}
      </a>
      <div className="bg-primary text-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-sm">
          <p className="inline-flex items-center gap-2">
            <Fa name="shield-halved" className="text-gold-soft" />
            {t("ترخيص البنك المركزي اليمني رقم 486", "Central Bank of Yemen license No. 486")}
          </p>
          <div className="flex items-center gap-2">
            <a href="tel:+967712720300" className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-gold-soft">
              <Fa name="phone" />
              712720300
            </a>
            <a href="https://wa.me/967712720300" className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-gold-soft">
              <Fa name="whatsapp" brand />
              {t("واتساب", "WhatsApp")}
            </a>
          <button
            type="button"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="min-h-11 rounded-full border border-gold/60 px-3 text-gold-soft transition-colors duration-150 hover:bg-primary-mid active:scale-[0.96]"
          >
            {lang === "ar" ? "English" : "العربية"}
          </button>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <Logo />
            <span className="leading-tight">
              <span className="block font-display text-xl text-ink">{t("الخضر للصرافة", "Al Khadher")}</span>
              <span className="block text-xs text-muted">{t("والتحويلات", "Exchange & Transfers")}</span>
            </span>
          </Link>
          <div className="ms-auto flex items-center gap-2">
            {isPending ? (
              <div className="h-10 w-24 animate-pulse rounded-full bg-line" />
            ) : user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to="/portal" className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-primary">
                  <Fa name="user" />
                  {t("حسابي", "Account")}
                </Link>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm text-surface transition-colors duration-150 hover:bg-primary-mid sm:inline-flex"
              >
                <Fa name="user" className="text-gold-soft" />
                {t("دخول", "Sign in")}
              </Link>
            )}
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden"
              aria-expanded={open}
              aria-label={t("القائمة", "Menu")}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <Fa name="xmark" /> : <Fa name="bars" />}
            </button>
          </div>
        </div>
        <nav className="mx-auto hidden max-w-6xl items-center gap-1 overflow-x-auto border-t border-line px-4 py-2 lg:flex">
          {LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-3 text-sm transition-colors duration-150 ${path === item.to ? "bg-primary text-surface" : "text-ink hover:bg-paper"}`}
            >
              <Fa name={item.icon} className={path === item.to ? "text-gold-soft" : "text-gold"} />
              {lang === "ar" ? item.ar : item.en}
            </Link>
          ))}
          {pub.ratesLive ? (
            <Link to="/rates" className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-3 text-sm ${path === "/rates" ? "bg-primary text-surface" : "text-ink hover:bg-paper"}`}>
              <Fa name="coins" className={path === "/rates" ? "text-gold-soft" : "text-gold"} />
              {t("الأسعار", "Rates")}
            </Link>
          ) : null}
        </nav>
        {open ? (
          <nav className="border-t border-line px-4 py-3 lg:hidden">
            <div className="mx-auto grid max-w-6xl gap-1">
              {LINKS.map((item) => (
                <Link key={item.to} to={item.to} className="inline-flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-base hover:bg-paper">
                  <Fa name={item.icon} className="text-gold" />
                  {lang === "ar" ? item.ar : item.en}
                </Link>
              ))}
              {user ? (
                <Link to="/portal" className="min-h-11 rounded-xl px-3 py-3 text-primary">
                  {t("بوابة العميل", "Customer portal")}
                </Link>
              ) : (
                <Link to="/login" className="min-h-11 rounded-xl bg-primary px-3 py-3 text-surface">
                  {t("تسجيل الدخول", "Sign in")}
                </Link>
              )}
            </div>
          </nav>
        ) : null}
      </header>
      <main id="content" className="pb-16 sm:pb-0">{children}</main>
      <footer className="mt-16 bg-primary text-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <Logo className="h-20 w-auto" />
              <div>
                <p className="font-display text-2xl">{t("الخضر للصرافة والتحويلات", "Al Khadher Exchange")}</p>
                <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-sm font-medium text-primary">
                  <Fa name="shield-halved" />
                  {t("ترخيص رقم 486", "License No. 486")}
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-gold-soft">
              {t(
                "منشأة مصرفية فردية يمنية بموجب القانون رقم 14 لسنة 2000. المنصة للتعريف والمتابعة، ولا تُنفَّذ منها عمليات مالية.",
                "A Yemeni sole banking establishment under Law No. 14 of 2000. The site is for information and follow-up. It does not execute financial transactions.",
              )}
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-gold-soft">
              <li className="inline-flex items-center gap-2"><Fa name="location-dot" className="text-gold" />{t("مأرب، الشارع العام، جوار مؤسسة الكهرباء", "Marib, Main Street, beside the Electricity Corporation")}</li>
              <li className="inline-flex items-center gap-2"><Fa name="phone" className="text-gold" />06304111 · 06303985</li>
              <li className="inline-flex items-center gap-2"><Fa name="headset" className="text-gold" />{t("خدمة العملاء", "Customer service")} 712720300</li>
            </ul>
          </div>
          <div className="grid content-start gap-2 text-sm">
            <p className="inline-flex items-center gap-2 text-gold"><Fa name="circle-question" />{t("الصفحات", "Pages")}</p>
            <Link to="/help" className="inline-flex items-center gap-2 hover:text-gold-soft"><Fa name="circle-question" />{t("المساعدة", "Help")}</Link>
            <Link to="/tools" className="inline-flex items-center gap-2 hover:text-gold-soft"><Fa name="toolbox" />{t("أدوات المتابعة", "Tools")}</Link>
            <Link to="/complaints" className="inline-flex items-center gap-2 hover:text-gold-soft"><Fa name="comment-dots" />{t("الشكاوى", "Complaints")}</Link>
            <Link to="/trust" className="inline-flex items-center gap-2 hover:text-gold-soft"><Fa name="shield-halved" />{t("الثقة والأمان", "Trust")}</Link>
            {pub.openJobs > 0 ? <Link to="/careers" className="inline-flex items-center gap-2 hover:text-gold-soft"><Fa name="briefcase" />{t("الوظائف", "Careers")}</Link> : null}
            {pub.approvedPages.includes("privacy") ? <Link to="/privacy" className="hover:text-gold-soft">{t("الخصوصية", "Privacy")}</Link> : null}
            {pub.approvedPages.includes("terms") ? <Link to="/terms" className="hover:text-gold-soft">{t("شروط الاستخدام", "Terms")}</Link> : null}
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-gold-soft">
          <p>{t("الخضر للصرافة والتحويلات — ترخيص البنك المركزي اليمني رقم 486", "Al Khadher Exchange — Central Bank of Yemen license No. 486")}</p>
          <Link to="/developers" className="mt-2 inline-flex items-center gap-2 hover:text-surface">
            <Fa name="code" />
            {t("للمطورين", "Developers")}
          </Link>
        </div>
      </footer>
      <div className="fixed bottom-4 end-4 z-40 hidden flex-col items-end gap-2 sm:flex">
        <a
          href="https://wa.me/967712720300"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary-mid px-4 text-sm text-surface shadow-soft transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.96]"
        >
          <Fa name="whatsapp" brand />
          {t("واتساب", "WhatsApp")}
        </a>
        <Link to="/complaints" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm text-ink shadow-soft">
          <Fa name="comment-dots" className="text-gold" />
          {t("شكوى", "Complaint")}
        </Link>
        <Link to="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm text-surface shadow-soft">
          <Fa name="phone" className="text-gold-soft" />
          {t("تواصل", "Contact")}
        </Link>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-white/10 bg-primary text-surface sm:hidden">
        <a href="tel:+967712720300" className="inline-flex min-h-12 items-center justify-center gap-2 text-sm">
          <Fa name="phone" className="text-gold-soft" />
          {t("اتصال", "Call")}
        </a>
        <a href="https://wa.me/967712720300" className="inline-flex min-h-12 items-center justify-center gap-2 text-sm">
          <Fa name="whatsapp" brand className="text-gold-soft" />
          {t("واتساب", "WhatsApp")}
        </a>
      </div>
    </div>
  );
}
