#!/usr/bin/env node

const path = require('path');

const { pat, response: adoResponse } = require('adolib');
const { Command, Option } = require('commander');

const { ado: adoMappings } = require('../config/mappings/ado');
const { ado: adoService } = require('../config/services/ado');

const { timestamp } = require('../src/formats');
const { ConsoleLogger } = require('../src/logger');
const { adoRequest, logMessage, output } = require('../src/tasks');

const program = new Command();

async function run() {
  const logger = new ConsoleLogger(console);

  const options = program.opts();
  const itemId = options.id; 
  const resourceType = 'wikipage';
  const format = options.format;
  const pagePath = options.path;
  let outputPath = options.output;

  let wikiId = adoService.defaultWikiId;
  if (options.wiki) {
    wikiId = options.wiki;
  }

  const urlTemplate = adoMappings.wikis[resourceType].get.queries.byPath;
  const resourceTypeIdentifier = adoMappings.wikis[resourceType].identifier;
  const resourceTypePlural = adoMappings.wikis[resourceType].plural;
  
  let queryValues = adoService;
  queryValues['includeContent'] = true;
  queryValues['path'] = pagePath;
  queryValues['wikiIdentifier'] = wikiId;
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
    logMessage.writeItem(logger, item, owner, resourceType, resourceTypePlural);

    let rootPath = undefined;

    if (outputPath) {
      rootPath = path.dirname(outputPath);
    } else {
      rootPath = path.join(process.cwd(), 'tmp', 'wikipages', owner, wikiId);
      const fileName = timestamp.fileName(`${owner}-${resourceType}-${item.id}`, new Date(), format);
      outputPath = path.join(rootPath, fileName); 
    }
    
    await output.ensureDirectory(logger, rootPath);
    await output.writeObjectToFile(logger, item, format, outputPath);
  } catch(err) {
    logger.error(err);
    process.exit(1);
  }
}

program.addOption(new Option('-f, --format <type>', 'Format of output').choices(['csv', 'json']).default('json', 'json'));
program.option('-o, --output <path>', 'Path and name of output file, e.g. tmp/page.json');
program.requiredOption('-p, --path <path>', 'Path of page on Wiki, e.g. "/Home Page/SubPage"');
program.option('-w, --wiki <wiki-identifier>', 'The unique ID of the Wiki');

program.action(run);
program.parseAsync(process.argv);
