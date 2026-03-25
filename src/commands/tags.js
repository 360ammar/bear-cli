export async function runTags({ callBear, token, json }) {
  const response = await callBear('tags', { token });
  const tags = JSON.parse(response.tags || '[]');

  if (json) {
    return JSON.stringify(tags, null, 2);
  }

  if (tags.length === 0) {
    return 'No tags found.';
  }

  return tags.map(t => t.name).join('\n');
}

export function register(program, { getToken, callBear }) {
  program
    .command('tags')
    .description('List all tags')
    .option('--json', 'Output as JSON')
    .action(async (opts) => {
      const token = getToken();
      if (!token) {
        console.error('No API token found. Run `bear auth` to set up.');
        process.exit(1);
      }
      const output = await runTags({
        callBear,
        token,
        json: opts.json,
      });
      console.log(output);
    });
}
