# Spec

## Round 1 (covers R1-R6)

### Data model
Purchases are stored as a JSON array of `{ item, price, store, date }` objects in `data.json` (dates as `"YYYY-MM-DD"` strings). All logic in `tracker.js` is pure: it takes a purchases array in, returns a new array or computed value out. `cli.js` is the only place that touches the filesystem and `process.argv`.

### R1 - Log a purchase
`addPurchase(purchases, { item, price, store, date })` returns a new array with the purchase appended.
CLI: `node cli.js add <item> <price> <store> <date>`

### R2 - Price history of an item
`priceHistory(purchases, item)` returns that item's purchases, sorted by date ascending. Case-insensitive match on item name.
CLI: `node cli.js history <item>`

### R3 - Cheapest store for an item
`cheapestStore(purchases, item)` returns `{ store, price }` for the lowest price on record for that item, or `null` if there's no data for it.
CLI: `node cli.js cheapest <item>`

### R4 - Total spending over a time period
`totalSpending(purchases, period)` where `period` is `"daily"` or `"monthly"`. Returns an object mapping each date (or year-month) to the total spent that day/month.
CLI: `node cli.js spending daily` / `node cli.js spending monthly`

### R5 - Data saved to a local file
`loadData(path)` reads and parses `data.json`, returning `[]` if the file doesn't exist yet. `saveData(path, purchases)` writes it back out. `cli.js` calls these around each command.

### R6 - Runs from the command line with arguments
`cli.js` reads `process.argv.slice(2)` for the command and its arguments, and prints results to stdout. No interactive prompts.

### Out of scope for Round 1
Editing/deleting a logged purchase, multiple currencies, budgets/alerts.
