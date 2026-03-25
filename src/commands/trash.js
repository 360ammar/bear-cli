export async function runTrash({ id, search, callBear, token, json }) {
  const response = await callBear('trash', {
    token,
    id,
    search,
  });

  if (json) {
    return JSON.stringify(response, null, 2);
  }

  return 'Note trashed.';
}

export function register(program, { getToken, callBear }) {
  program
    .command('trash')
    .description('Move a note to trash')
    .option('--id <id>', 'Note identifier')
    .option('-s, --search <term>', 'Search term to identify note')
    .option('--json', 'Output as JSON')
    .action(async (opts) => {
      const token = getToken();
      if (!token) {
        console.error('No API token found. Run `bear auth` to set up.');
        process.exit(1);
      }
      const output = await runTrash({
        id: opts.id,
        search: opts.search,
        callBear,
        token,
        json: opts.json,
      });
      console.log(output);
    });
}
