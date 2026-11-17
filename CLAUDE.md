# CLAUDE.md

Standing rules for every session working on this project.

- No API keys, logins, or paid services. Data is entered manually via CLI commands and saved to a local JSON file.
- Runs with one command: `node cli.js <command> [args]`. No build step, no external npm dependencies.
- Core logic (parsing commands, computing price history/cheapest store/spending totals, reading and writing the data file) lives in `tracker.js` as pure, testable functions.
- `cli.js` only parses `process.argv` and prints output; it is not unit tested. Everything it calls into is.
- Tests run with `node --test`.
- Never undo or amend a commit.
