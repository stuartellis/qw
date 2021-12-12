#!/usr/bin/env node

const chalk = require('chalk');
const { Command } = require('commander');

const { aws: awsConfig } = require('../config/services/aws');
const { region, s3 } = require('../src/aws');
const { log } = require('../src/tasks');

const program = new Command();

async function run() {
  const options = program.opts();
  const bucketName = options.name;
  const awsRegion = region.get() || awsConfig.defaults.region;

  try {
    const s3Client = s3.client(awsRegion);
    const bucketStatus = await s3.bucketStatus(s3Client, bucketName);
    switch (bucketStatus) {
    case 200:
      console.log(`%s S3 bucket ${bucketName} is accessible`, chalk.green('INFO'));
      break;
    case 403:
      console.log(`%s S3 bucket ${bucketName} exists but you cannot access it`, chalk.red('ERR'));
      break;
    case 404:
      console.log(`%s S3 bucket ${bucketName} does not exist`, chalk.red('ERR'));
      break;
    default:
      console.log(`%s S3 bucket ${bucketName} status ${bucketStatus}`, chalk.yellow('WARN'));
      break;     
    }
  } catch(err) {
    log.writeError(err);
    process.exit(1);
  }

}

program.requiredOption('-n, --name <name>', 'Name of S3 bucket');

program.action(run);
program.parseAsync(process.argv);
