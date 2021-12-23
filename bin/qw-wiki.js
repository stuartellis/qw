#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .command('get', 'Get individual page');

program.action(() => {
  program.help();
});

program.parse(process.argv);
