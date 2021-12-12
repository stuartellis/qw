#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

const chalk = require('chalk');
const { Command } = require('commander');

const { ado: adoMappings } = require('../config/mappings/ado');
const { ado: adoService } = require('../config/services/ado');
const { url: urlFmt } = require('../src/formats');
const { command: git } = require('../src/git');
const { log, output } = require('../src/tasks');

const program = new Command();

async function run() {
  const options = program.opts();
  let outputPath = options.output;
  const inventory = options.inventory;

  const urlTemplate = adoMappings.git.https;

  try {
    const content = await fs.readFile(inventory, { encoding: 'utf8' });
    const data = JSON.parse(content);

    console.log(`%s Reading inventory ${inventory}`, chalk.green('INFO'));

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
      console.log('%s No repos excluded', chalk.green('INFO'));
      break;
    case 1:
      console.log(`%s 1 repo in inventory excluded: ${excludedNames}`, chalk.yellow('WARN'));
      break;
    default:
      console.log(`%s ${excludedRepos.length} repos in inventory excluded: ${excludedNames}`, chalk.yellow('WARN'));
      break;
    }

    log.writeItemCount(includedRepos, 'inventory', 'available repo', 'available repos'); 

    let rootPath = undefined;

    if (outputPath) {
      rootPath = path.dirname(outputPath);
    } else {
      rootPath = path.join(process.cwd(), 'tmp', 'repos');
    }
    
    await output.ensureDirectory(rootPath);

    console.log(`%s Starting sync of repos to ${rootPath}`, chalk.green('INFO'));

    for (const repo of includedRepos) {
      const gitTemplateValues = Object.assign(adoService, { repoName: repo.name });  
      const sourceRepo = urlFmt.fromTemplate(urlTemplate, gitTemplateValues);
      console.log(`%s Syncing ${sourceRepo.toString()}`, chalk.blue('INFO'));
      await git.sync(repo.name, sourceRepo.toString(), rootPath);
    }

    console.log('%s Sync complete', chalk.green('INFO'));

  } catch(err) {
    console.error(`%s ${err.message}`, chalk.red('ERR'));
    process.exit(1);
  }

}

program.requiredOption('-i, --inventory <path>', 'Inventory of repositories in JSON format');
program.option('-o, --output <path>', 'Path of parent directory for the repositories, e.g. tmp/repos');

program.action(run);
program.parseAsync(process.argv);
