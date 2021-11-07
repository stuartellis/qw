#!/usr/bin/env node

const path = require('path');

const chalk = require('chalk');
const { Command, Option } = require('commander');

const { aws: awsConfig } = require('../config/services/aws');
const { region, s3 } = require('../src/aws');
const { timestamp } = require('../src/formats');
const { output } = require('../src/tasks');

const program = new Command();

async function run() {
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
    output.countItems(s3Objects, bucketName, singularName, pluralName);

    let rootPath = undefined;

    if (outputPath) {
      rootPath = path.dirname(outputPath);
    } else {
      rootPath = path.join(process.cwd(), 'tmp', 'inventories', awsRegion);
      const fileName = timestamp.fileName(`${bucketName}-${pluralName}`, new Date(), format);
      outputPath = path.join(rootPath, fileName); 
    }

    await output.ensureDirectory(rootPath);
    await output.writeFile(s3Objects, format, outputPath);
  } catch(err) {
    console.error(`%s ${err.message}`, chalk.red('ERR'));
    process.exit(1);
  }
}

program.addOption(new Option('-f, --format <type>', 'Format of output').choices(['csv', 'json']).default('json', 'json'));
program.requiredOption('-n, --name <name>', 'Name of CloudFormation stack');
program.option('-o, --output <path>', 'Path and name of output file, e.g. /tmp/objects.csv');

program.action(run);
program.parseAsync(process.argv);
