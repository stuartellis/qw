#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .command('sync', 'Syncs Git repositories with local copies');

program.action(() => {
  program.help();
});

program.parse(process.argv);
