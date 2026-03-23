import fs from 'node:fs';
import path from 'node:path';

export async function runAddFile({ id, title, file, filename, header, mode, callBear, token, json, quiet }) {
  const response = await callBear('add-file', {
    token, id, title, file, filename, header, mode,
    show_window: quiet ? 'no' : undefined,
  });

  if (json) return JSON.stringify(response, null, 2);
  return `File added to: ${response.title}`;
}

export function register(program, { getToken, callBear }) {
  program
    .command('add-file')
    .description('Add a file to a note')
    .option('--id <id>', 'Note identifier')
    .option('--title <title>', 'Note title')
    .option('--file <path>', 'File path (auto base64-encoded)')
    .option('--filename <name>', 'Filename for the attachment')
    .option('--header <header>', 'Header to add file under')
    .option('--mode <mode>', 'append, prepend, replace, or replace_all')
    .option('--json', 'Output as JSON')
    .option('-q, --quiet', 'Don\'t open Bear window')
    .action(async (opts) => {
      const token = getToken();
      if (!token) {
        console.error('No API token found. Run `paw auth` to set up.');
        process.exit(1);
      }
      let file = opts.file;
      if (file && fs.existsSync(file)) {
        file = fs.readFileSync(file).toString('base64');
        if (!opts.filename) opts.filename = path.basename(opts.file);
      }
      const output = await runAddFile({ ...opts, file, callBear, token });
      console.log(output);
    });
}
