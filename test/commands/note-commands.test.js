import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runOpenNote } from '../../src/commands/open-note.js';
import { runAddText } from '../../src/commands/add-text.js';
import { runAddFile } from '../../src/commands/add-file.js';

describe('open-note command', () => {
  it('passes id and options to bear open-note', async () => {
    let capturedParams;
    const result = await runOpenNote({
      id: 'NOTE-1', header: 'Section', pin: true, edit: true,
      callBear: async (action, params) => {
        assert.equal(action, 'open-note');
        capturedParams = params;
        return { note: 'content', identifier: 'NOTE-1', title: 'My Note', tags: 'a,b' };
      },
      token: 'tok', json: false,
    });
    assert.equal(capturedParams.id, 'NOTE-1');
    assert.ok(result.includes('My Note'));
  });

  it('returns JSON when flag set', async () => {
    const bearResponse = { note: 'text', identifier: 'X', title: 'T' };
    const result = await runOpenNote({
      id: 'X',
      callBear: async () => bearResponse,
      token: 'tok', json: true,
    });
    assert.deepEqual(JSON.parse(result), bearResponse);
  });
});

describe('add-text command', () => {
  it('passes text and mode to bear add-text', async () => {
    let capturedParams;
    await runAddText({
      id: 'NOTE-1', text: 'appended text', mode: 'append',
      callBear: async (action, params) => {
        assert.equal(action, 'add-text');
        capturedParams = params;
        return { title: 'Note' };
      },
      token: 'tok', json: false,
    });
    assert.equal(capturedParams.text, 'appended text');
    assert.equal(capturedParams.mode, 'append');
  });
});

describe('add-file command', () => {
  it('passes file params to bear add-file', async () => {
    let capturedParams;
    await runAddFile({
      id: 'NOTE-1', file: 'base64data', filename: 'image.png', mode: 'append',
      callBear: async (action, params) => {
        assert.equal(action, 'add-file');
        capturedParams = params;
        return { title: 'Note' };
      },
      token: 'tok', json: false,
    });
    assert.equal(capturedParams.file, 'base64data');
    assert.equal(capturedParams.filename, 'image.png');
  });
});
