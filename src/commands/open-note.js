export async function runOpenNote({ id, title, header, pin, edit, newWindow, float, callBear, token, json, quiet }) {
  const response = await callBear('open-note', {
    token, id, title, header, pin, edit,
    new_window: newWindow, float,
    show_window: quiet ? 'no' : undefined,
  });

  if (json) return JSON.stringify(response, null, 2);

  const lines = [`${response.title}  [${response.identifier}]`];
  if (response.tags) lines.push(`Tags: ${response.tags}`);
  if (response.note) lines.push('', response.note);
  return lines.join('\n');
}

export function register(program, { getToken, callBear }) {
  program
    .command('open')
    .description('Open a note')
    .option('--id <id>', 'Note identifier')
    .option('--title <title>', 'Note title')
    .option('--header <header>', 'Header to scroll to')
    .option('--pin', 'Pin the note')
    .option('--edit', 'Open in edit mode')
    .option('--new-window', 'Open in new window')
    .option('--float', 'Open as floating window')
    .option('--json', 'Output as JSON')
    .option('-q, --quiet', 'Don\'t open Bear window')
    .action(async (opts) => {
      const token = getToken();
      const output = await runOpenNote({ ...opts, callBear, token });
      console.log(output);
    });
}
