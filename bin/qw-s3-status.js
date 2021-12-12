#!/usr/bin/env node

const { Command } = require('commander');

const { aws: awsConfig } = require('../config/services/aws');

const { region, s3 } = require('../src/aws');
const { ConsoleLogger } = require('../src/logger');

const program = new Command();

async function run() {
  const logger = new ConsoleLogger(console);

  const options = program.opts();
  const bucketName = options.name;
  const awsRegion = region.get() || awsConfig.defaults.region;

  try {
    const s3Client = s3.client(awsRegion);
    const bucketStatus = await s3.bucketStatus(s3Client, bucketName);
    switch (bucketStatus) {
    case 200:
      logger.info(`%s S3 bucket ${bucketName} is accessible`);
      break;
    case 403:
      logger.error(`%s S3 bucket ${bucketName} exists but you cannot access it`);
      break;
    case 404:
      logger.error(`%s S3 bucket ${bucketName} does not exist`);
      break;
    default:
      logger.warn(`%s S3 bucket ${bucketName} status ${bucketStatus}`);
      break;     
    }
  } catch(err) {
    logger.error(err);
    process.exit(1);
  }

}

program.requiredOption('-n, --name <name>', 'Name of S3 bucket');

program.action(run);
program.parseAsync(process.argv);
