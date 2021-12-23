#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .version('0.4.0', '-v, --version')
  .description('Command-line tool for operations');

program
  .command('ado', 'Azure DevOps resources')
  .command('cfn', 'AWS CloudFormation')
  .command('email', 'Emails')
  .command('repo', 'Git repositories')
  .command('template', 'Templates')
  .command('wiki', 'Azure DevOps Wikis')
  .command('s3', 'AWS S3');

program.action(() => {
  program.help();
});

program.parseAsync(process.argv);
