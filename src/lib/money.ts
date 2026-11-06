export type RateQuote = {
  code: string;
  buy: number;
  sell: number;
};

export type ExchangeResult =
  | { ok: true; result: number; viaYer: boolean }
  | { ok: false; reason: "same" | "missing" | "invalid" };

const BASE = "YER";

function find(rates: RateQuote[], code: string) {
  return rates.find((r) => r.code === code);
}

/** Illustrative cross via Yemeni rial: sell-side uses buy, buy-side uses sell. */
export function exchange(
  amount: number,
  from: string,
  to: string,
  rates: RateQuote[],
): ExchangeResult {
  if (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000_000_000) {
    return { ok: false, reason: "invalid" };
  }
  if (from === to) return { ok: false, reason: "same" };
  if (amount === 0) return { ok: true, result: 0, viaYer: from !== BASE && to !== BASE };

  const src = from === BASE ? null : find(rates, from);
  const dst = to === BASE ? null : find(rates, to);
  if (from !== BASE && (!src || src.buy <= 0)) return { ok: false, reason: "missing" };
  if (to !== BASE && (!dst || dst.sell <= 0)) return { ok: false, reason: "missing" };

  let yer = amount;
  if (from !== BASE) yer = amount * (src as RateQuote).buy;
  let result = yer;
  if (to !== BASE) result = yer / (dst as RateQuote).sell;
  return {
    ok: true,
    result: Math.round(result * 100) / 100,
    viaYer: from !== BASE && to !== BASE,
  };
}

export function formatMoney(value: number | string) {
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export const TRANSFER_STATUS = [
  "draft",
  "processing",
  "sent",
  "ready",
  "collected",
  "cancelled",
  "rejected",
] as const;

export type TransferStatus = (typeof TRANSFER_STATUS)[number];

export function isTransferStatus(value: string): value is TransferStatus {
  return (TRANSFER_STATUS as readonly string[]).includes(value);
}
