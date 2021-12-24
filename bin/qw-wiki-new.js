#!/usr/bin/env node

const fs = require('fs').promises;

const { pat, response: adoResponse } = require('adolib');
const { Command } = require('commander');

const { ado: adoMappings } = require('../config/mappings/ado');
const { ado: adoService } = require('../config/services/ado');

const { ConsoleLogger } = require('../src/logger');
const { adoRequest } = require('../src/tasks');

const program = new Command();

async function run() {
  const logger = new ConsoleLogger(console);

  const options = program.opts();
  const itemId = options.id;
  const sourceFilePath = options.source;
  const resourceType = 'wikipage';
  const pagePath = options.path;

  let pageComment = 'Posted by qw';
  if (options.comment) {
    pageComment = options.comment;
  }

  let wikiId = adoService.defaultWikiId;
  if (options.wiki) {
    wikiId = options.wiki;
  }

  const urlTemplate = adoMappings.wikis[resourceType].put.new;
  const resourceTypeIdentifier = adoMappings.wikis[resourceType].identifier;
  
  let queryValues = adoService;
  queryValues['comment'] = pageComment;
  queryValues['path'] = pagePath;
  queryValues['wikiIdentifier'] = wikiId;
  queryValues[resourceTypeIdentifier] = itemId;
  
  try {  
    const adoPat = pat.get();
    if (adoPat === null) {
      throw new Error('Missing Azure DevOps PAT');
    }

    const pageContent = await fs.readFile(sourceFilePath, { encoding: 'utf-8' });
    const requestBody = { content: pageContent };

    const response = await adoRequest.put(
      adoPat, urlTemplate, queryValues, requestBody, 
      adoResponse.checkError, adoResponse.checkSuccess);
    logger.info(`%s Created the page ${response.data.path} (Page ID: ${response.data.id}) on ${wikiId} with content from ${sourceFilePath}`);
  } catch(err) {
    logger.error(err);
    process.exit(1);
  }
}

program.option('-c, --comment <text>', 'Comment for Wiki change');
program.requiredOption('-p, --path <path>', 'Path of page on Wiki, e.g. "/Home Page/SubPage"');
program.requiredOption('-s, --source <path>', 'Path and name of file containing the source data, e.g. tmp/items/testrun.json');
program.option('-w, --wiki <wiki-identifier>', 'The unique ID of the Wiki');

program.action(run);
program.parseAsync(process.argv);
