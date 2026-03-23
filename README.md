# paw

Manage your [Bear](https://bear.app) notes from the command line. Create, search, tag, and organize notes without leaving your terminal.

**macOS only** — Bear is a macOS/iOS app and `paw` communicates with the desktop version directly.

## Install

```
npm install -g bear-cli
```

## Authentication

Bear uses API tokens to authorize access to your notes. Here's how to get yours:

1. Open **Bear** on your Mac
2. Go to **Help** > **Advanced** > **API Token**
3. Click **Copy Token**

Then run:

```
paw auth
```

Paste your token when prompted. `paw` will save it and verify it works by connecting to Bear.

You can also pass the token directly:

```
paw auth XXXXXX-XXXXXX-XXXXXX
```

Or set it as an environment variable (useful for scripts and CI):

```
export BEAR_API_TOKEN=XXXXXX-XXXXXX-XXXXXX
```

Token resolution: environment variable takes priority over saved config.

## Usage

### Notes

```bash
# Create a note
paw create --title "Meeting Notes" --body "# Action Items" --tags "work,meetings"

# Open a note by id
paw open --id 2E93B86F-3B4C-4A86-8B53-0C8BA28B58A9

# Search your notes
paw search "project plan"

# Append text to an existing note
paw add --id ABC-123 --text "- Buy groceries" --mode append

# Attach a file (auto base64-encoded)
paw add-file --id ABC-123 --file ./screenshot.png

# Save a webpage as a note
paw grab https://example.com/article --tags "reading"
```

### Tags

```bash
# List all tags
paw tags

# List notes with a specific tag
paw tag work

# Rename a tag
paw rename-tag "old-name" --new-name "new-name"

# Delete a tag
paw delete-tag "unused-tag"
```

### Lists

```bash
# Today's notes
paw today

# Notes with todo items
paw todo

# Untagged notes
paw untagged

# Locked notes
paw locked
```

### Organize

```bash
# Move a note to trash
paw trash --id ABC-123

# Archive a note
paw archive --id ABC-123

# Find and trash by search
paw trash --search "old draft"
```

## Flags

Every command supports:

- `--json` — Output raw JSON for scripting and piping
- `-q, --quiet` — Run without bringing Bear to the foreground

```bash
# Get all tags as JSON
paw tags --json

# Create a note silently
paw create --title "Log Entry" --body "$(date)" --quiet
```

Run `paw <command> --help` for all available options.

## Command Reference

| Command | Description |
|---------|-------------|
| `paw auth [token]` | Authenticate with Bear |
| `paw create` | Create a new note |
| `paw open` | Open a note |
| `paw add` | Add text to a note |
| `paw add-file` | Attach a file to a note |
| `paw search [term]` | Search notes |
| `paw tags` | List all tags |
| `paw tag [name]` | List notes with a tag |
| `paw rename-tag [name]` | Rename a tag |
| `paw delete-tag [name]` | Delete a tag |
| `paw trash` | Trash a note |
| `paw archive` | Archive a note |
| `paw untagged` | List untagged notes |
| `paw todo` | List notes with todos |
| `paw today` | List today's notes |
| `paw locked` | List locked notes |
| `paw grab [url]` | Save a webpage as a note |

## License

MIT
