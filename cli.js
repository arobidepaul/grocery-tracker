#!/usr/bin/env node
// R6: runs from the command line with arguments. Only argv parsing and
// printing live here; everything else is in tracker.js and is unit tested.
import path from "node:path";
import {
  loadData, saveData, addPurchase, priceHistory, cheapestStore, totalSpending,
} from "./tracker.js";

const DATA_FILE = path.join(path.dirname(new URL(import.meta.url).pathname), "data.json");

const [command, ...args] = process.argv.slice(2);
const purchases = loadData(DATA_FILE);

switch (command) {
  case "add": {
    const [item, price, store, date] = args;
    if (!item || !price || !store || !date) {
      console.error("Usage: node cli.js add <item> <price> <store> <date>");
      process.exit(1);
    }
    const updated = addPurchase(purchases, { item, price: Number(price), store, date });
    saveData(DATA_FILE, updated);
    console.log(`Logged ${item} for $${Number(price).toFixed(2)} at ${store} on ${date}.`);
    break;
  }

  case "history": {
    const [item] = args;
    const history = priceHistory(purchases, item);
    if (history.length === 0) {
      console.log(`No purchases logged for "${item}".`);
      break;
    }
    for (const p of history) {
      console.log(`${p.date}  $${p.price.toFixed(2)}  ${p.store}`);
    }
    break;
  }

  case "cheapest": {
    const [item] = args;
    const result = cheapestStore(purchases, item);
    console.log(result ? `${result.store}: $${result.price.toFixed(2)}` : `No purchases logged for "${item}".`);
    break;
  }

  case "spending": {
    const [period] = args;
    if (period !== "daily" && period !== "monthly") {
      console.error("Usage: node cli.js spending <daily|monthly>");
      process.exit(1);
    }
    const totals = totalSpending(purchases, period);
    for (const [key, total] of Object.entries(totals).sort()) {
      console.log(`${key}: $${total.toFixed(2)}`);
    }
    break;
  }

  default:
    console.log("Commands: add <item> <price> <store> <date> | history <item> | cheapest <item> | spending <daily|monthly>");
}
