#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .command('inventory', 'Creates inventory of resources')
  .command('item', 'Get individual resource or record')
  .command('testrunid', 'Get ID of test run');

program.action(() => {
  program.help();
});

program.parse(process.argv);
