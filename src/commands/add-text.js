export async function runAddText({ id, title, text, header, mode, tags, newLine, timestamp, callBear, token, json, quiet }) {
  const response = await callBear('add-text', {
    token, id, title, text, header, mode, tags,
    new_line: newLine, timestamp,
    show_window: quiet ? 'no' : undefined,
  });

  if (json) return JSON.stringify(response, null, 2);
  return `Updated: ${response.title}`;
}

export function register(program, { getToken, callBear }) {
  program
    .command('add')
    .description('Add text to a note')
    .option('--id <id>', 'Note identifier')
    .option('--title <title>', 'Note title')
    .option('--text <text>', 'Text to add')
    .option('--header <header>', 'Header to add text under')
    .option('--mode <mode>', 'append, prepend, replace, or replace_all')
    .option('--tags <tags>', 'Comma-separated tags')
    .option('--new-line', 'Add newline before text')
    .option('--timestamp', 'Prepend timestamp')
    .option('--json', 'Output as JSON')
    .option('-q, --quiet', 'Don\'t open Bear window')
    .action(async (opts) => {
      const token = getToken();
      if (!token) {
        console.error('No API token found. Run `bear auth` to set up.');
        process.exit(1);
      }
      const output = await runAddText({ ...opts, callBear, token });
      console.log(output);
    });
}
