import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runTrash } from '../../src/commands/trash.js';
import { runArchive } from '../../src/commands/archive.js';

const actionCommands = [
  { fn: runTrash, action: 'trash', humanOutput: 'Note trashed.' },
  { fn: runArchive, action: 'archive', humanOutput: 'Note archived.' },
];

for (const { fn, action, humanOutput } of actionCommands) {
  describe(`${action} command`, () => {
    it('calls bear with correct action, id, and search params', async () => {
      let capturedAction;
      let capturedParams;

      await fn({
        id: 'NOTE-1',
        search: 'my note',
        callBear: async (act, params) => {
          capturedAction = act;
          capturedParams = params;
          return {};
        },
        token: 'tok',
        json: false,
      });

      assert.equal(capturedAction, action);
      assert.equal(capturedParams.id, 'NOTE-1');
      assert.equal(capturedParams.search, 'my note');
      assert.equal(capturedParams.token, 'tok');
    });

    it('returns human-readable output', async () => {
      const result = await fn({
        id: 'NOTE-1',
        callBear: async () => ({}),
        token: 'tok',
        json: false,
      });

      assert.equal(result, humanOutput);
    });
  });
}
