#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

const chalk = require('chalk');
const { Command } = require('commander');

const { timestamp } = require('../src/formats');
const { output } = require('../src/tasks');

const program = new Command();

async function run() {
  const options = program.opts();

  const dataFilePath = options.data;
  let outputPath = options.output;
  const templateFilePath = options.template;

  try {  
    let rootPath = undefined;

    const dataContent = await fs.readFile(dataFilePath);
    const data = JSON.parse(dataContent);
    const templateContent = await fs.readFile(templateFilePath);

    if (outputPath) {
      rootPath = path.dirname(outputPath);
    } else {
      rootPath = path.join(process.cwd(), 'tmp', 'output');
      const fileName = timestamp.fileName('rendered', new Date(), 'txt');
      outputPath = path.join(rootPath, fileName); 
    }
    
    await output.ensureDirectory(rootPath);
    await output.writeHbTemplateToFile(data, templateContent, outputPath);

  } catch(err) {
    console.error(`%s ${err.message}`, chalk.red('ERR'));
    process.exit(1);
  }
}

program.requiredOption('-d, --data <path>', 'Path and name of JSON file containing the source data, e.g. tmp/items/testrun.json');
program.option('-o, --output <path>', 'Path and name of output file, e.g. tmp/output/testrun.txt');
program.requiredOption('-t, --template <path>', 'Path and name of Handlebars template file, e.g. config/templates/ado/testrun.handlebars');

program.action(run);
program.parseAsync(process.argv);
