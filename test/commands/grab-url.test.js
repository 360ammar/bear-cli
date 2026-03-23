import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runGrabUrl } from '../../src/commands/grab-url.js';

describe('grab-url command', () => {
  it('forwards URL and tags params to bear', async () => {
    let capturedAction;
    let capturedParams;

    await runGrabUrl({
      url: 'https://example.com',
      tags: 'reading,links',
      callBear: async (action, params) => {
        capturedAction = action;
        capturedParams = params;
        return { title: 'Example', identifier: 'ex-id' };
      },
      token: 'tok',
      json: false,
    });

    assert.equal(capturedAction, 'grab-url');
    assert.equal(capturedParams.url, 'https://example.com');
    assert.equal(capturedParams.tags, 'reading,links');
    assert.equal(capturedParams.token, 'tok');
  });

  it('returns JSON when flag set', async () => {
    const bearResponse = { title: 'Example', identifier: 'ex-id' };

    const result = await runGrabUrl({
      url: 'https://example.com',
      callBear: async () => bearResponse,
      token: 'tok',
      json: true,
    });

    assert.deepEqual(JSON.parse(result), bearResponse);
  });
});
