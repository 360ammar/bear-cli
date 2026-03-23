import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runDeleteTag } from '../../src/commands/delete-tag.js';

describe('delete-tag command', () => {
  it('calls bear delete-tag with correct action and params', async () => {
    let capturedAction;
    let capturedParams;

    await runDeleteTag({
      name: 'oldtag',
      callBear: async (action, params) => {
        capturedAction = action;
        capturedParams = params;
        return {};
      },
      token: 'tok',
      json: false,
    });

    assert.equal(capturedAction, 'delete-tag');
    assert.equal(capturedParams.name, 'oldtag');
    assert.equal(capturedParams.token, 'tok');
  });
});
