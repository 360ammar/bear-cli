import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runOpenTag } from '../../src/commands/open-tag.js';

describe('open-tag command', () => {
  it('calls bear open-tag with correct action and params', async () => {
    let capturedAction;
    let capturedParams;

    await runOpenTag({
      name: 'work',
      callBear: async (action, params) => {
        capturedAction = action;
        capturedParams = params;
        return { notes: '[]' };
      },
      token: 'tok',
      json: false,
    });

    assert.equal(capturedAction, 'open-tag');
    assert.equal(capturedParams.name, 'work');
    assert.equal(capturedParams.token, 'tok');
  });
});
