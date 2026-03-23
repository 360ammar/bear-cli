export async function runUntagged({ search, callBear, token, json, quiet }) {
  const response = await callBear('untagged', {
    token,
    search,
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
    .command('untagged')
    .description('List untagged notes')
    .option('-s, --search <term>', 'Filter by search term')
    .option('--json', 'Output as JSON')
    .option('-q, --quiet', "Don't open Bear window")
    .action(async (opts) => {
      const token = getToken();
      if (!token) {
        console.error('No API token found. Run `paw auth` to set up.');
        process.exit(1);
      }
      const output = await runUntagged({
        search: opts.search,
        callBear,
        token,
        json: opts.json,
        quiet: opts.quiet,
      });
      console.log(output);
    });
}
