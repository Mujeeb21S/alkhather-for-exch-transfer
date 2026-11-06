export type CommissionKind = "fixed" | "percent" | "tiered";

export type CommissionTier = {
  minAmount: number;
  maxAmount: number | null;
  percent: number;
  fixed: number;
};

export type CommissionPlan = {
  id: number;
  kind: CommissionKind;
  minAmount: number;
  maxAmount: number | null;
  percent: number;
  fixed: number;
  companyShare: number;
  tiers: CommissionTier[];
};

export type CommissionQuote = {
  fee: number;
  company: number;
  partner: number;
  planId: number;
};

export type GlLine = {
  currency: string;
  debit: number;
  credit: number;
};

const MONEY = 1_000_000_000_000;

export function round4(value: number) {
  return Math.round((value + Number.EPSILON) * 10000) / 10000;
}

export function quoteCommission(amount: number, plan: CommissionPlan): CommissionQuote | null {
  if (!Number.isFinite(amount) || amount <= 0 || amount > MONEY) return null;
  if (amount < plan.minAmount) return null;
  if (plan.maxAmount != null && amount > plan.maxAmount) return null;
  if (plan.companyShare < 0 || plan.companyShare > 100) return null;

  let fee = 0;
  if (plan.kind === "fixed") fee = plan.fixed;
  else if (plan.kind === "percent") fee = amount * (plan.percent / 100);
  else {
    const tier = plan.tiers.find(
      (item) => amount >= item.minAmount && (item.maxAmount == null || amount <= item.maxAmount),
    );
    if (!tier) return null;
    fee = tier.fixed + amount * (tier.percent / 100);
  }
  if (!Number.isFinite(fee) || fee < 0) return null;
  const rounded = round4(fee);
  const company = round4(rounded * (plan.companyShare / 100));
  const partner = round4(rounded - company);
  return { fee: rounded, company, partner, planId: plan.id };
}

export function assertBalanced(lines: GlLine[]) {
  if (!lines.length) throw new Error("القيد بلا بنود");
  const totals = new Map<string, { debit: number; credit: number }>();
  for (const line of lines) {
    if (!line.currency.trim()) throw new Error("عملة البند ناقصة");
    if (line.debit < 0 || line.credit < 0) throw new Error("مبلغ القيد لا يكون سالباً");
    if (line.debit > 0 && line.credit > 0) throw new Error("البند إما مدين أو دائن");
    if (line.debit === 0 && line.credit === 0) throw new Error("بند صفري");
    const bag = totals.get(line.currency) ?? { debit: 0, credit: 0 };
    bag.debit = round4(bag.debit + line.debit);
    bag.credit = round4(bag.credit + line.credit);
    totals.set(line.currency, bag);
  }
  for (const [currency, bag] of totals) {
    if (bag.debit !== bag.credit) throw new Error(`القيد غير متوازن لعملة ${currency}`);
  }
}

export function netBalance(lines: { debit: number; credit: number }[]) {
  return round4(lines.reduce((sum, line) => sum + line.debit - line.credit, 0));
}

export function availableBalance(balance: number, held: number) {
  return round4(balance - held);
}
