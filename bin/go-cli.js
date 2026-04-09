#!/usr/bin/env node

import { program } from 'commander';
import watch from '../src/commands/watch.js';
import list from '../src/commands/list.js';
import jump from '../src/commands/jump.js';
import remove from '../src/commands/remove.js';
import clear from '../src/commands/clear.js';
import init from '../src/commands/init.js';

program
  .name('go-cli')
  .description('A CLI tool for managing and quickly navigating to project directories')
  .version('1.0.0');

// go watch [path]
program
  .command('watch [path]')
  .description('Record a directory path (defaults to current directory)')
  .action(watch);

// go list
program
  .command('list')
  .description('List all recorded paths')
  .action(list);

// go jump [keyword] - internal command used by shell wrapper
program
  .command('jump [keyword]')
  .description('Search and output a path for shell wrapper (internal)')
  .action(jump);

// go remove <keyword>
program
  .command('remove <keyword>')
  .description('Remove paths matching the keyword (with confirmation)')
  .action(remove);

// go clear
program
  .command('clear')
  .description('Clear all recorded paths (with confirmation)')
  .action(clear);

// go init [shell]
program
  .command('init [shell]')
  .description('Output shell initialization script (bash, zsh, powershell)')
  .action(init);

// If no arguments, show help
if (process.argv.length <= 2) {
  program.help();
}

program.parse();