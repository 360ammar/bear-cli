# bear-cli

A Node.js CLI for managing Bear app notes from the terminal.

## Project Structure
- `bin/bear.js` — Entry point, Commander setup
- `src/bear.js` — Core: builds URLs, executes via `open`, captures response via ephemeral HTTP server
- `src/config.js` — Token storage (~/.config/paw/config.json) + env var resolution
- `src/commands/*.js` — One file per CLI command

## Tech Stack
- Node.js + Commander.js
- No build step, plain JS (ESM)
- macOS only (uses `open` command for x-callback-urls)

## Key Design Decisions
- Bear responses captured via ephemeral localhost HTTP server (x-success callback)
- Token resolution: `BEAR_API_TOKEN` env var → `~/.config/paw/config.json`
- Human-friendly output by default, `--json` flag for machine output
- `--quiet` flag maps to Bear's `show_window=no`
- All URL params use `encodeURIComponent` (no `+` encoding bugs)
- 5 second timeout for Bear responses
- Binary is `bear`, package is `bear-cli`

## Git Conventions
- No Claude attribution in commits
- Concise commit messages focused on the "why"
