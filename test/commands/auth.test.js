import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createConfig } from '../../src/config.js';

describe('auth command', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'paw-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it('saves token when provided as argument', async () => {
    const { runAuth } = await import('../../src/commands/auth.js');
    const config = createConfig(tmpDir);
    const output = [];

    await runAuth('my-token', {
      config,
      log: (msg) => output.push(msg),
      callBear: async () => ({ tags: '' }),
    });

    assert.equal(config.getToken(), 'my-token');
    assert.ok(output.some(m => m.includes('saved')));
  });

  it('validates token by calling bear tags', async () => {
    const { runAuth } = await import('../../src/commands/auth.js');
    const config = createConfig(tmpDir);
    let calledAction;

    await runAuth('tok', {
      config,
      log: () => {},
      callBear: async (action, params) => {
        calledAction = action;
        return { tags: '' };
      },
    });

    assert.equal(calledAction, 'tags');
  });

  it('reports error on invalid token', async () => {
    const { runAuth } = await import('../../src/commands/auth.js');
    const config = createConfig(tmpDir);
    const output = [];

    await runAuth('bad', {
      config,
      log: (msg) => output.push(msg),
      callBear: async () => { throw new Error('fail'); },
    });

    assert.ok(output.some(m => m.includes('Warning')));
    assert.equal(config.getToken(), 'bad');
  });
});
