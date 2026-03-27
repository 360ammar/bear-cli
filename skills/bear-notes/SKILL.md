---
name: bear-notes
description: Use when the user asks to create, search, read, tag, organize, archive, or trash notes in Bear app. Also use when managing Bear tags, saving webpages to Bear, or working with Bear notes from the terminal.
compatibility: Requires macOS with Bear app installed and running, Node.js, and the bear-cub npm package.
---

# Bear Notes

A Node.js CLI (`bear`) for managing Bear app notes from the terminal. Uses x-callback-urls via [urlhook](https://github.com/360ammar/urlhook).

## Compatibility

- macOS only — communicates with Bear via x-callback-urls
- Bear app must be installed and running
- Node.js required

## Setup

If `bear` is not installed:

```bash
npm install -g bear-cub
```

Then authenticate (the user will need their Bear API token from Bear > Help > Advanced > API Token):

```bash
bear auth BEAR_API_TOKEN
```

Token is stored at `~/.config/bear/config.json`. You can also set `BEAR_API_TOKEN` env var.

## Always Use These Flags

- `--json` on every command — parse structured output, don't guess from human text

> Note: Bear windows are suppressed automatically (`show_window=no`). There is no `-q`/`--quiet` flag.

## Quick Reference

| Task           | Command                                                             |
| -------------- | ------------------------------------------------------------------- |
| Create note    | `bear create --title "X" --body "Y" --tags "a,b" --json`            |
| Read note      | `bear open --id ID --json`                                          |
| Read by title  | `bear open --title "X" --json`                                      |
| Search         | `bear search "term" --json`                                         |
| Search by tag  | `bear search "term" --tag "work" --json`                            |
| Append text    | `bear add --id ID --text "new text" --mode append --json`           |
| Prepend text   | `bear add --id ID --text "new text" --mode prepend --json`          |
| Replace text   | `bear add --id ID --text "full new body" --mode replace_all --json` |
| Attach file    | `bear add-file --id ID --file ./path.png --json`                    |
| List tags      | `bear tags --json`                                                  |
| Notes by tag   | `bear tag "work" --json`                                            |
| Rename tag     | `bear rename-tag "old" --new-name "new" --json`                     |
| Delete tag     | `bear delete-tag "unused" --json`                                   |
| Today's notes  | `bear today --json`                                                 |
| Todo notes     | `bear todo --json`                                                  |
| Untagged notes | `bear untagged --json`                                              |
| Locked notes   | `bear locked --json`                                                |
| Trash note     | `bear trash --id ID --json`                                         |
| Archive note   | `bear archive --id ID --json`                                       |
| Save webpage   | `bear grab "https://..." --tags "reading" --json`                   |

## Commands

### Search notes

```bash
bear search "query"
bear search "query" --tag "people/family"
bear search "" # list all notes
bear search --json
```

### Open a note

```bash
bear open --id <NOTE_ID>
bear open --title "Note Title"
bear open --id <NOTE_ID> --header "Section" --edit --pin
bear open --id <NOTE_ID> --new-window --float
bear open --id <NOTE_ID> --json
```

Returns title, identifier, tags, and full note content.

### Create a note

```bash
bear create --title "Title" --body "Content"
bear create --title "Title" --body "Content" --tags "tag1,tag2"
bear create --title "Title" --file /path/to/file --filename "report.pdf"
bear create --pin --edit --timestamp
bear create --title "Title" --body "<h1>HTML</h1>" --html
bear create --json
```

### Add text to a note

```bash
bear add --id <NOTE_ID> --text "New text"
bear add --title "Note Title" --text "New text" --mode append
bear add --id <NOTE_ID> --text "Full replacement" --mode replace_all
bear add --id <NOTE_ID> --text "Under heading" --header "Section"
bear add --id <NOTE_ID> --tags "newtag1,newtag2"
bear add --id <NOTE_ID> --text "Text" --new-line --timestamp
bear add --json
```

Modes: `append` (default), `prepend`, `replace`, `replace_all`.

### Add a file to a note

```bash
bear add-file --id <NOTE_ID> --file /path/to/image.png
bear add-file --title "Note" --file /path/to/doc.pdf --filename "report.pdf"
bear add-file --id <NOTE_ID> --file /path/to/file --header "Attachments" --mode append
bear add-file --json
```

### List tags

```bash
bear tags
bear tags --json
```

### List notes by tag

```bash
bear tag "people/family"
bear tag "work" --json
```

### Rename a tag

```bash
bear rename-tag "old-name" --new-name "new-name"
bear rename-tag "old-name" --new-name "new-name" --json
```

### Delete a tag

```bash
bear delete-tag "tag-name"
bear delete-tag "tag-name" --json
```

### List untagged notes

```bash
bear untagged
bear untagged --search "filter"
bear untagged --json
```

### List todo notes

```bash
bear todo
bear todo --search "project"
bear todo --json
```

### List today's notes

```bash
bear today
bear today --search "meeting"
bear today --json
```

### List locked notes

```bash
bear locked
bear locked --search "private"
bear locked --json
```

### Trash a note

```bash
bear trash --id <NOTE_ID>
bear trash --search "old note"
bear trash --json
```

### Archive a note

```bash
bear archive --id <NOTE_ID>
bear archive --search "finished project"
bear archive --json
```

### Grab a URL

```bash
bear grab "https://example.com"
bear grab "https://example.com" --tags "reading,web" --pin
bear grab --json
```

## Output format

- Human-friendly by default: `Title  [NOTE_ID]` per line
- `--json` flag returns raw JSON from Bear
- Note IDs are UUIDs like `856A8A32-C8DB-4E6C-9504-978499F1454E`

## Patterns

**Create and capture the ID:**

```bash
RESULT=$(bear create --title "Daily Log" --body "# $(date +%Y-%m-%d)" --tags "logs" --json)
# Parse identifier from JSON response
```

**Search then act on results:**

```bash
bear search "meeting notes" --tag "work" --json
# Returns JSON array of {title, identifier} objects
# Use identifier to open, add to, trash, or archive
```

**Append to an existing note by title:**

```bash
bear add --title "Running Log" --text "- Ran 5k today" --mode append --json
```

**Add text under a specific header:**

```bash
bear add --id ID --text "- New item" --header "Action Items" --mode append --json
```

**Update a note's entire content:**

```bash
bear add --id <NOTE_ID> --text "# New Title\nNew content\n\n#tag" --mode replace_all
```

## Notes

- Note identifiers are UUIDs returned in the `identifier` field
- Tags are comma-separated strings: `"work,project,urgent"`
- `--mode` options: `append`, `prepend`, `replace`, `replace_all`
- Files passed to `--file` are automatically base64-encoded
- Bear uses Markdown — tags are inline: `#tagname` or `#parent/child`
- The first line (usually `# Heading`) becomes the note title
- 10-second timeout — if Bear is locked or not running, commands will fail with a clear error
