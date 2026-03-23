export async function runRenameTag({ name, newName, callBear, token, json, quiet }) {
  await callBear('rename-tag', {
    token,
    name,
    new_name: newName,
    show_window: quiet ? 'no' : undefined,
  });

  if (json) {
    return JSON.stringify({ name, newName });
  }

  return `Renamed "${name}" to "${newName}"`;
}

export function register(program, { getToken, callBear }) {
  program
    .command('rename-tag [name]')
    .description('Rename a tag')
    .requiredOption('--new-name <newName>', 'New tag name')
    .option('--json', 'Output as JSON')
    .option('-q, --quiet', "Don't open Bear window")
    .action(async (name, opts) => {
      const token = getToken();
      if (!token) {
        console.error('No API token found. Run `paw auth` to set up.');
        process.exit(1);
      }
      const output = await runRenameTag({
        name,
        newName: opts.newName,
        callBear,
        token,
        json: opts.json,
        quiet: opts.quiet,
      });
      console.log(output);
    });
}
