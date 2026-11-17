import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  loadData, saveData, addPurchase, priceHistory, cheapestStore, totalSpending,
} from "./tracker.js";

test("R1: logging a purchase adds it to the list", () => {
  const purchases = addPurchase([], { item: "Milk", price: 3.99, store: "Jewel", date: "2026-11-01" });
  assert.equal(purchases.length, 1);
  assert.deepEqual(purchases[0], { item: "Milk", price: 3.99, store: "Jewel", date: "2026-11-01" });
});

test("R1: logging a purchase does not mutate the original list", () => {
  const original = [];
  addPurchase(original, { item: "Milk", price: 3.99, store: "Jewel", date: "2026-11-01" });
  assert.equal(original.length, 0);
});

test("R2: price history returns only that item's purchases, oldest first", () => {
  const purchases = [
    { item: "Milk", price: 4.5, store: "Target", date: "2026-11-05" },
    { item: "Eggs", price: 2.0, store: "Jewel", date: "2026-11-02" },
    { item: "milk", price: 3.99, store: "Jewel", date: "2026-11-01" },
  ];
  const history = priceHistory(purchases, "Milk");
  assert.equal(history.length, 2);
  assert.equal(history[0].date, "2026-11-01");
  assert.equal(history[1].date, "2026-11-05");
});

test("R2: price history for an item never purchased is empty", () => {
  assert.deepEqual(priceHistory([], "Bread"), []);
});

test("R3: cheapest store returns the lowest recorded price", () => {
  const purchases = [
    { item: "Milk", price: 4.5, store: "Target", date: "2026-11-05" },
    { item: "Milk", price: 3.99, store: "Jewel", date: "2026-11-01" },
    { item: "Milk", price: 4.25, store: "Aldi", date: "2026-11-03" },
  ];
  assert.deepEqual(cheapestStore(purchases, "Milk"), { store: "Jewel", price: 3.99 });
});

test("R3: cheapest store for an item with no purchases is null", () => {
  assert.equal(cheapestStore([], "Milk"), null);
});

test("R4: daily spending sums purchases by date", () => {
  const purchases = [
    { item: "Milk", price: 3.99, store: "Jewel", date: "2026-11-01" },
    { item: "Eggs", price: 2.0, store: "Jewel", date: "2026-11-01" },
    { item: "Bread", price: 2.5, store: "Aldi", date: "2026-11-02" },
  ];
  assert.deepEqual(totalSpending(purchases, "daily"), {
    "2026-11-01": 5.99,
    "2026-11-02": 2.5,
  });
});

test("R4: monthly spending sums purchases by year-month", () => {
  const purchases = [
    { item: "Milk", price: 3.99, store: "Jewel", date: "2026-11-01" },
    { item: "Bread", price: 2.5, store: "Aldi", date: "2026-11-20" },
    { item: "Eggs", price: 2.0, store: "Jewel", date: "2026-10-15" },
  ];
  assert.deepEqual(totalSpending(purchases, "monthly"), {
    "2026-11": 6.49,
    "2026-10": 2.0,
  });
});

test("R5: data saved to a file can be loaded back", () => {
  const tmpFile = path.join(os.tmpdir(), `grocery-test-${Date.now()}.json`);
  const purchases = addPurchase([], { item: "Milk", price: 3.99, store: "Jewel", date: "2026-11-01" });
  saveData(tmpFile, purchases);
  const loaded = loadData(tmpFile);
  assert.deepEqual(loaded, purchases);
  fs.unlinkSync(tmpFile);
});

test("R5: loading a file that doesn't exist yet returns an empty list", () => {
  const missingFile = path.join(os.tmpdir(), `grocery-missing-${Date.now()}.json`);
  assert.deepEqual(loadData(missingFile), []);
});
