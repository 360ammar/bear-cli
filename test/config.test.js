import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createConfig } from '../src/config.js';

describe('config', () => {
  let tmpDir;
  let originalEnv;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'paw-test-'));
    originalEnv = process.env.BEAR_API_TOKEN;
    delete process.env.BEAR_API_TOKEN;
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
    if (originalEnv !== undefined) {
      process.env.BEAR_API_TOKEN = originalEnv;
    } else {
      delete process.env.BEAR_API_TOKEN;
    }
  });

  it('setToken creates config file and getToken reads it', () => {
    const { getToken, setToken } = createConfig(tmpDir);
    setToken('test-token-123');
    assert.equal(getToken(), 'test-token-123');
  });

  it('getToken returns env var over config file', () => {
    const { getToken, setToken } = createConfig(tmpDir);
    setToken('file-token');
    process.env.BEAR_API_TOKEN = 'env-token';
    assert.equal(getToken(), 'env-token');
  });

  it('getToken returns null when no token exists', () => {
    const { getToken } = createConfig(tmpDir);
    assert.equal(getToken(), null);
  });

  it('setToken creates directory if it does not exist', () => {
    const nested = path.join(tmpDir, 'sub', 'dir');
    const { setToken } = createConfig(nested);
    setToken('tok');
    assert.ok(fs.existsSync(path.join(nested, 'config.json')));
  });
});
