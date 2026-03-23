---
name: bear-notes
description: Use when the user asks to create, search, read, tag, organize, archive, or trash notes in Bear app. Also use when managing Bear tags, saving webpages to Bear, or working with Bear notes from the terminal.
---

# Bear Notes

Manage Bear app notes via the `paw` CLI. Requires macOS with Bear installed and authenticated.

## Setup

If `paw` is not authenticated, run:

```bash
paw auth
```

The user will need their Bear API token from Bear > Help > Advanced > API Token.

## Always Use These Flags

- `--json` on every command — parse structured output, don't guess from human text
- `-q` (quiet) — prevent Bear from stealing focus

## Quick Reference

| Task | Command |
|------|---------|
| Create note | `paw create --title "X" --body "Y" --tags "a,b" --json -q` |
| Read note | `paw open --id ID --json -q` |
| Read by title | `paw open --title "X" --json -q` |
| Search | `paw search "term" --json -q` |
| Search by tag | `paw search "term" --tag "work" --json -q` |
| Append text | `paw add --id ID --text "new text" --mode append --json -q` |
| Prepend text | `paw add --id ID --text "new text" --mode prepend --json -q` |
| Replace text | `paw add --id ID --text "full new body" --mode replace_all --json -q` |
| Attach file | `paw add-file --id ID --file ./path.png --json -q` |
| List tags | `paw tags --json -q` |
| Notes by tag | `paw tag "work" --json -q` |
| Rename tag | `paw rename-tag "old" --new-name "new" --json -q` |
| Delete tag | `paw delete-tag "unused" --json -q` |
| Today's notes | `paw today --json -q` |
| Todo notes | `paw todo --json -q` |
| Untagged notes | `paw untagged --json -q` |
| Trash note | `paw trash --id ID --json -q` |
| Archive note | `paw archive --id ID --json -q` |
| Save webpage | `paw grab "https://..." --tags "reading" --json -q` |

## Patterns

**Create and capture the ID:**

```bash
RESULT=$(paw create --title "Daily Log" --body "# $(date +%Y-%m-%d)" --tags "logs" --json -q)
# Parse identifier from JSON response
```

**Search then act on results:**

```bash
paw search "meeting notes" --tag "work" --json -q
# Returns JSON array of {title, identifier} objects
# Use identifier to open, add to, trash, or archive
```

**Append to an existing note by title:**

```bash
paw add --title "Running Log" --text "- Ran 5k today" --mode append --json -q
```

**Add text under a specific header:**

```bash
paw add --id ID --text "- New item" --header "Action Items" --mode append --json -q
```

## Notes

- Note identifiers are UUIDs returned in the `identifier` field
- Tags are comma-separated strings: `"work,project,urgent"`
- `--mode` options: `append`, `prepend`, `replace`, `replace_all`
- Files passed to `--file` are automatically base64-encoded
- Bear must be running on the Mac for commands to work
- 5-second timeout — if Bear is locked or not running, commands will fail with a clear error
