import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runTags } from '../../src/commands/tags.js';

describe('tags command', () => {
  it('calls bear tags action and formats output', async () => {
    const result = await runTags({
      callBear: async () => ({
        tags: JSON.stringify([
          { name: 'work', count: 5 },
          { name: 'personal', count: 3 }
        ])
      }),
      token: 'tok',
      json: false,
    });

    assert.ok(result.includes('work'));
    assert.ok(result.includes('personal'));
  });

  it('returns raw JSON when json flag is set', async () => {
    const result = await runTags({
      callBear: async () => ({
        tags: JSON.stringify([{ name: 'work', count: 5 }])
      }),
      token: 'tok',
      json: true,
    });

    const parsed = JSON.parse(result);
    assert.ok(Array.isArray(parsed));
    assert.equal(parsed[0].name, 'work');
  });
});
