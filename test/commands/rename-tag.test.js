import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runRenameTag } from '../../src/commands/rename-tag.js';

describe('rename-tag command', () => {
  it('calls bear rename-tag with correct action and params', async () => {
    let capturedAction;
    let capturedParams;

    await runRenameTag({
      name: 'old',
      newName: 'new',
      callBear: async (action, params) => {
        capturedAction = action;
        capturedParams = params;
        return {};
      },
      token: 'tok',
      json: false,
    });

    assert.equal(capturedAction, 'rename-tag');
    assert.equal(capturedParams.name, 'old');
    assert.equal(capturedParams.new_name, 'new');
    assert.equal(capturedParams.token, 'tok');
  });
});
