---
name: bear-cli
description: Manage Bear app notes from the command line on macOS. Use when the user wants to create, read, update, search, tag, trash, or archive notes in Bear. Triggers on mentions of Bear notes, note-taking, tags, or any Bear app interaction.
compatibility: Requires macOS with Bear app installed, Node.js, and the bear-cli npm package.
---

# Bear CLI

A Node.js CLI (`bear`) for managing Bear app notes from the terminal. Uses x-callback-urls via [urlhook](https://github.com/360ammar/urlhook).

## Setup

The CLI must be installed and authenticated before use:

```bash
npm install -g bear-cli
bear auth <BEAR_API_TOKEN>
```

Token is stored at `~/.config/bear/config.json`. You can also set `BEAR_API_TOKEN` env var.

## Commands

### List tags

```bash
bear tags
bear tags --json
```

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
bear open --id <NOTE_ID> --json
```

Returns title, identifier, tags, and full note content.

### Create a note

```bash
bear create --title "Title" --body "Content"
bear create --title "Title" --body "Content" --tags "tag1,tag2"
bear create --title "Title" --file /path/to/file
bear create --pin --edit
```

### Add text to a note

```bash
bear add --id <NOTE_ID> --text "New text"
bear add --title "Note Title" --text "New text" --mode append
bear add --id <NOTE_ID> --text "Full replacement" --mode replace_all
bear add --id <NOTE_ID> --text "Under heading" --header "Section"
bear add --id <NOTE_ID> --tags "newtag1,newtag2"
```

Modes: `append` (default), `prepend`, `replace`, `replace_all`.

### Add a file to a note

```bash
bear add-file --id <NOTE_ID> --file /path/to/image.png
bear add-file --title "Note" --file /path/to/doc.pdf --filename "report.pdf"
```

### List notes by tag

```bash
bear tag "people/family"
bear tag "work" --json
```

### Rename a tag

```bash
bear rename-tag "old-name" --new-name "new-name"
```

### Delete a tag

```bash
bear delete-tag "tag-name"
```

### List untagged notes

```bash
bear untagged
bear untagged --search "filter"
```

### List todo notes

```bash
bear todo
bear todo --search "project"
```

### List today's notes

```bash
bear today
bear today --search "meeting"
```

### List locked notes

```bash
bear locked
```

### Trash a note

```bash
bear trash --id <NOTE_ID>
bear trash --search "old note"
```

### Archive a note

```bash
bear archive --id <NOTE_ID>
bear archive --search "finished project"
```

### Grab a URL

```bash
bear grab "https://example.com"
bear grab "https://example.com" --tags "reading,web"
```

## Output format

- Human-friendly by default: `Title  [NOTE_ID]` per line
- `--json` flag returns raw JSON from Bear
- Note IDs are UUIDs like `856A8A32-C8DB-4E6C-9504-978499F1454E`

## Common patterns

### Update a note's entire content

```bash
bear add --id <NOTE_ID> --text "# New Title\nNew content\n\n#tag" --mode replace_all
```

### Batch operations

Search for notes, then operate on each by ID. Example — find and open all notes in a tag:

```bash
bear tag "work" --json
# Parse JSON to get identifiers, then open each
```

### Note content format

Bear uses Markdown. Tags are inline: `#tagname` or `#parent/child`. The first line (usually `# Heading`) becomes the note title.
