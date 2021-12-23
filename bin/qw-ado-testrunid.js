#!/usr/bin/env node

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
  const buildIds = options.ids; 
  const resourceType = 'testrun';
  const queryName = 'getId';

  try {
    const urlTemplate = adoMappings.resource.get[resourceType].queries[queryName];
  
    let queryValues = adoService;
    queryValues['buildIds'] = buildIds;
    queryValues['state'] = 'completed';

    const maxDate = new Date(Date.now());
    const dateOffset = (24*60*60*1000) * 7; 
    const minDate = new Date(maxDate.getTime() - dateOffset);

    queryValues['maxLastUpdatedDate'] = maxDate.toISOString();
    queryValues['minLastUpdatedDate'] = minDate.toISOString();

    const adoPat = pat.get();
    if (adoPat === null) {
      throw new Error('Missing Azure DevOps PAT');
    }  
    const response = await adoRequest.get(
      adoPat, urlTemplate, queryValues, 
      adoResponse.checkError, adoResponse.checkSuccess);
    const data = response.data;
    if (data.value) { 
      switch (data.value.length) {
      case 0:
        throw new Error('No test runs match query');
      case 1:
        console.log(data.value[0].id);
        break;
      default:
        throw new Error('More than one test run matches query');
      }
    }    
  } catch(err) {
    logger.error(err);
    process.exit(1);
  }
}

program.requiredOption('-i, --ids <id>', 'Build IDs');

program.action(run);
program.parseAsync(process.argv);
