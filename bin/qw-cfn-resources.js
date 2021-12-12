#!/usr/bin/env node

const path = require('path');

const { Command, Option } = require('commander');

const { aws: awsConfig } = require('../config/services/aws');
const { cfn, region } = require('../src/aws');
const { timestamp } = require('../src/formats');
const { ConsoleLogger } = require('../src/logger');
const { logMessage, output } = require('../src/tasks');

const program = new Command();

async function run() {
  const logger = new ConsoleLogger(console);

  const options = program.opts();
  const stackName = options.name;
  const format = options.format;
  let outputPath = options.output;
  const singularName = 'resource';
  const pluralName = 'resources';

  const awsRegion = region.get() || awsConfig.defaults.region;

  try {
    const cfnClient = cfn.client(awsRegion);
    const stackResources = await cfn.listStackResources(cfnClient, stackName);
    logMessage.writeItemCount(logger, stackResources, stackName, singularName, pluralName);

    let rootPath = undefined;

    if (outputPath) {
      rootPath = path.dirname(outputPath);
    } else {
      rootPath = path.join(process.cwd(), 'tmp', 'inventories', awsRegion);
      const fileName = timestamp.fileName(`${stackName}-${pluralName}`, new Date(), format);
      outputPath = path.join(rootPath, fileName); 
    }
    
    await output.ensureDirectory(logger, rootPath);
    await output.writeArrayToFile(logger, stackResources, format, outputPath);
  } catch(err) {
    logger.error(err);
    process.exit(1);
  }

}

program.addOption(new Option('-f, --format <type>', 'Format of output').choices(['csv', 'json']).default('json', 'json'));
program.requiredOption('-n, --name <name>', 'Name of CloudFormation stack');
program.option('-o, --output <path>', 'Path and name of output file, e.g. /tmp/resources.csv');

program.action(run);
program.parseAsync(process.argv);
