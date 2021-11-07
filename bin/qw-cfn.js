#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .command('list', 'Creates list of CloudFormation stacks')
  .command('resources', 'Creates list of resources in a stack');

program.action(() => {
  program.help();
});

program.parse(process.argv);
