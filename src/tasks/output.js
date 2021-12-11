'use strict';

const fs = require('fs').promises;

const chalk = require('chalk');

const { stringer } = require('../serialize');

/**
 * @module tasks/output
*/

/**
 * Log item.
 * @param {Object} item - Item
 * @param {String} owner - The name of the account or category that the items belong to
 * @param {String} singularName - Singular name for an item, e.g. 'object'
*/
function logItem(item, owner, singularName) {
  const itemIdentifier = `${item.name} (ID: ${item.id})`;
  console.log(`%s ${singularName} ${itemIdentifier} found for ${owner}`, chalk.blue('INFO'));
}

/**
 * Log number of items.
 * @param {Array<Object>} items - Items
 * @param {String} owner - The name of the account or category that the items belong to
 * @param {String} singularName - Singular name for an item, e.g. 'object'
 * @param {String} pluralName - Plural for items, e.g. 'objects'
*/
function logItemCount(items, owner, singularName, pluralName) {
  switch (items.length) {
  case 0:
    throw new Error(`No ${pluralName} found for ${owner}`);
  case 1:
    console.log(`%s 1 ${singularName} found for ${owner}`, chalk.blue('INFO'));
    break;
  default:
    console.log(`%s ${items.length} ${pluralName} found for ${owner}`, chalk.blue('INFO'));
    break;
  }
}

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
  let content = stringer.fromArray(format, items);
  await fs.writeFile(outputPath, content, 'utf8');
  console.log(`%s Wrote file ${outputPath}`, chalk.green('INFO'));
}

/**
 * Writes Object to a file.
 * @param {Object} item - Item
 * @param {String} format - Text format, e.g. 'json'
 * @param {String} outputPath - Full path where the file will be created, including the file name
*/
async function writeObjectToFile(item, format, outputPath) {
  let content = stringer.fromObject(format, item);
  await fs.writeFile(outputPath, content, 'utf8');
  console.log(`%s Wrote file ${outputPath}`, chalk.green('INFO'));
}

module.exports = { ensureDirectory, logItem, logItemCount, writeArrayToFile, writeObjectToFile };
