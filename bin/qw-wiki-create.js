#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

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

  const sourceFilePath = options.source;
  const pagePath = options.path;

  let wikiId = adoService.defaultWikiId;
  if (options.wiki) {
    wikiId = options.wiki;
  }

  const pagePathBasename = path.basename(sourceFilePath);
  let pageComment = `Created from ${pagePathBasename}`;
  if (options.comment) {
    pageComment = options.comment;
  }

  const resourceType = 'wikipage';
  const urlTemplate = adoMappings.wikis[resourceType].put.new;
  
  let requestValues = {
    comment: pageComment,
    organization: adoService.organization,
    path: pagePath,
    project: adoService.project,
    wikiIdentifier: wikiId
  };
  
  try {  
    const adoPat = pat.get();
    if (adoPat === null) {
      throw new Error('Missing Azure DevOps PAT');
    }

    logger.info(`%s Creating the Wiki page ${pagePath} on ${wikiId} with content from ${sourceFilePath}`);

    const pageContent = await fs.readFile(sourceFilePath, { encoding: 'utf-8' });
    const requestBody = { content: pageContent };

    const response = await adoRequest.put(
      adoPat, urlTemplate, requestValues, requestBody, 
      adoResponse.checkError, adoResponse.checkSuccess);
    logger.info(`%s Created the page ${response.data.path} (Page ID: ${response.data.id}) on ${wikiId} with content from ${sourceFilePath}`);
  } catch(err) {
    logger.error(err);
    process.exit(1);
  }
}

program.option('-c, --comment <text>', 'Comment for Wiki change');
program.requiredOption('-p, --path <path>', 'Path of page on Wiki, e.g. "/Home Page/First Page"');
program.requiredOption('-s, --source <path>', 'Path and name of file containing the content for the page, e.g. tmp/source/content.txt');
program.option('-w, --wiki <wiki-identifier>', 'The unique ID of the Wiki');

program.action(run);
program.parseAsync(process.argv);
