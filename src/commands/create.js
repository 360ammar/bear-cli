import fs from 'node:fs';
import path from 'node:path';

export async function runCreate({ title, body, tags, file, filename, pin, edit, timestamp, html, callBear, token, json, quiet }) {
  let encodedFile = file;
  let resolvedFilename = filename;
  if (file && fs.existsSync(file)) {
    encodedFile = fs.readFileSync(file).toString('base64');
    if (!resolvedFilename) {
      resolvedFilename = path.basename(file);
    }
  }

  const response = await callBear('create', {
    token, title, text: body, tags,
    file: encodedFile, filename: resolvedFilename,
    pin, edit, timestamp,
    type: html ? 'html' : undefined,
    show_window: quiet ? 'no' : undefined,
  });

  if (json) return JSON.stringify(response, null, 2);
  return `Created: ${response.title}  [${response.identifier}]`;
}

export function register(program, { getToken, callBear }) {
  program
    .command('create')
    .description('Create a new note')
    .option('--title <title>', 'Note title')
    .option('--body <body>', 'Note body text')
    .option('--tags <tags>', 'Comma-separated tags')
    .option('--file <path>', 'File to attach (auto base64-encoded)')
    .option('--filename <name>', 'Filename for attachment')
    .option('--pin', 'Pin the note')
    .option('--edit', 'Open note in edit mode')
    .option('--timestamp', 'Prepend timestamp')
    .option('--html', 'Body is HTML')
    .option('--json', 'Output as JSON')
    .option('-q, --quiet', 'Don\'t open Bear window')
    .action(async (opts) => {
      const token = getToken();
      if (!token) {
        console.error('No API token found. Run `bear auth` to set up.');
        process.exit(1);
      }
      const output = await runCreate({ ...opts, callBear, token });
      console.log(output);
    });
}
