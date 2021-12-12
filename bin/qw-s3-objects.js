#!/usr/bin/env node

const path = require('path');

const { Command, Option } = require('commander');

const { aws: awsConfig } = require('../config/services/aws');
const { region, s3 } = require('../src/aws');
const { timestamp } = require('../src/formats');
const { ConsoleLogger } = require('../src/logger');
const { logMessage, output } = require('../src/tasks');

const program = new Command();

async function run() {
  const logger = new ConsoleLogger(console);
  
  const options = program.opts();
  const bucketName = options.name;
  const format = options.format;
  let outputPath = options.output;
  const singularName = 'object';
  const pluralName = 'objects';

  const awsRegion = region.get() || awsConfig.defaults.region;

  try {
    const s3Client = s3.client(awsRegion);
    const s3Objects = await s3.listAllObjects(s3Client, bucketName);
    logMessage.writeItemCount(logger, s3Objects, bucketName, singularName, pluralName);

    let rootPath = undefined;

    if (outputPath) {
      rootPath = path.dirname(outputPath);
    } else {
      rootPath = path.join(process.cwd(), 'tmp', 'inventories', awsRegion);
      const fileName = timestamp.fileName(`${bucketName}-${pluralName}`, new Date(), format);
      outputPath = path.join(rootPath, fileName); 
    }

    await output.ensureDirectory(logger, rootPath);
    await output.writeArrayToFile(logger, s3Objects, format, outputPath);
  } catch(err) {
    logger.error(err);
    process.exit(1);
  }
}

program.addOption(new Option('-f, --format <type>', 'Format of output').choices(['csv', 'json']).default('json', 'json'));
program.requiredOption('-n, --name <name>', 'Name of CloudFormation stack');
program.option('-o, --output <path>', 'Path and name of output file, e.g. tmp/aws/objects.csv');

program.action(run);
program.parseAsync(process.argv);
