#!/usr/bin/env node

import { program } from 'commander';

program
  .name('paw')
  .description('CLI for Bear app')
  .version('0.1.0');

program.parse();
