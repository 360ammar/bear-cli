# bear-cli

Manage your [Bear](https://bear.app) notes from the command line. Create, search, tag, and organize notes without leaving your terminal.

**macOS only** — Bear is a macOS/iOS app and `bear` communicates with the desktop version directly.

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
bear auth
```

Paste your token when prompted. `bear` will save it and verify it works by connecting to Bear.

You can also pass the token directly:

```
bear auth XXXXXX-XXXXXX-XXXXXX
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
bear create --title "Meeting Notes" --body "# Action Items" --tags "work,meetings"

# Open a note by id
bear open --id 2E93B86F-3B4C-4A86-8B53-0C8BA28B58A9

# Search your notes
bear search "project plan"

# Append text to an existing note
bear add --id ABC-123 --text "- Buy groceries" --mode append

# Attach a file (auto base64-encoded)
bear add-file --id ABC-123 --file ./screenshot.png

# Save a webpage as a note
bear grab https://example.com/article --tags "reading"
```

### Tags

```bash
# List all tags
bear tags

# List notes with a specific tag
bear tag work

# Rename a tag
bear rename-tag "old-name" --new-name "new-name"

# Delete a tag
bear delete-tag "unused-tag"
```

### Lists

```bash
# Today's notes
bear today

# Notes with todo items
bear todo

# Untagged notes
bear untagged

# Locked notes
bear locked
```

### Organize

```bash
# Move a note to trash
bear trash --id ABC-123

# Archive a note
bear archive --id ABC-123

# Find and trash by search
bear trash --search "old draft"
```

## Flags

Every command supports:

- `--json` — Output raw JSON for scripting and piping
- `-q, --quiet` — Run without bringing Bear to the foreground

```bash
# Get all tags as JSON
bear tags --json

# Create a note silently
bear create --title "Log Entry" --body "$(date)" --quiet
```

Run `bear <command> --help` for all available options.

## Command Reference

| Command | Description |
|---------|-------------|
| `bear auth [token]` | Authenticate with Bear |
| `bear create` | Create a new note |
| `bear open` | Open a note |
| `bear add` | Add text to a note |
| `bear add-file` | Attach a file to a note |
| `bear search [term]` | Search notes |
| `bear tags` | List all tags |
| `bear tag [name]` | List notes with a tag |
| `bear rename-tag [name]` | Rename a tag |
| `bear delete-tag [name]` | Delete a tag |
| `bear trash` | Trash a note |
| `bear archive` | Archive a note |
| `bear untagged` | List untagged notes |
| `bear todo` | List notes with todos |
| `bear today` | List today's notes |
| `bear locked` | List locked notes |
| `bear grab [url]` | Save a webpage as a note |

## License

MIT
