#!/usr/bin/env node

const path = require('path');

const chalk = require('chalk');
const { Command, Option } = require('commander');

const { ado: adoMappings } = require('../config/mappings/ado');
const { ado: adoService } = require('../config/services/ado');
const { pat, response: adoResponse } = require('../src/ado');
const { timestamp } = require('../src/formats');
const { adoRequest, output } = require('../src/tasks');

const program = new Command();

async function run() {
  const options = program.opts();

  const itemId = options.id; 
  const resourceType = options.type;
  const format = options.format;
  let outputPath = options.output;

  const urlTemplate = adoMappings.rest.get[resourceType].item;
  const resourceTypeIdentifier = adoMappings.rest.get[resourceType].identifier;
  const resourceTypePlural = adoMappings.rest.get[resourceType].plural;
  
  let queryValues = adoService;
  queryValues[resourceTypeIdentifier] = itemId;
  
  const owner = adoService.project;

  try {  
    const adoPat = pat.get();
    if (adoPat === null) {
      throw new Error('Missing Azure DevOps PAT');
    }  
    const response = await adoRequest.get(
      adoPat, urlTemplate, queryValues, 
      adoResponse.checkError, adoResponse.checkSuccess);
    const item = response.data;
    output.logItem(item, owner, resourceType, resourceTypePlural);

    let rootPath = undefined;

    if (outputPath) {
      rootPath = path.dirname(outputPath);
    } else {
      rootPath = path.join(process.cwd(), 'tmp', 'items', owner, resourceTypePlural);
      const fileName = timestamp.fileName(`${owner}-${resourceType}-${itemId}`, new Date(), format);
      outputPath = path.join(rootPath, fileName); 
    }
    
    await output.ensureDirectory(rootPath);
    await output.writeObjectToFile(item, format, outputPath);
  } catch(err) {
    console.error(`%s ${err.message}`, chalk.red('ERR'));
    process.exit(1);
  }
}

program.addOption(new Option('-f, --format <type>', 'Format of output').choices(['csv', 'json']).default('json', 'json'));
program.requiredOption('-i, --id <id>', 'ADO ID of item');
program.option('-o, --output <path>', 'Path and name of output file, e.g. /tmp/repos.csv');
program.addOption(new Option('-t, --type <resource>', 'Type of resource').choices(['release', 'repo', 'pipeline', 'testrun']).default('repo', 'repo'));

program.action(run);
program.parseAsync(process.argv);
