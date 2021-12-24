#!/usr/bin/env node

const path = require('path');

const { pat, response: adoResponse } = require('adolib');
const { Command, Option } = require('commander');

const { ado: adoMappings } = require('../config/mappings/ado');
const { ado: adoService } = require('../config/services/ado');

const { timestamp } = require('../src/formats');
const { ConsoleLogger } = require('../src/logger');
const { adoRequest, logMessage, output } = require('../src/tasks');

const adoResourceTypes = Object.keys(adoMappings.resource.get);

const program = new Command();

async function run() {
  const options = program.opts();
  const logger = new ConsoleLogger(console);

  const resourceType = options.type;
  const format = options.format;
  let outputPath = options.output;

  const urlTemplate = adoMappings.resource.get[resourceType].index;
  const resourceTypePlural = adoMappings.resource.get[resourceType].plural;

  const owner = adoService.project;

  const queryValues = {
    organization: adoService.organization,
    project: adoService.project
  };

  try {  
    const adoPat = pat.get();
    if (adoPat === null) {
      throw new Error('Missing Azure DevOps PAT');
    }  
    const response = await adoRequest.get(
      adoPat, urlTemplate, queryValues, 
      adoResponse.checkError, adoResponse.checkSuccess);
    const items = response.data.value;
    logMessage.writeItemCount(logger, items, owner, resourceType, resourceTypePlural);

    let rootPath = undefined;

    if (outputPath) {
      rootPath = path.dirname(outputPath);
    } else {
      rootPath = path.join(process.cwd(), 'tmp', 'inventories', owner);
      const fileName = timestamp.fileName(`${owner}-${resourceTypePlural}`, new Date(), format);
      outputPath = path.join(rootPath, fileName); 
    }
    
    await output.ensureDirectory(logger, rootPath);
    await output.writeArrayToFile(logger, items, format, outputPath);
  } catch(err) {
    logger.error(err);
    process.exit(1);
  }
}

program.addOption(new Option('-f, --format <type>', 'Format of output').choices(['csv', 'json']).default('json', 'json'));
program.option('-o, --output <path>', 'Path and name of output file, e.g. tmp/repos.csv');
program.addOption(new Option('-t, --type <resource>', 'Type of resource').choices(adoResourceTypes).default('repo', 'repo'));

program.action(run);
program.parseAsync(process.argv);
