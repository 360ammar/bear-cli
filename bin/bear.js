#!/usr/bin/env node

process.on('unhandledRejection', (err) => {
  if (err.message.includes('Bear did not respond')) {
    console.error('Bear did not respond. The app may be locked or not running.');
  } else if (err.message.includes('ECONNREFUSED')) {
    console.error('Bear is not running. Please open Bear and try again.');
  } else {
    console.error(`Error: ${err.message}`);
  }
  process.exit(1);
});

import { program } from 'commander';
import { getToken, setToken, createConfig } from '../src/config.js';
import { callBear } from '../src/bear.js';
import { register as authCmd } from '../src/commands/auth.js';
import { register as tagsCmd } from '../src/commands/tags.js';
import { register as searchCmd } from '../src/commands/search.js';
import { register as createCmd } from '../src/commands/create.js';
import { register as openNoteCmd } from '../src/commands/open-note.js';
import { register as addTextCmd } from '../src/commands/add-text.js';
import { register as addFileCmd } from '../src/commands/add-file.js';
import { register as openTagCmd } from '../src/commands/open-tag.js';
import { register as renameTagCmd } from '../src/commands/rename-tag.js';
import { register as deleteTagCmd } from '../src/commands/delete-tag.js';
import { register as untaggedCmd } from '../src/commands/untagged.js';
import { register as todoCmd } from '../src/commands/todo.js';
import { register as todayCmd } from '../src/commands/today.js';
import { register as lockedCmd } from '../src/commands/locked.js';
import { register as trashCmd } from '../src/commands/trash.js';
import { register as archiveCmd } from '../src/commands/archive.js';
import { register as grabUrlCmd } from '../src/commands/grab-url.js';

program
  .name('bear')
  .description('Manage Bear notes from the command line')
  .version('0.1.0');

const config = { getToken, setToken };

authCmd(program, { config, callBear });
tagsCmd(program, { getToken, callBear });
searchCmd(program, { getToken, callBear });
createCmd(program, { getToken, callBear });
openNoteCmd(program, { getToken, callBear });
addTextCmd(program, { getToken, callBear });
addFileCmd(program, { getToken, callBear });
openTagCmd(program, { getToken, callBear });
renameTagCmd(program, { getToken, callBear });
deleteTagCmd(program, { getToken, callBear });
untaggedCmd(program, { getToken, callBear });
todoCmd(program, { getToken, callBear });
todayCmd(program, { getToken, callBear });
lockedCmd(program, { getToken, callBear });
trashCmd(program, { getToken, callBear });
archiveCmd(program, { getToken, callBear });
grabUrlCmd(program, { getToken, callBear });

program.parse();
