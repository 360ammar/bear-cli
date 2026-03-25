export async function runArchive({ id, search, callBear, token, json }) {
  const response = await callBear('archive', {
    token,
    id,
    search,
  });

  if (json) {
    return JSON.stringify(response, null, 2);
  }

  return 'Note archived.';
}

export function register(program, { getToken, callBear }) {
  program
    .command('archive')
    .description('Archive a note')
    .option('--id <id>', 'Note identifier')
    .option('-s, --search <term>', 'Search term to identify note')
    .option('--json', 'Output as JSON')
    .action(async (opts) => {
      const token = getToken();
      if (!token) {
        console.error('No API token found. Run `bear auth` to set up.');
        process.exit(1);
      }
      const output = await runArchive({
        id: opts.id,
        search: opts.search,
        callBear,
        token,
        json: opts.json,
      });
      console.log(output);
    });
}
