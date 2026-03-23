---
name: bear-notes
description: Use when the user asks to create, search, read, tag, organize, archive, or trash notes in Bear app. Also use when managing Bear tags, saving webpages to Bear, or working with Bear notes from the terminal.
---

# Bear Notes

Manage Bear app notes via the `bear` CLI. Requires macOS with Bear installed and authenticated.

## Setup

If `bear` is not installed:

```bash
npm install -g bear-cli
```

Then authenticate (the user will need their Bear API token from Bear > Help > Advanced > API Token):

```bash
bear auth
```

## Always Use These Flags

- `--json` on every command — parse structured output, don't guess from human text
- `-q` (quiet) — prevent Bear from stealing focus

## Quick Reference

| Task | Command |
|------|---------|
| Create note | `bear create --title "X" --body "Y" --tags "a,b" --json -q` |
| Read note | `bear open --id ID --json -q` |
| Read by title | `bear open --title "X" --json -q` |
| Search | `bear search "term" --json -q` |
| Search by tag | `bear search "term" --tag "work" --json -q` |
| Append text | `bear add --id ID --text "new text" --mode append --json -q` |
| Prepend text | `bear add --id ID --text "new text" --mode prepend --json -q` |
| Replace text | `bear add --id ID --text "full new body" --mode replace_all --json -q` |
| Attach file | `bear add-file --id ID --file ./path.png --json -q` |
| List tags | `bear tags --json -q` |
| Notes by tag | `bear tag "work" --json -q` |
| Rename tag | `bear rename-tag "old" --new-name "new" --json -q` |
| Delete tag | `bear delete-tag "unused" --json -q` |
| Today's notes | `bear today --json -q` |
| Todo notes | `bear todo --json -q` |
| Untagged notes | `bear untagged --json -q` |
| Trash note | `bear trash --id ID --json -q` |
| Archive note | `bear archive --id ID --json -q` |
| Save webpage | `bear grab "https://..." --tags "reading" --json -q` |

## Patterns

**Create and capture the ID:**

```bash
RESULT=$(bear create --title "Daily Log" --body "# $(date +%Y-%m-%d)" --tags "logs" --json -q)
# Parse identifier from JSON response
```

**Search then act on results:**

```bash
bear search "meeting notes" --tag "work" --json -q
# Returns JSON array of {title, identifier} objects
# Use identifier to open, add to, trash, or archive
```

**Append to an existing note by title:**

```bash
bear add --title "Running Log" --text "- Ran 5k today" --mode append --json -q
```

**Add text under a specific header:**

```bash
bear add --id ID --text "- New item" --header "Action Items" --mode append --json -q
```

## Notes

- Note identifiers are UUIDs returned in the `identifier` field
- Tags are comma-separated strings: `"work,project,urgent"`
- `--mode` options: `append`, `prepend`, `replace`, `replace_all`
- Files passed to `--file` are automatically base64-encoded
- Bear must be running on the Mac for commands to work
- 5-second timeout — if Bear is locked or not running, commands will fail with a clear error
