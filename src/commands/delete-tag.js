export async function runDeleteTag({ name, callBear, token, json, quiet }) {
  await callBear('delete-tag', {
    token,
    name,
    show_window: quiet ? 'no' : undefined,
  });

  if (json) {
    return JSON.stringify({ name });
  }

  return `Deleted tag "${name}"`;
}

export function register(program, { getToken, callBear }) {
  program
    .command('delete-tag [name]')
    .description('Delete a tag')
    .option('--json', 'Output as JSON')
    .option('-q, --quiet', "Don't open Bear window")
    .action(async (name, opts) => {
      const token = getToken();
      if (!token) {
        console.error('No API token found. Run `paw auth` to set up.');
        process.exit(1);
      }
      const output = await runDeleteTag({
        name,
        callBear,
        token,
        json: opts.json,
        quiet: opts.quiet,
      });
      console.log(output);
    });
}
