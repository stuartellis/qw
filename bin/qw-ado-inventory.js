#!/usr/bin/env node

const path = require('path');

const { Command, Option } = require('commander');

const { ado: adoMappings } = require('../config/mappings/ado');
const { ado: adoService } = require('../config/services/ado');
const { pat, response: adoResponse } = require('../src/ado');
const { timestamp } = require('../src/formats');
const { ConsoleLogger } = require('../src/logger');
const { adoRequest, logMessage, output } = require('../src/tasks');

const program = new Command();

async function run() {
  const options = program.opts();
  const logger = new ConsoleLogger(console);

  const resourceType = options.type;
  const format = options.format;
  let outputPath = options.output;

  const urlTemplate = adoMappings.rest.get[resourceType].index;
  const resourceTypePlural = adoMappings.rest.get[resourceType].plural;
  const queryValues = adoService;
  const owner = adoService.project;

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
program.addOption(new Option('-t, --type <resource>', 'Type of resource').choices(['release', 'repo', 'pipeline', 'testrun']).default('repo', 'repo'));

program.action(run);
program.parseAsync(process.argv);
