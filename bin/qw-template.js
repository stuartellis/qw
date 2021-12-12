#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .command('render', 'Creates new file from template and data');

program.action(() => {
  program.help();
});

program.parse(process.argv);
