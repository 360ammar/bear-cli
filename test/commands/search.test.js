import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runSearch } from '../../src/commands/search.js';

describe('search command', () => {
  it('passes search term and tag to bear', async () => {
    let capturedParams;

    await runSearch({
      term: 'hello',
      tag: 'work',
      callBear: async (action, params) => {
        capturedParams = params;
        return { notes: '[]' };
      },
      token: 'tok',
      json: false,
    });

    assert.equal(capturedParams.term, 'hello');
    assert.equal(capturedParams.tag, 'work');
  });

  it('formats note list for human output', async () => {
    const notes = [
      { title: 'Note 1', identifier: 'id-1' },
      { title: 'Note 2', identifier: 'id-2' }
    ];

    const result = await runSearch({
      term: 'test',
      callBear: async () => ({ notes: JSON.stringify(notes) }),
      token: 'tok',
      json: false,
    });

    assert.ok(result.includes('Note 1'));
    assert.ok(result.includes('id-1'));
  });

  it('returns JSON when flag set', async () => {
    const result = await runSearch({
      term: 'test',
      callBear: async () => ({ notes: JSON.stringify([{ title: 'A' }]) }),
      token: 'tok',
      json: true,
    });

    assert.deepEqual(JSON.parse(result), [{ title: 'A' }]);
  });
});
