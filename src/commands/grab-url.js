export async function runGrabUrl({ url, tags, pin, callBear, token, json, quiet }) {
  const response = await callBear('grab-url', {
    token,
    url,
    tags,
    pin,
    show_window: quiet ? 'no' : undefined,
  });

  if (json) {
    return JSON.stringify(response, null, 2);
  }

  return `Grabbed: ${response.title}  [${response.identifier}]`;
}

export function register(program, { getToken, callBear }) {
  program
    .command('grab [url]')
    .description('Grab a URL into Bear')
    .option('--tags <tags>', 'Comma-separated tags')
    .option('--pin', 'Pin the note')
    .option('--json', 'Output as JSON')
    .option('-q, --quiet', "Don't open Bear window")
    .action(async (url, opts) => {
      const token = getToken();
      if (!token) {
        console.error('No API token found. Run `paw auth` to set up.');
        process.exit(1);
      }
      const output = await runGrabUrl({
        url,
        tags: opts.tags,
        pin: opts.pin,
        callBear,
        token,
        json: opts.json,
        quiet: opts.quiet,
      });
      console.log(output);
    });
}
