import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildBearUrl } from '../src/bear.js';

describe('buildBearUrl', () => {
  it('builds a basic URL with action', () => {
    const url = buildBearUrl('create', { title: 'Hello' });
    assert.equal(url, 'bear://x-callback-url/create?title=Hello');
  });

  it('encodes special characters', () => {
    const url = buildBearUrl('create', { title: 'Hello World & More' });
    assert.equal(url, 'bear://x-callback-url/create?title=Hello%20World%20%26%20More');
  });

  it('omits undefined and null params', () => {
    const url = buildBearUrl('create', { title: 'Hi', body: undefined, pin: null });
    assert.equal(url, 'bear://x-callback-url/create?title=Hi');
  });

  it('handles boolean params as yes/no', () => {
    const url = buildBearUrl('create', { pin: true, edit: false });
    assert.equal(url, 'bear://x-callback-url/create?pin=yes&edit=no');
  });
});

describe('callBear', () => {
  it('starts server, opens URL, and returns parsed callback params', async () => {
    const { callBear } = await import('../src/bear.js');

    const result = await callBear('tags', { token: 'test' }, {
      execFn: (url) => {
        const successUrl = decodeURIComponent(url.match(/x-success=([^&]+)/)[1]);
        const callbackUrl = `${successUrl}?tags=${encodeURIComponent('tag1,tag2')}`;
        setTimeout(() => {
          fetch(callbackUrl).catch(() => {});
        }, 50);
      }
    });

    assert.equal(result.tags, 'tag1,tag2');
  });

  it('rejects on timeout', async () => {
    const { callBear } = await import('../src/bear.js');

    await assert.rejects(
      () => callBear('tags', { token: 'test' }, {
        execFn: () => {},
        timeoutMs: 200
      }),
      { message: /Bear did not respond/ }
    );
  });

  it('rejects on x-error callback', async () => {
    const { callBear } = await import('../src/bear.js');

    await assert.rejects(
      () => callBear('tags', { token: 'test' }, {
        execFn: (url) => {
          const errorUrl = url.match(/x-error=([^&]+)/)[1];
          const decoded = decodeURIComponent(errorUrl);
          setTimeout(() => {
            fetch(`${decoded}?errorMessage=${encodeURIComponent('Not found')}`).catch(() => {});
          }, 50);
        }
      }),
      { message: /Not found/ }
    );
  });
});
