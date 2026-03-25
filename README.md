# bear-cub

Manage your [Bear](https://bear.app) notes from the command line. Create, search, tag, and organize notes without leaving your terminal.

**macOS only** — Bear is a macOS/iOS app and `bear` communicates with the desktop version via [urlhook](https://github.com/360ammar/urlhook).

## Install

```
npm install -g bear-cub
```

## Authentication

Bear uses API tokens to authorize access to your notes:

1. Open **Bear** on your Mac
2. Go to **Help** > **Advanced** > **API Token**
3. Click **Copy Token**

Then run:

```
bear auth
```

Paste your token when prompted.

You can also pass the token directly or set it as an environment variable:

```bash
bear auth XXXXXX-XXXXXX-XXXXXX
# or
export BEAR_API_TOKEN=XXXXXX-XXXXXX-XXXXXX
```

Token resolution: environment variable takes priority over saved config (`~/.config/bear/config.json`).

## Usage

### Notes

```bash
bear create --title "Meeting Notes" --body "# Action Items" --tags "work,meetings"
bear open --id 2E93B86F-3B4C-4A86-8B53-0C8BA28B58A9
bear search "project plan"
bear add --id ABC-123 --text "- Buy groceries" --mode append
bear add-file --id ABC-123 --file ./screenshot.png
bear grab https://example.com/article --tags "reading"
```

### Tags

```bash
bear tags
bear tag work
bear rename-tag "old-name" --new-name "new-name"
bear delete-tag "unused-tag"
```

### Lists

```bash
bear today
bear todo
bear untagged
bear locked
```

### Organize

```bash
bear trash --id ABC-123
bear archive --id ABC-123
bear trash --search "old draft"
```

## Flags

Every command supports:

- `--json` — Output raw JSON for scripting and piping
- `--help` — Show command options

```bash
bear tags --json
bear search "notes" --tag "work" --json
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

## Agent Skill

bear-cub ships with an [Agent Skill](https://agentskills.io) at `.agents/skills/bear-cli/SKILL.md`. This lets AI coding agents (GitHub Copilot, Claude Code, Codex, etc.) automatically use the Bear CLI when you ask them to manage your notes.

The skill activates when you mention Bear notes, tags, or note management in your agent conversation. No setup needed — agents discover it automatically from your project.

## License

MIT
