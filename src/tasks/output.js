'use strict';

const fs = require('fs').promises;

const chalk = require('chalk');

const { hbTemplate } = require('../formats');
const { stringer } = require('../serialize');

/**
 * @module tasks/output
*/

/**
 * Ensures that directory exists.
 * @param {String} fullPath - Full path for directory
*/
async function ensureDirectory(fullPath) {
  const dirResult = await fs.mkdir(fullPath, { recursive: true });

  if (dirResult) {
    console.log(`%s Created directory ${dirResult}`, chalk.green('INFO'));
  } else {
    console.log(`%s Directory ${fullPath} already exists`, chalk.blue('INFO'));
  }

  return fullPath; 
}

/**
 * Writes Array of Objects to a file.
 * @param {Array<Object>} items - Items
 * @param {String} format - Text format, e.g. 'json'
 * @param {String} outputPath - Full path where the file will be created, including the file name
*/
async function writeArrayToFile(items, format, outputPath) {
  const content = stringer.fromArray(format, items);
  await fs.writeFile(outputPath, content, 'utf8');
  console.log(`%s Created file ${outputPath}`, chalk.green('INFO'));
}

/**
 * Writes Handlebars template to a file.
 * @param {Object} data - Object containing the source data
 * @param {String} templateContent - The template as a string
 * @param {String} outputPath - Full path where the file will be created, including the file name
*/
async function writeHbTemplateToFile(data, templateContent, outputPath) {
  const template = hbTemplate.compileTemplate(templateContent);
  const content = await hbTemplate.render(data, template, hbTemplate.customHelpers());
  await fs.writeFile(outputPath, content, 'utf8');
  console.log(`%s Created file ${outputPath}`, chalk.green('INFO'));
}

/**
 * Writes Object to a file.
 * @param {Object} item - Item
 * @param {String} format - Text format, e.g. 'json'
 * @param {String} outputPath - Full path where the file will be created, including the file name
*/
async function writeObjectToFile(item, format, outputPath) {
  const content = stringer.fromObject(format, item);
  await fs.writeFile(outputPath, content, 'utf8');
  console.log(`%s Created file ${outputPath}`, chalk.green('INFO'));
}

module.exports = { ensureDirectory, writeArrayToFile, writeHbTemplateToFile, writeObjectToFile };
