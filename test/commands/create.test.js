import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runCreate } from '../../src/commands/create.js';

describe('create command', () => {
  it('passes all params to bear create action', async () => {
    let capturedParams;
    const result = await runCreate({
      title: 'My Note', body: 'Content here', tags: 'work,draft',
      pin: true, edit: true, timestamp: true,
      callBear: async (action, params) => { capturedParams = params; return { identifier: 'ABC-123', title: 'My Note' }; },
      token: 'tok', json: false, quiet: false,
    });
    assert.equal(capturedParams.title, 'My Note');
    assert.equal(capturedParams.text, 'Content here');
    assert.equal(capturedParams.tags, 'work,draft');
    assert.equal(capturedParams.pin, true);
  });

  it('formats human output with id and title', async () => {
    const result = await runCreate({
      title: 'Test',
      callBear: async () => ({ identifier: 'ID-1', title: 'Test' }),
      token: 'tok', json: false,
    });
    assert.ok(result.includes('ID-1'));
    assert.ok(result.includes('Test'));
  });

  it('returns JSON when flag set', async () => {
    const bearResponse = { identifier: 'ID-1', title: 'Test' };
    const result = await runCreate({
      title: 'Test',
      callBear: async () => bearResponse,
      token: 'tok', json: true,
    });
    assert.deepEqual(JSON.parse(result), bearResponse);
  });
});
