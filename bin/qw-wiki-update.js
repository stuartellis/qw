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

  const pagePathBasename = path.basename(sourceFilePath);
  let pageComment = `Updated from ${pagePathBasename}`;
  if (options.comment) {
    pageComment = options.comment;
  }

  let wikiId = adoService.defaultWikiId;
  if (options.wiki) {
    wikiId = options.wiki;
  }

  const resourceType = 'wikipage';
  
  const queryUrlTemplate = adoMappings.wikis[resourceType].get.queries.byPath;
  
  let queryValues = {
    organization: adoService.organization,
    project: adoService.project,
    includeContent: false,
    path: pagePath,
    wikiIdentifier: wikiId
  };
  
  const patchUrlTemplate = adoMappings.wikis[resourceType].patch.update;
  
  let patchValues = {
    comment: pageComment,
    organization: adoService.organization,
    project: adoService.project,
    wikiIdentifier: wikiId
  };

  try {
    const adoPat = pat.get();
    if (adoPat === null) {
      throw new Error('Missing Azure DevOps PAT');
    }

    logger.info(`%s Updating the Wiki page ${pagePath} on ${wikiId} with content from ${sourceFilePath}`);

    const existingPageVersion = await adoRequest.get(
      adoPat, queryUrlTemplate, queryValues,  
      adoResponse.checkError, adoResponse.checkSuccess);

    const pageId = existingPageVersion.data.id;
    patchValues['id'] = pageId;
    logger.info(`%s Wiki page ${pagePath} is Page ID ${pageId}`);
    
    const existingPageETag = existingPageVersion.headers.etag;
    logger.info(`%s Wiki page ${pageId} ETag version is currently ${existingPageETag}`);

    const pageContent = await fs.readFile(sourceFilePath, { encoding: 'utf-8' });
    const patchBody = { content: pageContent };
    const extraPatchConfig = { headers: { 'If-Match': existingPageETag } };

    const patchResponse = await adoRequest.patch(
      adoPat, patchUrlTemplate, patchValues, patchBody, 
      adoResponse.checkError, adoResponse.checkSuccess, extraPatchConfig);

    const updatedPageVersion = await adoRequest.get(
      adoPat, queryUrlTemplate, queryValues,  
      adoResponse.checkError, adoResponse.checkSuccess);

    const updatedPageETag = updatedPageVersion.headers.etag;
    logger.info(`%s Wiki page ${pageId} ETag version is now ${updatedPageETag}`);

    if (updatedPageETag === existingPageETag) {
      logger.warn(`%s New and existing content is the same. Did not update the page ${patchResponse.data.path} (Page ID: ${patchResponse.data.id}) on ${wikiId} with content from ${sourceFilePath}`);
    } else {
      logger.info(`%s Updated the page ${patchResponse.data.path} (Page ID: ${patchResponse.data.id}) on ${wikiId} with content from ${sourceFilePath}`);
    }

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
