# paw-cli Design Spec

## Overview

`paw-cli` is a Node.js CLI that wraps Bear app's x-callback-url API. It exposes all 16 Bear API endpoints as clean subcommands with human-friendly default output and a `--json` flag for machine consumption.

- **Package name:** `paw-cli`
- **Binary:** `paw`
- **Runtime:** Node.js
- **Arg parsing:** Commander.js
- **Target platform:** macOS (Bear is macOS/iOS only; CLI targets macOS)

## Authentication

- `paw auth [token]` saves the token to `~/.config/paw/config.json`
- If no token argument is provided, prints a step-by-step guide for finding the token in Bear (Help → Advanced → API Token → Copy Token), then prompts the user to paste it
- Validates the token by calling Bear's `/tags` endpoint
- `BEAR_API_TOKEN` environment variable overrides the config file value
- Token resolution order: env var → config file → error with instructions

## Core Mechanism (`src/bear.js`)

1. Build a `bear://x-callback-url/{action}?{params}` URL with proper `encodeURIComponent` encoding
2. Start an ephemeral HTTP server on a random available port
3. Append `x-success=http://localhost:{port}/callback` and `x-error=http://localhost:{port}/error` to the URL
4. Execute `open "{url}"` via Node's `child_process.exec`
5. Bear processes the action and redirects to the callback URL
6. Parse the query parameters from the callback request
7. Shut down the server, return parsed response
8. Timeout after 5 seconds with a clear error message (Bear not running, app locked, etc.)

## Config Module (`src/config.js`)

- Reads/writes `~/.config/paw/config.json`
- Creates the directory and file if they don't exist
- Exposes `getToken()` and `setToken(token)` functions
- `getToken()` checks `BEAR_API_TOKEN` env var first, then config file

## Project Structure

```
paw-cli/
├── bin/
│   └── paw.js              # Entry point, Commander setup, registers all commands
├── src/
│   ├── commands/            # One file per command
│   │   ├── auth.js
│   │   ├── create.js
│   │   ├── open-note.js
│   │   ├── add-text.js
│   │   ├── add-file.js
│   │   ├── search.js
│   │   ├── tags.js
│   │   ├── open-tag.js
│   │   ├── rename-tag.js
│   │   ├── delete-tag.js
│   │   ├── trash.js
│   │   ├── archive.js
│   │   ├── untagged.js
│   │   ├── todo.js
│   │   ├── today.js
│   │   ├── locked.js
│   │   └── grab-url.js
│   ├── bear.js              # Core: builds URLs, executes via open, captures via HTTP callback
│   └── config.js            # Token storage/retrieval
├── package.json
└── README.md
```

## Command Reference

All commands support `--json` for machine-readable output and `--quiet` to suppress Bear's window (maps to `show_window=no`).

### paw auth [token]
- No Bear API mapping — local config management
- Saves token to config, validates via `/tags` call

### paw create
- Bear action: `/create`
- Flags: `--title`, `--body`, `--tags`, `--file`, `--filename`, `--pin`, `--edit`, `--timestamp`, `--html`
- Returns: note identifier and title

### paw open
- Bear action: `/open-note`
- Flags: `--id`, `--title`, `--header`, `--pin`, `--edit`, `--new-window`, `--float`
- Returns: note text, identifier, title, tags, dates

### paw add
- Bear action: `/add-text`
- Flags: `--id`, `--title`, `--text`, `--header`, `--mode` (append|prepend|replace|replace_all), `--tags`, `--new-line`, `--timestamp`
- Returns: updated note text and title

### paw add-file
- Bear action: `/add-file`
- Flags: `--id`, `--title`, `--file` (path, auto base64-encoded), `--filename`, `--header`, `--mode`
- Returns: updated note text

### paw search [term]
- Bear action: `/search`
- Positional: search term
- Flags: `--tag`
- Returns: list of matching notes (requires token)

### paw tags
- Bear action: `/tags`
- No additional flags
- Returns: list of all tags (requires token)

### paw tag [name]
- Bear action: `/open-tag`
- Positional: tag name (comma-separated for multiple)
- Returns: list of notes with that tag (requires token)

### paw rename-tag [name]
- Bear action: `/rename-tag`
- Positional: current tag name
- Flags: `--new-name` (required)

### paw delete-tag [name]
- Bear action: `/delete-tag`
- Positional: tag name

### paw trash
- Bear action: `/trash`
- Flags: `--id`, `--search`

### paw archive
- Bear action: `/archive`
- Flags: `--id`, `--search`

### paw untagged
- Bear action: `/untagged`
- Flags: `--search`
- Returns: list of untagged notes (requires token)

### paw todo
- Bear action: `/todo`
- Flags: `--search`
- Returns: list of todo notes (requires token)

### paw today
- Bear action: `/today`
- Flags: `--search`
- Returns: list of today's notes (requires token)

### paw locked
- Bear action: `/locked`
- Flags: `--search`

### paw grab [url]
- Bear action: `/grab-url`
- Positional: URL to capture
- Flags: `--tags`, `--pin`
- Returns: note identifier and title

## Output Formatting

**Human-friendly (default):** Formatted text output. Note lists show title + id. Single note shows full content. Tags show as a simple list.

**JSON (`--json`):** Raw parsed response from Bear as JSON object. Lists return JSON arrays.

## Error Handling

- Bear not running → "Bear is not running. Please open Bear and try again."
- Token missing for token-required commands → "No API token found. Run `paw auth` to set up."
- Timeout (5s) → "Bear did not respond. The app may be locked or not running."
- Invalid token → "Invalid API token. Run `paw auth` to update."
