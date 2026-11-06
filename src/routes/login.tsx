import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/components/site/shell";
import { ErrorNote, Field, PrimaryButton, inputClass } from "@/components/site/ui";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "الدخول | الخضر للصرافة" },
      { name: "description", content: "تسجيل الدخول إلى بوابة عملاء الخضر للصرافة." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (isPending) return <div className="mx-auto max-w-md px-4 py-20"><div className="h-40 animate-pulse rounded-2xl bg-line" /></div>;
  if (user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-4xl">{t("أنت داخل الحساب", "You are signed in")}</h1>
        <button type="button" className="mt-6 text-primary underline-offset-4 hover:underline" onClick={() => navigate({ to: "/portal" })}>
          {t("إلى البوابة", "To the portal")}
        </button>
      </div>
    );
  }
  if (!authEnabled) return <RedirectToSignIn />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      const result = mode === "up"
        ? await authClient.signUp.email({ email, password, name: name || email, callbackURL: "/portal" })
        : await authClient.signIn.email({ email, password, callbackURL: "/portal" });
      if (result.error) throw new Error(result.error.message || "Sign-in failed");
      window.location.href = "/portal";
    } catch (err) {
      setError(err instanceof Error ? err.message : t("تعذر الدخول", "Could not sign in"));
      setPending(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-md gap-4 px-4 py-16">
      <h1 className="font-display text-4xl">{mode === "up" ? t("إنشاء حساب", "Create an account") : t("تسجيل الدخول", "Sign in")}</h1>
      <p className="text-sm text-muted">
        {t("الحساب للملف الشخصي ومتابعة حوالاتك وطلبات الدعم. لا يفتح قناة دفع.", "The account is for your profile, linked transfers, and support. It does not open a payment rail.")}
      </p>
      <form className="grid gap-3 rounded-2xl border border-line bg-surface p-5" onSubmit={onSubmit}>
        {mode === "up" ? (
          <Field label={t("الاسم", "Name")}>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
        ) : null}
        <Field label={t("البريد", "Email")}>
          <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label={t("كلمة المرور", "Password")}>
          <input className={inputClass} type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        {error ? <ErrorNote>{error}</ErrorNote> : null}
        <PrimaryButton type="submit" disabled={pending}>
          {pending ? t("لحظات…", "One moment…") : mode === "up" ? t("إنشاء الحساب", "Create account") : t("دخول", "Sign in")}
        </PrimaryButton>
        <button type="button" className="text-sm text-primary" onClick={() => setMode(mode === "up" ? "in" : "up")}>
          {mode === "up" ? t("لدي حساب", "I already have an account") : t("حساب جديد بالبريد", "New email account")}
        </button>
      </form>
      <div className="grid gap-2">
        {GROK_PROVIDERS.map((provider) => (
          <button
            key={provider.providerId}
            type="button"
            className="min-h-11 rounded-full border border-line bg-surface px-4 text-sm"
            onClick={() => void signIn(provider.providerId, { callbackURL: "/portal" })}
          >
            {t("المتابعة عبر", "Continue with")} {provider.label}
          </button>
        ))}
      </div>
    </div>
  );
}
