#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

const { Command } = require('commander');

const { ado: adoMappings } = require('../config/mappings/ado');
const { ado: adoService } = require('../config/services/ado');

const { url: urlFmt } = require('../src/formats');
const { command: git } = require('../src/git');
const { ConsoleLogger } = require('../src/logger');
const { logMessage, output } = require('../src/tasks');

const program = new Command();

async function run() {
  const logger = new ConsoleLogger(console);

  const options = program.opts();
  let outputPath = options.output;
  const inventory = options.inventory;

  const urlTemplate = adoMappings.git.https;

  try {
    const content = await fs.readFile(inventory, { encoding: 'utf8' });
    const data = JSON.parse(content);

    logger.info(`%s Reading inventory ${inventory}`);

    const includedRepos = [];
    const excludedRepos = [];

    for (const item of data) {
      if (item.defaultBranch) {
        includedRepos.push({ name: item.name, defaultBranch: item.defaultBranch });
      } else {
        excludedRepos.push({ name: item.name, defaultBranch: item.defaultBranch });
      }
    }

    const excludedNames = excludedRepos.map((r) => { return r.name; }).join(', ');

    switch (excludedRepos.length) {
    case 0:
      logger.info('%s No repos excluded');
      break;
    case 1:
      logger.warn(`%s 1 repo in inventory excluded: ${excludedNames}`);
      break;
    default:
      logger.warn(`%s ${excludedRepos.length} repos in inventory excluded: ${excludedNames}`);
      break;
    }

    logMessage.writeItemCount(logger, includedRepos, 'inventory', 'available repo', 'available repos'); 

    let rootPath = undefined;

    if (outputPath) {
      rootPath = path.dirname(outputPath);
    } else {
      rootPath = path.join(process.cwd(), 'tmp', 'repos');
    }
    
    await output.ensureDirectory(logger, rootPath);

    logger.info(`%s Starting sync of repos to ${rootPath}`);

    for (const repo of includedRepos) {
      const gitTemplateValues = Object.assign(adoService, { repoName: repo.name });  
      const sourceRepo = urlFmt.fromTemplate(urlTemplate, gitTemplateValues);
      logger.info(`%s Syncing ${sourceRepo.toString()}`);
      await git.sync(repo.name, sourceRepo.toString(), rootPath);
    }

    logger.info('%s Sync complete');

  } catch(err) {
    logger.error(err);
    process.exit(1);
  }

}

program.requiredOption('-i, --inventory <path>', 'Inventory of repositories in JSON format');
program.option('-o, --output <path>', 'Path of parent directory for the repositories, e.g. tmp/repos');

program.action(run);
program.parseAsync(process.argv);
