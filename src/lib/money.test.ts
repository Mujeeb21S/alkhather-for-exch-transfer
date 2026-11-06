import assert from "node:assert/strict";
import test from "node:test";
import { exchange } from "./money.ts";

const rates = [
  { code: "USD", buy: 100, sell: 102 },
  { code: "SAR", buy: 26, sell: 27 },
];

test("selling foreign currency uses the buy price", () => {
  const q = exchange(10, "USD", "YER", rates);
  assert.equal(q.ok, true);
  if (q.ok) assert.equal(q.result, 1000);
});

test("buying foreign currency uses the sell price", () => {
  const q = exchange(1020, "YER", "USD", rates);
  assert.equal(q.ok, true);
  if (q.ok) assert.equal(q.result, 10);
});

test("cross rate goes through the rial", () => {
  const q = exchange(10, "USD", "SAR", rates);
  assert.equal(q.ok, true);
  if (q.ok) {
    assert.equal(q.viaYer, true);
    assert.equal(q.result, 37.04);
  }
});

test("rejects a missing pair", () => {
  const q = exchange(10, "EUR", "YER", rates);
  assert.deepEqual(q, { ok: false, reason: "missing" });
});
