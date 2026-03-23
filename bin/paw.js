#!/usr/bin/env node

import { program } from 'commander';
import { getToken, setToken, createConfig } from '../src/config.js';
import { callBear } from '../src/bear.js';
import { register as authCmd } from '../src/commands/auth.js';

program
  .name('paw')
  .description('CLI for Bear app')
  .version('0.1.0');

const config = { getToken, setToken };

authCmd(program, { config, callBear });

program.parse();
