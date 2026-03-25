import { formatTitle } from '../bear.js';

export async function runSearch({ term, tag, callBear, token, json }) {
  const response = await callBear('search', {
    token,
    term,
    tag,
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
    .command('search [term]')
    .description('Search notes')
    .option('-t, --tag <tag>', 'Filter by tag')
    .option('--json', 'Output as JSON')
    .action(async (term, opts) => {
      const token = getToken();
      if (!token) {
        console.error('No API token found. Run `bear auth` to set up.');
        process.exit(1);
      }
      const output = await runSearch({
        term,
        tag: opts.tag,
        callBear,
        token,
        json: opts.json,
      });
      console.log(output);
    });
}
