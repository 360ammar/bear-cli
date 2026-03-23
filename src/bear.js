import http from 'node:http';
import { exec } from 'node:child_process';

export function buildBearUrl(action, params = {}) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => {
      const value = typeof v === 'boolean' ? (v ? 'yes' : 'no') : String(v);
      return `${encodeURIComponent(k)}=${encodeURIComponent(value)}`;
    })
    .join('&');

  const base = `bear://x-callback-url/${action}`;
  return query ? `${base}?${query}` : base;
}

export function callBear(action, params = {}, options = {}) {
  const {
    execFn = defaultExec,
    timeoutMs = 5000
  } = options;

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://localhost`);
      const responseParams = Object.fromEntries(url.searchParams);

      res.writeHead(200);
      res.end('OK');

      clearTimeout(timer);
      server.close();

      if (url.pathname === '/error') {
        reject(new Error(responseParams.errorMessage || 'Bear returned an error'));
      } else {
        resolve(responseParams);
      }
    });

    server.listen(0, () => {
      const port = server.address().port;
      const successUrl = `http://localhost:${port}/callback`;
      const errorUrl = `http://localhost:${port}/error`;

      const allParams = {
        ...params,
        'x-success': successUrl,
        'x-error': errorUrl,
      };

      const url = buildBearUrl(action, allParams);
      execFn(url);
    });

    const timer = setTimeout(() => {
      server.close();
      reject(new Error('Bear did not respond. The app may be locked or not running.'));
    }, timeoutMs);
  });
}

function defaultExec(url) {
  exec(`open "${url}"`);
}
