# paw

A CLI for [Bear](https://bear.app) on macOS, wrapping Bear's x-callback-url API.

## Install

```
npm install -g paw-cli
```

## Setup

```
paw auth
```

Follow the prompts to paste your Bear API token (found in Bear > Help > Advanced > API Token).

Alternatively, set the `BEAR_API_TOKEN` environment variable.

## Commands

| Command | Description |
|---------|-------------|
| `paw auth [token]` | Set up Bear API token |
| `paw create` | Create a new note |
| `paw open` | Open a note by id or title |
| `paw add` | Append/prepend text to a note |
| `paw add-file` | Attach a file to a note |
| `paw search [term]` | Search notes |
| `paw tags` | List all tags |
| `paw tag [name]` | List notes with a tag |
| `paw rename-tag [name]` | Rename a tag |
| `paw delete-tag [name]` | Delete a tag |
| `paw trash` | Move a note to trash |
| `paw archive` | Archive a note |
| `paw untagged` | List untagged notes |
| `paw todo` | List notes with todos |
| `paw today` | List today's notes |
| `paw locked` | List locked notes |
| `paw grab [url]` | Save a webpage as a note |

## Flags

All commands support:
- `--json` — Machine-readable JSON output
- `-q, --quiet` — Suppress Bear's window (`show_window=no`)

Run `paw <command> --help` for command-specific options.

## Examples

```bash
# Create a note
paw create --title "Meeting Notes" --body "# Action Items" --tags "work,meetings"

# Search and get JSON
paw search "project plan" --json

# Append text to a note
paw add --id ABC-123 --text "New item" --mode append

# List all tags
paw tags

# Grab a URL
paw grab https://example.com --tags "reading"
```

## License

MIT
