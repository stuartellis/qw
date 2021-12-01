#!/usr/bin/env node

const fs = require('fs').promises;

const chalk = require('chalk');
const { Command } = require('commander');

const { email: mailer } = require('../config/services/email');
const { smtp } = require('../src/email');

const program = new Command();

async function run() {
  const options = program.opts();
  
  try {
    let message = {};
    if (options.json) {
      const extMsgFile = await fs.readFile(options.json);
      const extMsgJson = JSON.parse(extMsgFile);
      Object.assign(message, extMsgJson);
    } 

    ['bcc', 'cc', 'from', 'subject', 'text', 'to'].forEach((opt) => {
      if (options[opt]) {
        message[opt] = options[opt];
      }
    });

    let profile = mailer.smtp.default;
    if (options.profile) {
      const extPrFile = await fs.readFile(options.profile);
      const extPrJson = JSON.parse(extPrFile);
      Object.assign(profile, extPrJson);
    } 
    profile.auth = smtp.credentials();

    const transport = smtp.getTransport(profile);
    await smtp.sendSmtp(transport, message);

  } catch(err) {
    console.error(`%s ${err.message}`, chalk.red('ERR'));
    process.exit(1);
  }

}

program.option('-b, --bcc <text>', 'BCC addresses');
program.option('-c, --cc <text>', 'CC addresses');
program.option('-f, --from <text>', 'From address');
program.option('-j, --json <text>', 'Message from JSON file');
program.option('-m, --text <text>', 'Content of message as plain-text');
program.option('-p, --profile <text>', 'Transport settings from JSON file');
program.option('-s, --subject <text>', 'Subject line');
program.option('-t, --to <text>', 'Recipients');

program.action(run);
program.parseAsync(process.argv);
