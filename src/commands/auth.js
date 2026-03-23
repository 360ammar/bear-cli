export async function runAuth(token, { config, log, callBear, prompt }) {
  if (!token) {
    log('To find your Bear API token:');
    log('  1. Open Bear');
    log('  2. Go to Help → Advanced → API Token');
    log('  3. Copy Token');
    log('');
    if (prompt) {
      token = await prompt('Paste your token: ');
      if (!token || !token.trim()) {
        log('No token provided.');
        return;
      }
      token = token.trim();
    } else {
      log('Then run: bear auth <your-token>');
      return;
    }
  }

  config.setToken(token);
  log('Token saved.');

  try {
    await callBear('tags', { token });
    log('Token validated successfully.');
  } catch {
    log('Warning: Could not validate token. Bear may not be running.');
  }
}

export function register(program, { config, callBear }) {
  program
    .command('auth [token]')
    .description('Set up Bear API token')
    .action(async (token) => {
      await runAuth(token, {
        config,
        log: console.log,
        callBear,
        prompt: async (question) => {
          const readline = await import('node:readline');
          const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
          return new Promise((resolve) => rl.question(question, (answer) => { rl.close(); resolve(answer); }));
        },
      });
    });
}
