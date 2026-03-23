import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const listCommands = [
  { module: '../../src/commands/untagged.js', fn: 'runUntagged', action: 'untagged' },
  { module: '../../src/commands/todo.js', fn: 'runTodo', action: 'todo' },
  { module: '../../src/commands/today.js', fn: 'runToday', action: 'today' },
  { module: '../../src/commands/locked.js', fn: 'runLocked', action: 'locked' },
];

for (const { module, fn, action } of listCommands) {
  const { [fn]: runFn } = await import(module);

  describe(`${action} command`, () => {
    it('calls bear with correct action and params', async () => {
      let capturedAction;
      let capturedParams;

      await runFn({
        search: 'test',
        callBear: async (act, params) => {
          capturedAction = act;
          capturedParams = params;
          return { notes: '[]' };
        },
        token: 'tok',
        json: false,
      });

      assert.equal(capturedAction, action);
      assert.equal(capturedParams.search, 'test');
      assert.equal(capturedParams.token, 'tok');
    });

    it('returns JSON when flag set', async () => {
      const notes = [{ title: 'Note A', identifier: 'id-a' }];

      const result = await runFn({
        callBear: async () => ({ notes: JSON.stringify(notes) }),
        token: 'tok',
        json: true,
      });

      assert.deepEqual(JSON.parse(result), notes);
    });
  });
}
