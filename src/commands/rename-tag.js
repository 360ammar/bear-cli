export async function runRenameTag({ name, newName, callBear, token, json }) {
  const response = await callBear('rename-tag', {
    token,
    name,
    new_name: newName,
  });

  if (json) {
    return JSON.stringify(response, null, 2);
  }

  return `Renamed "${name}" to "${newName}"`;
}

export function register(program, { getToken, callBear }) {
  program
    .command('rename-tag [name]')
    .description('Rename a tag')
    .requiredOption('--new-name <newName>', 'New tag name')
    .option('--json', 'Output as JSON')
    .action(async (name, opts) => {
      const token = getToken();
      if (!token) {
        console.error('No API token found. Run `bear auth` to set up.');
        process.exit(1);
      }
      const output = await runRenameTag({
        name,
        newName: opts.newName,
        callBear,
        token,
        json: opts.json,
      });
      console.log(output);
    });
}
