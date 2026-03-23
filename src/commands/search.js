export async function runSearch({ term, tag, callBear, token, json, quiet }) {
  const response = await callBear('search', {
    token,
    term,
    tag,
    show_window: quiet ? 'no' : undefined,
  });

  const notes = JSON.parse(response.notes || '[]');

  if (json) {
    return JSON.stringify(notes, null, 2);
  }

  if (notes.length === 0) {
    return 'No notes found.';
  }

  return notes.map(n => `${n.title}  [${n.identifier}]`).join('\n');
}

export function register(program, { getToken, callBear }) {
  program
    .command('search [term]')
    .description('Search notes')
    .option('-t, --tag <tag>', 'Filter by tag')
    .option('--json', 'Output as JSON')
    .option('-q, --quiet', 'Don\'t open Bear window')
    .action(async (term, opts) => {
      const token = getToken();
      if (!token) {
        console.error('No API token found. Run `paw auth` to set up.');
        process.exit(1);
      }
      const output = await runSearch({
        term,
        tag: opts.tag,
        callBear,
        token,
        json: opts.json,
        quiet: opts.quiet,
      });
      console.log(output);
    });
}
