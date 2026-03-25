export async function runDeleteTag({ name, callBear, token, json }) {
  const response = await callBear('delete-tag', {
    token,
    name,
  });

  if (json) {
    return JSON.stringify(response, null, 2);
  }

  return `Deleted tag "${name}"`;
}

export function register(program, { getToken, callBear }) {
  program
    .command('delete-tag [name]')
    .description('Delete a tag')
    .option('--json', 'Output as JSON')
    .action(async (name, opts) => {
      const token = getToken();
      if (!token) {
        console.error('No API token found. Run `bear auth` to set up.');
        process.exit(1);
      }
      const output = await runDeleteTag({
        name,
        callBear,
        token,
        json: opts.json,
      });
      console.log(output);
    });
}
