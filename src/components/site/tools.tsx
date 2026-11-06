import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { lookupTransfer } from "@/lib/server/fns";
import type { RateRow, TrackResult } from "@/lib/domain";
import { exchange, formatMoney } from "@/lib/money";
import { statusLabel } from "@/lib/labels";
import { useI18n } from "@/components/site/shell";
import { Fa } from "@/components/site/fa";
import { ErrorNote, Field, PrimaryButton, inputClass } from "@/components/site/ui";

export function Converter({ rates }: { rates: RateRow[] }) {
  const { t } = useI18n();
  const tradable = rates.filter((rate) => !rate.base && rate.region === "");
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState(tradable[0]?.code ?? "USD");
  const [to, setTo] = useState("YER");
  const quotes = tradable.map((rate) => ({ code: rate.code, buy: Number(rate.buy), sell: Number(rate.sell) }));
  const result = useMemo(() => exchange(Number(amount), from, to, quotes), [amount, from, to, quotes]);
  const options = ["YER", ...tradable.map((rate) => rate.code)];
  const formula = from === "YER"
    ? t("المبلغ ÷ سعر البيع", "Amount ÷ sell price")
    : to === "YER"
      ? t("المبلغ × سعر الشراء", "Amount × buy price")
      : t("إلى الريال بسعر الشراء، ثم إلى العملة الثانية بسعر البيع", "Into the rial at the buy price, then into the second currency at the sell price");
  return (
    <div className="grid gap-3">
      <Field label={t("المبلغ", "Amount")}>
        <input className={inputClass} inputMode="decimal" aria-label={t("المبلغ", "Amount")} value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Field>
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <Field label={t("من", "From")}>
          <select className={inputClass} aria-label={t("من", "From")} value={from} onChange={(e) => setFrom(e.target.value)}>
            {options.map((code) => <option key={`f-${code}`}>{code}</option>)}
          </select>
        </Field>
        <button
          type="button"
          className="mb-1 grid h-11 w-11 place-items-center rounded-full border border-line"
          aria-label={t("عكس الاتجاه", "Swap direction")}
          onClick={() => { setFrom(to); setTo(from); }}
        >
          <Fa name="right-left" />
        </button>
        <Field label={t("إلى", "To")}>
          <select className={inputClass} aria-label={t("إلى", "To")} value={to} onChange={(e) => setTo(e.target.value)}>
            {options.map((code) => <option key={`t-${code}`}>{code}</option>)}
          </select>
        </Field>
      </div>
      <p className="inline-flex items-center gap-2 font-display text-4xl tabular-nums">
        <Fa name="right-left" className="text-lg text-gold" />
        {result.ok ? formatMoney(result.result) : t("غير متاح", "Unavailable")}
      </p>
      <p className="text-xs text-muted">{formula}</p>
    </div>
  );
}

const NEXT: Record<string, [string, string]> = {
  draft: ["الحوالة لم تُستكمل بعد في نقطة الخدمة.", "The transfer is not finished at the service point yet."],
  processing: ["العملية قيد المراجعة. احتفظ بالرقم والرمز.", "The transfer is being reviewed. Keep the reference and code."],
  sent: ["أُرسلت الحوالة. انتظر حتى تصبح جاهزة للاستلام.", "The transfer was sent. Wait until it is ready for pickup."],
  ready: ["يمكن الاستلام في المدينة الظاهرة بعد إبراز الهوية والرمز.", "Pickup is possible in the city shown, with identification and the code."],
  collected: ["سُجّل الاستلام. للمراجعة استخدم مركز الشكاوى.", "Pickup is recorded. Use the complaints desk for a review."],
  cancelled: ["الحوالة ملغاة. راجع نقطة الخدمة أو قدّم شكوى.", "The transfer is cancelled. See the service point or file a complaint."],
  rejected: ["رُفضت الحوالة. قدم شكوى إن كنت صاحب الحق.", "The transfer was rejected. File a complaint if you are the entitled party."],
};

export function TrackBox() {
  const { lang, t } = useI18n();
  const [reference, setReference] = useState("");
  const [pin, setPin] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  return (
    <form
      className="grid gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError("");
        setResult(null);
        try {
          const next = await lookupTransfer({ data: { reference, pin } });
          setResult(next);
          if (!next.ok) setError(t("الرقم أو الرمز غير مطابق.", "The reference or the code does not match."));
        } catch (err) {
          setError(err instanceof Error ? err.message : t("تعذر الاستعلام", "Lookup failed"));
        } finally {
          setPending(false);
        }
      }}
    >
      <Field label={t("رقم الحوالة", "Reference")}>
        <input className={inputClass} value={reference} onChange={(e) => setReference(e.target.value)} autoComplete="off" />
        <span className="text-xs text-muted">{t("الرقم الصادر من الفرع أو الوكيل.", "The number issued by the branch or agent.")}</span>
      </Field>
      <Field label={t("رمز التحقق", "Verification code")}>
        <input className={inputClass} value={pin} onChange={(e) => setPin(e.target.value)} inputMode="numeric" autoComplete="off" />
        <span className="text-xs text-muted">{t("لا تشارك الرمز في قناة لا تعرفها.", "Do not share the code on a channel you do not trust.")}</span>
      </Field>
      {error ? (
        <div>
          <ErrorNote>{error}</ErrorNote>
          <Link to="/complaints" className="mt-2 inline-flex text-sm text-primary underline-offset-4 hover:underline">
            {t("قدّم شكوى", "File a complaint")}
          </Link>
        </div>
      ) : null}
      <PrimaryButton type="submit" disabled={pending}>
        <Fa name="magnifying-glass" />
        {pending ? t("جارٍ التحقق…", "Checking…") : t("عرض الحالة", "Show status")}
      </PrimaryButton>
      {result?.ok ? <StatusTimeline status={result.status} currency={result.currency} city={lang === "ar" ? result.pickupCityAr : result.pickupCityEn} updatedAt={result.updatedAt} note={lang === "ar" ? NEXT[result.status]?.[0] : NEXT[result.status]?.[1]} /> : null}
    </form>
  );
}

const FLOW = ["draft", "processing", "sent", "ready", "collected"] as const;

function StatusTimeline({ status, currency, city, updatedAt, note }: { status: string; currency: string; city: string; updatedAt: string; note?: string }) {
  const { lang, t } = useI18n();
  const stopped = status === "cancelled" || status === "rejected";
  const at = FLOW.indexOf(status as (typeof FLOW)[number]);
  return (
    <div className="rounded-2xl bg-paper p-4">
      <p className="font-display text-3xl">{statusLabel(status, lang)}</p>
      <p className="mt-2 text-sm text-muted">{currency}{city ? ` · ${city}` : ""}</p>
      <p className="mt-1 text-xs tabular-nums text-muted">{updatedAt}</p>
      {stopped ? null : (
        <ol className="mt-4 grid gap-2">
          {FLOW.map((step, index) => (
            <li key={step} className={`flex items-center gap-2 text-sm ${index <= at ? "text-ink" : "text-muted"}`}>
              <span className={`grid h-6 w-6 place-items-center rounded-full text-xs ${index <= at ? "bg-primary text-surface" : "bg-line"}`}>{index + 1}</span>
              {statusLabel(step, lang)}
            </li>
          ))}
        </ol>
      )}
      {note ? <p className="mt-3 text-sm">{note}</p> : null}
      <Link to="/complaints" className="mt-3 inline-flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline">
        <Fa name="comment-dots" />
        {t("مشكلة في الحوالة؟ قدّم شكوى", "A problem with the transfer? File a complaint")}
      </Link>
    </div>
  );
}
