#!/usr/bin/env node

const chalk = require('chalk');
const { Command } = require('commander');

const { email: mailer } = require('../config/services/email');
const { smtp } = require('../src/email');

const program = new Command();

async function run() {
  const options = program.opts();
  
  try {
    let config = mailer.smtp.default;
    Object.assign(config, options);
    config.auth = smtp.credentials();
    const transport = smtp.getTransport(config);
    await smtp.sendSmtp(transport, options.message);
  } catch(err) {
    console.error(`%s ${err.message}`, chalk.red('ERR'));
    process.exit(1);
  }

}

program.option('-b, --bcc <text>', 'BCC addresses');
program.option('-c, --cc <text>', 'CC addresses');
program.option('-f, --from <text>', 'From address');
program.option('-m, --text <text>', 'Message as plain-text');
program.option('-s, --subject <text>', 'Subject line');
program.option('-t, --to <text>', 'Recipients');

program.action(run);
program.parseAsync(process.argv);
