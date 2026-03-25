import { formatTitle } from '../bear.js';

export async function runOpenTag({ name, callBear, token, json }) {
  const response = await callBear('open-tag', {
    token,
    name,
  });

  const notes = JSON.parse(response.notes || '[]');

  if (json) {
    return JSON.stringify(notes, null, 2);
  }

  if (notes.length === 0) {
    return 'No notes found.';
  }

  return notes.map(n => `${formatTitle(n.title)}  [${n.identifier}]`).join('\n');
}

export function register(program, { getToken, callBear }) {
  program
    .command('tag [name]')
    .description('Open a tag and list its notes')
    .option('--json', 'Output as JSON')
    .action(async (name, opts) => {
      const token = getToken();
      if (!token) {
        console.error('No API token found. Run `bear auth` to set up.');
        process.exit(1);
      }
      const output = await runOpenTag({
        name,
        callBear,
        token,
        json: opts.json,
      });
      console.log(output);
    });
}
