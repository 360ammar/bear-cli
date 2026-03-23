#!/usr/bin/env node

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

program
  .name('paw')
  .description('CLI for Bear app')
  .version('0.1.0');

const config = { getToken, setToken };

authCmd(program, { config, callBear });
tagsCmd(program, { getToken, callBear });
searchCmd(program, { getToken, callBear });
createCmd(program, { getToken, callBear });
openNoteCmd(program, { getToken, callBear });
addTextCmd(program, { getToken, callBear });
addFileCmd(program, { getToken, callBear });

program.parse();
