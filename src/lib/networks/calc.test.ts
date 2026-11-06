import assert from "node:assert/strict";
import test from "node:test";
import { assertBalanced, availableBalance, quoteCommission, type CommissionPlan } from "./calc.ts";

const base: CommissionPlan = {
  id: 7,
  kind: "percent",
  minAmount: 100,
  maxAmount: 10000,
  percent: 2,
  fixed: 0,
  companyShare: 60,
  tiers: [],
};

test("percent commission splits the fee without losing a fils", () => {
  const quote = quoteCommission(1000, base);
  assert.deepEqual(quote, { fee: 20, company: 12, partner: 8, planId: 7 });
});

test("fixed commission and amount bounds", () => {
  assert.equal(quoteCommission(50, { ...base, kind: "fixed", fixed: 5, minAmount: 100 }), null);
  assert.equal(quoteCommission(200, { ...base, kind: "fixed", fixed: 5, companyShare: 100 })?.partner, 0);
});

test("tiered commission picks the matching band", () => {
  const quote = quoteCommission(1500, {
    ...base,
    kind: "tiered",
    minAmount: 0,
    maxAmount: null,
    companyShare: 50,
    tiers: [
      { minAmount: 0, maxAmount: 1000, percent: 1, fixed: 0 },
      { minAmount: 1000.01, maxAmount: null, percent: 0, fixed: 25 },
    ],
  });
  assert.equal(quote?.fee, 25);
  assert.equal(quote?.company, 12.5);
  assert.equal(quote?.partner, 12.5);
});

test("journal lines must balance per currency", () => {
  assert.throws(() => assertBalanced([{ currency: "YER", debit: 10, credit: 0 }]));
  assert.doesNotThrow(() =>
    assertBalanced([
      { currency: "YER", debit: 10, credit: 0 },
      { currency: "YER", debit: 0, credit: 10 },
    ]),
  );
});

test("available balance subtracts holds", () => {
  assert.equal(availableBalance(100, 40), 60);
});
