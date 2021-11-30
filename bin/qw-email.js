#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .command('send', 'Sends an email with SMTP');

program.action(() => {
  program.help();
});

program.parse(process.argv);
