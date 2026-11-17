# Grocery Tracker

A command-line tool for tracking what you pay for groceries, so you can tell whether a sale is actually a good deal and see where your money goes each month.

## Run it

```
node cli.js add <item> <price> <store> <date>
node cli.js history <item>
node cli.js cheapest <item>
node cli.js spending <daily|monthly>
```

Example:
```
node cli.js add Milk 3.99 Jewel 2026-11-01
node cli.js history Milk
node cli.js cheapest Milk
node cli.js spending monthly
```

Data is saved to `data.json` in this folder. No install step, no API keys.

## Run the tests

```
node --test
```
