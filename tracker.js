// Pure logic. No process.argv, no filesystem access here (that's cli.js's job),
// except loadData/saveData which wrap the one place a local file is read/written.
import fs from "node:fs";

// R5: save/load the purchase log to a local JSON file.
export function loadData(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function saveData(filePath, purchases) {
  fs.writeFileSync(filePath, JSON.stringify(purchases, null, 2));
}

// R1: log a purchase.
export function addPurchase(purchases, { item, price, store, date }) {
  return [...purchases, { item, price, store, date }];
}

function matchesItem(purchase, item) {
  return purchase.item.toLowerCase() === item.toLowerCase();
}

// R2: price history of an item, oldest first.
export function priceHistory(purchases, item) {
  return purchases
    .filter((p) => matchesItem(p, item))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// R3: which store had the cheapest price for an item.
export function cheapestStore(purchases, item) {
  const matches = purchases.filter((p) => matchesItem(p, item));
  if (matches.length === 0) return null;
  const cheapest = matches.reduce((min, p) => (p.price < min.price ? p : min));
  return { store: cheapest.store, price: cheapest.price };
}

function periodKey(date, period) {
  return period === "monthly" ? date.slice(0, 7) : date;
}

// R4: total spending grouped by day or month.
export function totalSpending(purchases, period) {
  const totals = {};
  for (const purchase of purchases) {
    const key = periodKey(purchase.date, period);
    totals[key] = (totals[key] || 0) + purchase.price;
  }
  return totals;
}
