#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .command('download', 'Download a Wiki page as JSON')
  .command('create', 'Create a new Wiki page')
  .command('update', 'Update an existing Wiki page');

program.action(() => {
  program.help();
});

program.parse(process.argv);
