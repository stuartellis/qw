#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .command('inventory', 'Creates inventory of resources');

program.action(() => {
  program.help();
});

program.parse(process.argv);
