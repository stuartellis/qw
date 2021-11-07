#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .command('objects', 'List objects in S3 bucket')
  .command('status', 'Check bucket');

program.action(() => {
  program.help();
});

program.parse(process.argv);
