import { formatTitle } from '../bear.js';

export async function runTodo({ search, callBear, token, json }) {
  const response = await callBear('todo', {
    token,
    search,
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
    .command('todo')
    .description('List notes with todo items')
    .option('-s, --search <term>', 'Filter by search term')
    .option('--json', 'Output as JSON')
    .action(async (opts) => {
      const token = getToken();
      if (!token) {
        console.error('No API token found. Run `bear auth` to set up.');
        process.exit(1);
      }
      const output = await runTodo({
        search: opts.search,
        callBear,
        token,
        json: opts.json,
      });
      console.log(output);
    });
}
