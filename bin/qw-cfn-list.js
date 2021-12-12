#!/usr/bin/env node

const path = require('path');

const { Command, Option } = require('commander');

const { aws: awsConfig } = require('../config/services/aws');
const { cfn, region } = require('../src/aws');
const { timestamp } = require('../src/formats');
const { log, output } = require('../src/tasks');

const program = new Command();

async function run() {
  const options = program.opts();
  const format = options.format;
  let outputPath = options.output;
  const singularName = 'stack';
  const pluralName = 'stacks';
  
  const awsRegion = region.get() || awsConfig.defaults.region;
  
  const statuses = ['CREATE_COMPLETE', 'UPDATE_COMPLETE'];

  try {
    const cfnClient = cfn.client(awsRegion);
    const stacks = await cfn.listStacks(cfnClient, statuses);
    log.writeItemCount(stacks, awsRegion, singularName, pluralName);

    let rootPath = undefined;

    if (outputPath) {
      rootPath = path.dirname(outputPath);
    } else {
      rootPath = path.join(process.cwd(), 'tmp', 'inventories', awsRegion);
      const fileName = timestamp.fileName(`${awsRegion}-${pluralName}`, new Date(), format);
      outputPath = path.join(rootPath, fileName); 
    }
    
    await output.ensureDirectory(rootPath);
    await output.writeArrayToFile(stacks.StackSummaries, format, outputPath);
  } catch(err) {
    log.writeError(err);
    process.exit(1);
  }

}

program.addOption(new Option('-f, --format <type>', 'Format of output').choices(['csv', 'json']).default('json', 'json'));
program.option('-o, --output <path>', 'Path and name of output file, e.g. tmp/aws/stacks.csv');

program.action(run);
program.parseAsync(process.argv);
