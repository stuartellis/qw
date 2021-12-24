#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .command('download', 'Download individual page')
  .command('new', 'Create a new page');

program.action(() => {
  program.help();
});

program.parse(process.argv);
